import React, { useEffect, useState } from "react";
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
    Typography
} from "@mui/material";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getFamilyProducts, getProductImage } from "../../apis/product-catalog";
import { DataGrid } from "@mui/x-data-grid";
import axios from 'axios';

const ProductsList = () => {
    let { family_code } = useParams();
    const {
        isLoading,
        isError,
        data
    } = useQuery(["getFamilyProducts", family_code], getFamilyProducts);

    if (isLoading) {
        return "...loading";
    }

    if (isError) {
        return "...error";
    }

    function GetProductPrice(params) {
        const val = params.value;
        if (val.price_reference && val.price_reference.length > 0) {
            return val.price_reference[0].data[0].currency.concat(" ", val.price_reference[0].data[0].amount);
        }
    }

    return (
        <React.Fragment>
            <Helmet title="Products List" />
            <Breadcrumbs aria-label="Breadcrumb" mt={2} gutterBottom>
                <Link component={NavLink} to="/">
                    PCT
                </Link>
                <Link component={NavLink} to="/">
                    Supply Chain Operations
                </Link>
                <Link component={NavLink} to="/psa/create-new-order">
                    Create New Order
                </Link>
                <Typography>Product Details</Typography>
            </Breadcrumbs>
            <Box mt={4}>
                <Paper square={true} sx={{ borderTop: 5 }} elevation={8}>
                    <Card>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                Family Details
                            </Typography>
                            <Divider />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Box>
                                        <CardContent sx={{ flex: '1 0 auto' }}>
                                            <Typography component="div" variant="h3" sx={{ color: "#E47202" }}>
                                                {family_code}
                                            </Typography>
                                            <div style={{ height: 400, width: "100%" }}>
                                                <DataGrid
                                                    rows={data.data._embedded.items}
                                                    getRowId={(row) => row.identifier}                                                    
                                                    columns={[
                                                        {
                                                            field: "identifier",
                                                            headerName: 'Product Name',
                                                            editable: false,
                                                            flex: 1,
                                                            renderCell: (params) => (
                                                                <NavLink to={`/psa/product-details-page/${params.row.identifier}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                                    {params.value}
                                                                </NavLink>
                                                            ),
                                                        },
                                                        {
                                                            field: "values",
                                                            headerName: 'Product Price',
                                                            editable: false,
                                                            flex: 1,
                                                            valueGetter: GetProductPrice,
                                                        }
                                                    ]}
                                                    initialState={{
                                                        pagination: {
                                                            paginationModel: { page: 0, pageSize: 5 },
                                                        },
                                                    }}
                                                    pageSizeOptions={[5, 10]}
                                                />
                                            </div>
                                        </CardContent>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Paper>
            </Box>
        </React.Fragment>
    );
};
export default ProductsList;
