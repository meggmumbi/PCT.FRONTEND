import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Card,
    CardContent,
    Grid,
    Paper,
    Typography,
    TextField,
    Button,
    IconButton

} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { apiRoutes } from "../../../routes/apiRoutes";
import { getProductSelected} from "../../../apis/product-catalog";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import { ShoppingCartOutlined } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { DatePicker } from "@mui/x-date-pickers";
import CardMedia from "@mui/material/CardMedia";
import {styled} from "@mui/material/styles";
import ReplyIcon from '@mui/icons-material/Reply';
import Select from "@mui/material/Select";
import { MenuItem} from "@mui/material";
import { toast } from "react-toastify";

import 'react-toastify/dist/ReactToastify.css';
import { getFromLocalStorage, setLocalStorage } from "../../../../../common/utils/LocalStorage";


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#fff' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    color: theme.palette.text.secondary,
    boxShadow:"rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px !important"
}));

const AsyncImage = (props) => {
    const [loadedSrc, setLoadedSrc] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);

    useEffect(() => {
        console.log("props.src"+props.src)
        setLoadedSrc(false);
        if (props.src) {
            axios.get(`${apiRoutes.productcatalog}/api/Pcmt/GetImage?imageURL=${props.src}`, {
                responseType: 'arraybuffer',
                headers: {
                    Accept: 'image/jpeg',
                },
            }).then(response =>{
                const imageData = response.data;
                const imageReturned = URL.createObjectURL(new Blob([imageData], { type: 'image/jpeg' }));
                setImageSrc(imageReturned)
                setLoadedSrc(true);
            }).catch((error) => console.log("caught image load error ", error))
        }
    }, [props.src]);

    return (
        <>
            {loadedSrc &&
                <CardMedia
                    sx={{ objectFit: "fill",width:'400px',height:'600px' }}
                    component="img"
                    image={imageSrc}
                    alt=""
                />
            }
            {!loadedSrc &&
                <img
                    style={{ objectFit: "fill",width:'400px',height:'600px' }}
                    src="https://clipart-library.com/img/944086.png"
                    alt="Paella dish"
                />
            }

        </>
    );
};

