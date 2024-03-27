import React, {useEffect, useState} from "react";
import {Helmet} from "react-helmet-async";
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
    CardMedia, CardActions, Button,  Input, OutlinedInput
} from "@mui/material";
import {NavLink, useParams} from "react-router-dom";
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import {useQuery} from "@tanstack/react-query";
import {getProductSelected} from "../../apis/product-catalog";
import axios from 'axios';
import { apiRoutes } from "../../routes/apiRoutes";


const ProductDetails = () => {
    const [imageSrc, setImageSrc] = useState(null);
    let { identifier } = useParams();
    alert(identifier)
    const {
        isLoading,
        isError,
        data
    } = useQuery(["getProductSelected", identifier], getProductSelected, {
        enabled: !!identifier
    });

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

    return (
        <React.Fragment>
            <Helmet title="Product Details" />
            <Breadcrumbs aria-label="Breadcrumb" mt={2} gutterBottom>
                <Link component={NavLink} to="/">
                    PCT
                </Link>
                <Link component={NavLink} to="/">
                    Supply Chain Operations
                </Link>
                <Link component={NavLink} to="/">
                    Home
                </Link>
                <Typography>Product Details</Typography>
            </Breadcrumbs>
            <Box mt={4}>
                <Paper square={true} sx={{ borderTop: 5 }} elevation={8}>
                    <Card>
                        <CardContent>
                            <Typography gutterBottom variant="h4" component="div" style={{ fontColor: "grey" }}>
                                Product Details
                            </Typography>
                            <Divider />
                        </CardContent>
                    </Card>                    
                    <Card>
                        <React.Fragment>
                            <Grid container>
                                <Grid xs={6}>
                                    <CardMedia
                                        sx={{ objectFit: "fill" }}
                                        component="img"
                                        image={imageSrc}
                                        alt=""
                                    />
                                </Grid>
                                <Grid xs={6}>
                                    <div>
                                        <CardContent>
                                            <Typography variant="h3" color="orange"  style={{ fontColor: "orange" }}>{data.data.family}</Typography>
                                            <Typography variant="h6" color="orange"  style={{ fontColor: "orange" }}>{data.data.identifier}</Typography>
                                            <p style={{ fontColor: "silver" }}>{data.data.values.PRODUCT_DESCRIPTION[0].data}</p>
                                            <p style={{ fontColor: "silver" }}>Unit Price Of Product: {data.data.values.price_reference[0].data[0].amount}</p>
                                            <p style={{ fontColor: "silver" }}>Required Delivery Date:
                                                    <Input id="my" type="date" className="mx-4" />
                                            </p>
                                            
                                            <div style={{ display: "flex" }}>
                                                <Button size="large" variant="outlined">
                                                    <RemoveIcon />
                                                </Button>
                                                <OutlinedInput id="my-input" type="number" aria-describedby="my-helper-text" />
                                                <Button size="large" variant="outlined" >
                                                    <AddIcon />
                                                </Button>
                                            </div>                                           
                                            
                                        </CardContent>
                                        <CardActions>
                                            <Button size="large" variant="contained" style={{ backgroundColor: "orange" }}>
                                                Order Product <ShoppingBasketIcon className="mx-4"/>
                                            </Button>                                            
                                        </CardActions>
                                        <div>
                                            <Typography variant="h6" color="red">ORDER OTHER PRODUCTS IN BULK</Typography>
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                        </React.Fragment>                         
                        
                    </Card>
                </Paper>
            </Box>
        </React.Fragment>
    );
};
export default ProductDetails;
