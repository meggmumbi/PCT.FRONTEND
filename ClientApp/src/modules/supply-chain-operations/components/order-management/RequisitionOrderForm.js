import React, { useEffect, useState, useContext } from "react";
import {Helmet} from "react-helmet-async";
import {Box, Breadcrumbs, Button, Card, CardContent, Divider, Grid, Link, Paper, Typography} from "@mui/material";
import {NavLink, useNavigate} from "react-router-dom";
import TextField from "@mui/material/TextField";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import { DataGrid } from '@mui/x-data-grid';
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getOrders } from "../../apis/product-catalog";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { apiRoutes } from "../../routes/apiRoutes";
//import { useMsal } from "@azure/msal-react";
import { UserInformation } from "../../../../index.js";
import { saveOrderRequisition } from "../../apis/order";



const RequisitionOrderForm = () => {
    //const { accounts } = useMsal();
    //const user = accounts.length > 0 && accounts[0];
    const user = useContext(UserInformation);
    const navigate = useNavigate();
    const {
        isLoading,
        isError,
        data,
    } = useQuery(["getOrders", user.username], getOrders);

    const mutation = useMutation({ mutationFn: saveOrderRequisition });
       
    if (isLoading) {
        return "...loading";
    }

    if (isError) {
        return "...error";
    }
    const orderIds = data.data.map((order) => ({ 
        shoppingCartId: order.shoppingCartId,
    }));
    // Calculate the sum of 'totals' property
    const sumTotals = data.data.reduce(function (acc, obj) {
        return acc + obj.totals;
    }, 0);

    const handleSaveOrderRequisition = async () => {
        try {
            const response = await mutation.mutateAsync({
                email: user.username,
                TotalAmount: sumTotals,
                requisitionOrderItems: orderIds
            });
            toast.success('Order Requsition was successfully!', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            navigate("/psa/order-tracking/" + response.data.orderId);
        } catch (error) {
           console.error("Error Making an order requisition:", error);

            toast.error('Error Making an order requisition', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }

    };


    return (
        <React.Fragment>
            <ToastContainer />
            <Helmet title="Requisition Order Form" />
            <Breadcrumbs aria-label="Breadcrumb" mt={2} gutterBottom>
                <Link component={NavLink} to="/">
                    PCT
                </Link>
                <Link component={NavLink} to="/psa">
                    Supply Chain Operations
                </Link>
                <Link component={NavLink} to="/psa/create-new-order">
                    Home
                </Link>
                <Typography>Requisition Order Form</Typography>
            </Breadcrumbs>
            <Box mt={4}>
                <Paper square={true} sx={{ borderTop: 5 }}>
                    <Card>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                Requisition Order Form
                            </Typography>
                            <Divider />
                        </CardContent>
                    </Card>
                    <div style={{ height: 400, width: "100%" }}>
                    <DataGrid
                        rows={data.data}
                        getRowId={(row) => row.shoppingCartId}
                        columns={[
                            {
                                field: 'productName',
                                headerName: 'Product Name',
                                flex: 1,
                                editable: false,
                            },
                            {
                                field: 'productCategory',
                                headerName: 'Product Category',
                                flex: 1,
                                editable: false,
                            },
                            {
                                field: 'quantity',
                                headerName: 'Quantity Selection',
                                type: 'number',
                                flex: 1,
                                editable: false,
                            },
                            {
                                field: 'totals',
                                headerName: 'Total Cost',
                                type: 'number',
                                flex: 1,
                                editable: false,
                            },
                            {
                                field: 'deliveryDate',
                                headerName: 'Requested Delivery Date',
                                sortable: false,
                                flex: 1,
                            },
                            ]}
                         
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 5 },
                            },
                        }}
                        pageSizeOptions={[5, 10]}
                        />
                    </div>

                    <Grid container spacing={2} mt={2}>
                        <Grid item md={6}>&nbsp;</Grid>
                        <Grid item md={3}>
                            <Button
                                variant="contained"
                                sx={{ backgroundColor: "black" }}
                                fullWidth
                            >
                                CANCEL
                            </Button>
                        </Grid>
                        <Grid item md={3}>
                            <Button
                                variant="contained"
                                sx={{ backgroundColor: "orange" }}
                                fullWidth
                                onClick={handleSaveOrderRequisition}
                            >
                                SAVE ORDER REQUISITION
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </React.Fragment>
    );
};
export default RequisitionOrderForm;
