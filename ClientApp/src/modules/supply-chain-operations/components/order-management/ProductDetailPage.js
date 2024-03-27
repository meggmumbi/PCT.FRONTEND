import React, { useEffect, useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import {
    Box,
    Breadcrumbs,
    Card,
    CardContent,
    Divider,
    Grid,
    Link,
    Paper,
    Typography,
    TextField,
    Button,
    IconButton,
    Input, OutlinedInput

} from "@mui/material";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import {getFamilyProducts, getProductSelected} from "../../apis/product-catalog";
import SearchResultsList from "../order-management/SearchResultsList";

import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { apiRoutes } from "../../routes/apiRoutes";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import SearchIcon from '@mui/icons-material/Search';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ShoppingCartOutlined } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { DatePicker } from "@mui/x-date-pickers";
import { addToShoppingCart } from "../../apis/order";
//import { useMsal } from "@azure/msal-react";
import { UserInformation } from "../../../../index.js";


const ProductDetailPage = () => {
    //const { accounts } = useMsal();
    //const user = accounts.length > 0 && accounts[0];
    const user = useContext(UserInformation);
    const [imageSrc, setImageSrc] = useState(null);
    const [searchFamilyField, setsearchFamilyField] = useState("hidden");
    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    let { product_code } = useParams();
    const navigate = useNavigate();

    const mutation = useMutation({ mutationFn: addToShoppingCart });

    const formik = useFormik({
        initialValues: {
            quantity: 0,
            deliveryDate: "",
        },
        validationSchema: Yup.object().shape({
            quantity: Yup.string().required("Required"),
            deliveryDate: Yup.date().required("Required"),
        }),
        
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            try {
                const cartItem = {
                    ProductName: product_code,
                    ProductCategory: data.data.family,
                    Totals: parseFloat(totalAmount),
                    Quantity: parseInt(values.quantity),
                    Email: user.username,
                    DeliveryDate: values.deliveryDate ? new Date(values.deliveryDate).toISOString() : null,
                };
                const response = await mutation.mutateAsync(cartItem);
                toast.success('Product added to cart successfully!', {
                    position: 'top-right',
                    autoClose: 3000, 
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            } catch (error) {
                toast.error('Error adding product to cart', {
                    position: 'top-right',
                    autoClose: 3000, 
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        },
    });

    const {
        isLoading,
        isError,
        data:data,
    } = useQuery(["getProductSelected", product_code], getProductSelected, {
        enabled: !!product_code
    });

    //let family_code = data.data.family;
    //const { data: postsData } = useQuery(["getFamilyProducts", family_code], getFamilyProducts);
    

    useEffect(() => {
        async function getImage() {
            if (!isLoading) {
                const imageURL = data.data.values && data.data.values.IMAGE_ATTRIBUTE && data.data.values.IMAGE_ATTRIBUTE.length > 0 ? data.data.values.IMAGE_ATTRIBUTE[0]._links.download.href : "";
                const response = await axios.get(`${apiRoutes.productcatalog}/api/Products/GetImage?imageURL=${imageURL}`, {
                    responseType: 'arraybuffer',
                    headers: {
                        Accept: 'image/jpeg',
                    },
                });

                const imageData = response.data;
                const imageReturned = URL.createObjectURL(new Blob([imageData], { type: 'image/jpeg' }));
                setImageSrc(imageReturned);
            }
        }
        getImage();
    }, [isLoading, data]);
    
    if (isLoading) {
        return "...loading";
    }

    if (isError) {
        return "...error";
    }

    const product = data.data;

    const productDescription =
        product.values.PRODUCT_DESCRIPTION[0].data;
    const unitPrice = parseFloat(
        product.values.price_reference[0].data[0].amount
    );
    const currency = product.values.price_reference[0].data[0].currency;

    const totalAmount = (formik.values.quantity * unitPrice).toFixed(2);

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= 1) {
            formik.setFieldValue('quantity', newQuantity);
        }
    };

    const handleCheckout = () => {
        
        navigate("/psa/requisition-order-form");
    };

    
    const searchProducts = (e) => {
        var searchVal = e.target.value.toLowerCase();

        setSearchInput(searchVal)
    };
    
    return (
        <React.Fragment>
            <ToastContainer />
            <Helmet title="Product Details" />

            <Breadcrumbs aria-label="Breadcrumb" mt={2} gutterBottom>
                <Link component={NavLink} to="/">
                    PCT
                </Link>
                <Link component={NavLink} to="/">
                    Supply Chain Operations
                </Link>
                <Link component={NavLink} to={`/psa/create-new-order`}>
                    Create New Order
                </Link>
                <Link component={NavLink} to={`/psa/products-list/${data.data.family}`}>
                   Product List
                </Link>
                <Typography>Product Details</Typography>
            </Breadcrumbs>
            <Box mt={4} sx={{ borderTop: 5, width: "100%", height: "100%" }} >           
                <Paper square={true} sx={{ borderTop: 5 }}  elevation={8}>
                    <Card>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                Product Details
                            </Typography>
                            <Divider />
                        </CardContent>
                    </Card>
                    <Card sx={{ display:'flex' }}>
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6} sx={{ flex: '1 0 auto' }}>
                                    <Input id="searchFamily" placeholder="Search for products in this Family" style={{width:"200px", cursor:"pointer"}}  
                                           onChange={(e) =>
                                        searchProducts(e)
                                    } autoComplete="off"></Input>
                                    <SearchIcon />
                                    
                                    <SearchResultsList input={searchInput} family={ data.data.family }/>
                                    
                                    <img
                                        src={imageSrc}
                                        alt={product_code}
                                        style={{ maxWidth: "100%", height: "auto" }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <form onSubmit={formik.handleSubmit}>
                                        <Typography
                                            gutterBottom
                                            variant="h5"
                                            component="div"
                                            sx={{ color: "#E47202" }}
                                        >
                                            {product_code}
                                        </Typography>
                                   
                                        <Typography variant="body2" color="text.secondary" sx={{ marginTop: "3rem" }}>
                                            {productDescription}
                                        </Typography>
                                   
                                        <Card sx={{
                                            maxWidth: '100%', margin: '0', display: 'flex', marginTop: "3rem",
                                            borderRadius: "10px",
                                            border: "1px solid #ccc",
                                            padding: "20px",
                                            boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.5)" }}>
                                            <CardContent style={{ width: '100%', textAlign: 'left' }}>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} md={6}>
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary" 
                                                            sx={{ marginBottom: "2rem" }}
                                                        >
                                                            Estimated Cost of Product: {unitPrice} {currency}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} md={6}>
                                                        <DatePicker
                                                            label="Required Delivery Date"
                                                            value={formik.values.deliveryDate}
                                                            onChange={(value) =>
                                                                formik.setFieldValue("deliveryDate", value, true)
                                                            }
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    error={Boolean(
                                                                    formik.touched.deliveryDate &&
                                                                        formik.errors.deliveryDate
                                                                    )}
                                                                    helperText={
                                                                    formik.touched.deliveryDate &&
                                                                    formik.errors.deliveryDate
                                                                    }
                                                                    margin="normal"
                                                                    name="deliveryDate"
                                                                    variant="outlined"
                                                                    my={2}
                                                                    {...params}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                </Grid>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} md={6}>
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                            sx={{ marginTop: "2rem" }}
                                                        >
                                                            Total: {totalAmount} {currency}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} md={6}>
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                marginTop: "2rem",
                                                                width: "300px",
                                                                borderRadius: "20px",
                                                                background: "#f0f0f0",
                                                                padding: "10px",
                                                            }}
                                                        >
                                                            <IconButton
                                                                onClick={() =>
                                                                    handleQuantityChange(formik.values.quantity - 1)
                                                                }
                                                            >
                                                                <RemoveIcon />
                                                            </IconButton>
                                                                <TextField
                                                                    name="quantity"
                                                                    label="Quantity"
                                                                    required
                                                                    value={formik.values.quantity}
                                                                    error={Boolean(
                                                                    formik.touched.quantity && formik.errors.quantity
                                                                    )}
                                                                    helperText={
                                                                    formik.touched.quantity && formik.errors.quantity
                                                                    }
                                                                    onBlur={formik.handleBlur}
                                                                    onChange={formik.handleChange}
                                                                    variant="outlined"
                                                                    type="number"
                                                                    my={2}
                                                                />
                                                            <IconButton
                                                                onClick={() =>
                                                                    handleQuantityChange((formik.values.quantity + 1))
                                                                }
                                                            >
                                                                <AddIcon />
                                                            </IconButton>
                                                        </div>
                                                    </Grid>
                                                </Grid>

                                            <Button
                                                variant="contained"
                                                color="primary"
                                                sx={{
                                                    marginTop: "2rem",
                                                    width: "100%",
                                                    height: "50px",
                                                    backgroundColor: "#E47202",
                                                }}
                                                type="submit"
                                            >
                                                Add to Cart
                                                Order Product <ShoppingBasketIcon className="mx-4" />
                                            </Button>


                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                sx={{
                                                    marginTop: "1rem",
                                                    width: "100%",
                                                    height: "50px",
                                                    borderColor: "#E47202",
                                                    color: "#E47202",
                                                }}
                                                onClick={handleCheckout}
                                            >
                                                Checkout <ShoppingCartOutlined className="mx-2" />
                                            </Button>
                                            </CardContent>
                                        </Card>
                                    </form> 
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Paper>
            </Box>
        </React.Fragment>
    );
};

export default ProductDetailPage;