const ProductDetailPage = (props) => {
    const [imageSrc, setImageSrc] = useState(null);
    const { product_code } = useParams();
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();

    console.log("Product code on product details page", product_code);
    const formik = useFormik({
        
        initialValues: {
            quantity: 1,
            deliveryCost:null,
            leadTime:30,
            deliveryDate:null,
            currency:null,
            transportMode:null,
            totalAmount:null,
            unitPrice:null,
            productDescription:null,
        },
        enablereinitialize: true,
        validationSchema: Yup.object().shape({
            quantity: Yup.string().required("Required"),
            transportMode: Yup.string().required("Required")
        }),
        onSubmit: (values, { resetForm, setSubmitting }) => {
            try {
                let _tems = cartItems.filter((item) => item.productCode !== product_code);
                _tems.push({
                    productCode: product_code,
                    productName: product_code,
                    productCategory:data.data.family,
                    quantity: values.quantity,
                    unitPrice:values.unitPrice,
                    estimatedDeliveryCost:values?.deliveryCost ,
                    estimatedLeadTime:values?.leadTime || 30,
                    deliveryDate:values.deliveryDate,
                    transportMode:values.transportMode,
                    total: parseFloat(values.totalAmount),
                })
                setCartItems(_tems);
                setLocalStorage('requisition-order-cart-items', _tems)
                //const response = await mutation.mutateAsync(cartItem);
                toast.success('Product added to cart successfully!', {
                    position: 'top-right',
                    autoClose: 3000, 
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                navigate("/psa/requisition-order-cart")
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
        data
    } = useQuery(["getProductSelected", product_code], getProductSelected, {
        enabled: !!product_code
    });

    //let family_code = data.data.family;
    //const { data: postsData } = useQuery(["getFamilyProducts", family_code], getFamilyProducts);
    useEffect(() => {
        let _items = getFromLocalStorage('requisition-order-cart-items');
        _items && setCartItems(_items);
     }, [])

    useEffect(() => {
        if (!isLoading) {
            const imageURL = data.data.values 
                && data.data.values.IMAGE_ATTRIBUTE 
                && data.data.values.IMAGE_ATTRIBUTE.length > 0 
                ? data.data.values.IMAGE_ATTRIBUTE[0]._links.download.href 
                : "";
            setImageSrc(imageURL );

            const product = data.data;
            const productDescription =
                product.values.PRODUCT_DESCRIPTION[0].data;
            formik.setFieldValue('productDescription', productDescription);
            const unitPrice = parseFloat(
                product.values.price_reference[0].data[0].amount
            );
            formik.setFieldValue('unitPrice', unitPrice);

            const currency = product.values.price_reference[0].data[0].currency;
            formik.setFieldValue('currency', currency);
            
            const totalAmount = (formik.values.quantity * unitPrice).toFixed(2);
            formik.setFieldValue('totalAmount', totalAmount);
        }
    }, [isLoading, data]);

    useEffect(() => {
        let tamount =  parseFloat(formik.values.quantity)  
        * parseFloat(formik.values.unitPrice);
        tamount += parseFloat(formik.values.deliveryCost??0);
        formik.setFieldValue('totalAmount', parseFloat(tamount).toFixed(2));

    }, [formik.values.quantity, formik.values.unitPrice, formik.values.deliveryCost])
    
    if (isLoading) {
        return "...loading";
    }

    if (isError) {
        return "...error";
    }
    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= 1) {
            formik.setFieldValue('quantity', newQuantity);
        }
    };



    return (
        <React.Fragment>

            <Grid container >
                <Grid item xs={12} md={12} sx={{padding:"5px"}}>
                    <Item>
                        <Grid container spacing={2} direction="row" justifyContent="center"  alignItems="center" sx={{padding:"20px"}}>
                            <Grid item xs={12} md={10}>
                                <Typography gutterBottom variant="h5" sx={{color:'#000'}}>
                                    Product Details
                                </Typography>
                            </Grid>
                        </Grid>

                    </Item>
                    <Item sx={{marginTop:"5px"}}>
                        <Card>
                            <CardContent sx={{width:'90%'}}>
                                <Grid container spacing={2} >
                                    <Grid item xs={12} md={7}>
                                        <AsyncImage src={imageSrc} />
                                    </Grid>
                                    <Grid item xs={12} md={5}>
                                        <form onSubmit={formik.handleSubmit} >
                                            <Typography
                                                gutterBottom
                                                variant="h5"
                                                component="div"
                                                sx={{ color: "#E47202" }}
                                            >
                                                {product_code}
                                            </Typography>

                                            <Typography variant="body2" color="text.secondary" sx={{ marginTop: "3rem" }}>
                                                {formik.values.productDescription}
                                            </Typography>

                                            <Card sx={{
                                                maxWidth: '100%', margin: '0', display: 'flex', marginTop: "3rem",
                                                borderRadius: "10px",
                                                border: "1px solid #ccc",
                                                padding: "20px",
                                                boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.5)" }}>
                                                <CardContent style={{ width: '100%', textAlign: 'left' }}>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12} md={12}>
                                                            <div
                                                                style={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    marginTop: "1rem",
                                                                    borderRadius: "20px",
                                                                    background: "#fff",
                                                                    padding: "10px",
                                                                    width:"100%",
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
                                                                    style={{width:"100%"}}
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
                                                         <Grid item xs={12} md={12}>
                                                            <Grid container spacing={2}  >
                                                             <Grid item  xs={12} md={12} my={2} >
                                                                    <Typography
                                                                        sx={{ color:'#E19133',fontWeight:'bold',fontSize:'16px' }}
                                                                    >
                                                                        Estimated Cost of Product: {formik.values.totalAmount} {formik.values.currency}
                                                                    </Typography>
                                                            </Grid>
                                                             <Grid item  xs={6} md={6} justify="flex-end">
                                                                    <Typography
                                                                        variant="body2"
                                                                        color="text.secondary"
                                                                        sx={{ marginBottom: "2rem",fontSize:'11px' }}
                                                                    >
                                                                        Est. Unit Cost
                                                                    </Typography>
                                                            </Grid>
                                                            <Grid item  xs={6} md={6} justify="flex-end">
                                                                <TextField 
                                                                    name="unitPrice"
                                                                    style={{width:"100%"}}
                                                                    sx={{ fontSize:'11px' }}
                                                                    required
                                                                    value={formik.values.unitPrice}
                                                                    error={Boolean(
                                                                        formik.touched.unitPrice && formik.errors.unitPrice
                                                                    )}
                                                                    helperText={
                                                                        formik.touched.unitPrice && formik.errors.unitPrice
                                                                    }
                                                                    onBlur={formik.handleBlur}
                                                                    onChange={(e) => formik.handleChange(e)}
                                                                    variant="standard"
                                                                >
                                                                   
                                                                </TextField>
                                                             </Grid>
                                                            </Grid>

                                                            <Grid container spacing={1} mt={1} >
                                                             <Grid item  xs={6} md={6} my={2} >
                                                                <Typography   
                                                                         variant="body2"
                                                                        color="text.secondary"
                                                                        sx={{ fontSize:'11px' }} >
                                                                    Estimated Cost of Delivery
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item  xs={6} md={6} justify="flex-end">
                                                                <TextField 
                                                                    name="deliveryCost"
                                                                    style={{width:"100%"}}
                                                                    sx={{ fontSize:'11px' }}
                                                                    required
                                                                    value={formik.values.deliveryCost}
                                                                    error={Boolean(
                                                                        formik.touched.deliveryCost && formik.errors.deliveryCost
                                                                    )}
                                                                    helperText={
                                                                        formik.touched.deliveryCost && formik.errors.deliveryCost
                                                                    }
                                                                    onBlur={formik.handleBlur}
                                                                    onChange={(e) => formik.handleChange(e)}
                                                                    variant="standard"
                                                                >
                                                                   
                                                                </TextField>
                                                             </Grid>
                                                             <Grid item  xs={6} md={6} justify="flex-end">
                                                                <Typography 
                                                                  variant="body2"
                                                                  color="text.secondary"
                                                                  sx={{ fontSize:'11px' }}
                                                                >
                                                                    Estimated Lead Time
                                                                </Typography>
                                                             </Grid>
                                                             <Grid item  xs={6} md={6} justify="flex-end">
                                                                <TextField 
                                                                    sx={{ fontSize:'11px' }}
                                                                    name="leadTime"
                                                                    
                                                                    style={{width:"100%"}}
                                                                    required
                                                                    value={formik.values.leadTime}
                                                                    error={Boolean(
                                                                        formik.touched.leadTime && formik.errors.leadTime
                                                                    )}
                                                                    helperText={
                                                                        formik.touched.leadTime && formik.errors.leadTime
                                                                    }
                                                                    onBlur={formik.handleBlur}
                                                                    onChange={(e) => formik.handleChange(e)}
                                                                    variant="standard"
                                                                >
                                                                   
                                                                </TextField>
                                                             </Grid>
                                                           </Grid>
                                                        </Grid>
                                                     

                                                        <Grid item xs={12} md={12}>
                                                            <Grid container spacing={5}  >
                                                             <Grid item  xs={6} md={6} my={2} >
                                                                <Typography
                                                                     variant="body2"
                                                                     color="text.secondary"
                                                                     sx={{ fontSize:'11px' }}
                                                                >
                                                                    Preferred Mode of Transport:
                                                                </Typography>
                                                            </Grid>
                                            
                                                             <Grid item  xs={6} md={6} justify="flex-end">
                                                                <Select
                                                                    name="transportMode"
                                                                    sx={{ fontSize:'11px' }}
                                                                    style={{width:"100%"}}
                                                                    required
                                                                    value={formik.values.transportMode}
                                                                    error={Boolean(
                                                                        formik.touched.transportMode && formik.errors.transportMode
                                                                    )}
                                                                    helperText={
                                                                        formik.touched.transportMode && formik.errors.transportMode
                                                                    }
                                                                    onBlur={formik.handleBlur}
                                                                    onChange={(e) => formik.handleChange(e)}
                                                                    variant="standard"
                                                                >
                                                                    {["Air", "Sea", "Road"].map((item)=>(
                                                                        <MenuItem key={`product-family-select-${item}`} value={item}>{item}</MenuItem>
                                                                    ))}
                                                                </Select>
                                                              </Grid>
                                                            </Grid>

                                                            <Grid container spacing={5} mt={1} >
                                                             <Grid item  xs={6} md={6} my={2} >
                                                                <Typography
                                                                      variant="body2"
                                                                      color="text.secondary"
                                                                      sx={{fontSize:'11px' }}
                                                                >
                                                                    Required Delivery Date:
                                                                </Typography>
                                                            </Grid>

                                                             <Grid item  xs={6} md={6} justify="flex-end">
                                                                <DatePicker                                                           
                                                                    name="deliveryDate"
                                                                    id="deliveryDateId"
                                                                    sx={{ fontSize:'11px' }}
                                                                    value={formik.values.deliveryDate}                                                       
                                                                    inputFormat="yyyy-MM-dd"
                                                                    error={Boolean(
                                                                        formik.touched.deliveryDate && formik.errors.deliveryDate
                                                                    )}
                                                                    helperText={
                                                                        formik.touched.deliveryDate && formik.errors.deliveryDate
                                                                    }
                                                                    onBlur={formik.handleBlur}
                                                                    onChange={(value) => formik.setFieldValue("deliveryDate", value)}
                                                                    renderInput={(params) => <TextField variant="standard"{...params} />}                 
                                                                  />                       
                                                              </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid> 
                                                    <input type="hidden" name="currency" value={formik.values.currency} />
                                                    <input type="hidden" name="totalAmount" value={formik.values.totalAmount} />
                                                   


                                                     <Button
                                                        variant="outlined"
                                                        color="secondary"
                                                        type="submit"
                                                        sx={{
                                                            marginTop: "1rem",
                                                            width: "100%",
                                                            height: "50px",
                                                            borderColor: "#E47202",
                                                            color: "#E47202",
                                                        }}
                                                       
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
                    </Item>

                </Grid>
            </Grid>

        </React.Fragment>
    );
};

export default ProductDetailPage;
