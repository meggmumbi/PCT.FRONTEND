import React, { useEffect, useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Box, Breadcrumbs, Button, Card, CardContent, Divider, Grid, Link, Paper, Typography, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { NavLink, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DataGrid, GridToolbarContainer, GridToolbarFilterButton, GridToolbarDensitySelector, GridToolbarExport } from '@mui/x-data-grid';
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getHistoricalOrders } from "../../apis/product-catalog";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";


//import { useMsal } from "@azure/msal-react";
import { saveOrderRequisition } from "../../apis/order";

const searchFilterStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "2rem",
    marginBottom: "1rem",
};

const filterContainerStyles = {
    display: "flex",
    alignItems: "center",
    marginTop: "1rem",
    marginBottom: "1rem",
};

const filterStyles = {
    marginRight: "1rem",
};

const dataGridContainerStyles = {
    height: "calc(100vh - 350px)",
    width: "100%",
};



const HistoricalOrder = () => {

    const [productFilter, setProductFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    //const user = useContext(UserInformation);
    const navigate = useNavigate();
    const {
        isLoading,
        isError,
        data,
    } = useQuery(["getHistoricalOrders"], getHistoricalOrders);

    const mutation = useMutation({ mutationFn: saveOrderRequisition });

    if (isLoading) {
        return "...loading";
    }

    if (isError) {
        return "...error";
    }


    const filteredData = data.data.filter((row) => {
       
        const productNameMatch = !productFilter || row.productName.includes(productFilter);
        const categoryMatch = !categoryFilter || row.productCategory.includes(categoryFilter);

        return productNameMatch && categoryMatch;
    });

    return (
        <React.Fragment>
            <ToastContainer />
            <Helmet title="Historical Orders" />
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
                <Typography>Historical Orders</Typography>
            </Breadcrumbs>
            
            <div style={searchFilterStyles}>
                {/* Search bar */}
                <div style={{ flex: 1, marginRight: "1rem" }}>
                    <TextField
                        label="Search"
                        variant="outlined"
                        size="small"
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>
                
               
            </div>
        
            <div style={filterContainerStyles}>
                <Typography style={{ marginRight: "1rem" }}>Filter By : </Typography>
                <div style={filterStyles}>
                    <TextField
                        label="Product"
                        variant="outlined"
                        size="small"
                        value={productFilter}
                        onChange={(e) => setProductFilter(e.target.value)}
                    />
                </div>
                <div style={filterStyles}>
                    <TextField
                        label="Product Category"
                        variant="outlined"
                        size="small"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    />
                </div>
            </div>
           
           
            <div style={dataGridContainerStyles}>
              
                        <DataGrid

                            rows={data.data}
                            getRowId={(row) => row.orderId}
                            columns={[
                                {
                                    field: 'orderId',
                                    headerName: 'Order ID',
                                    flex: 1,
                                    editable: false,
                                },                                
                                
                                {
                                    field: 'totalAmount',
                                    headerName: 'Total Cost',                                   
                                    flex: 1,
                                    editable: false,
                                },
                                {
                                    field: 'orderDate',
                                    headerName: 'Expected Delivery',
                                    sortable: false,
                                    flex: 1,
                                },
                                {
                                    field: 'isRequisitioned',
                                    headerName: 'Status',
                                    flex: 1,
                                    editable: false,
                                    renderCell: (params) => (
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            {params.value ? (
                                                <>
                                                    <CheckCircleOutlineIcon style={{ color: "green", marginRight: 4 }} />
                                                    <Typography variant="body2" style={{ color: "green" }}>Requisitioned</Typography>
                                                </>
                                            ) : (
                                                <>
                                                    <CancelOutlinedIcon style={{ color: "red", marginRight: 4 }} />
                                                    <Typography variant="body2" style={{ color: "red" }}>Not Requisitioned</Typography>
                                                </>
                                            )}
                                        </div>
                                    ),
                                },
                            ]}
                            components={{
                                Toolbar: CustomToolbar,
                            }}
                            initialState={{
                                pagination: {
                                    paginationModel: { page: 0, pageSize: 5 },
                                },
                            }}
                            pageSizeOptions={[5, 10]}
                            rowStyle={(params) => ({
                                backgroundColor: params.rowIndex % 2 === 0 ? "#424242" : "black",
                            })}
                        />
                    </div>
                
        </React.Fragment>
    );
};

const CustomToolbar = () => (
    <GridToolbarContainer>
        <Typography variant="h5">
            Historical Orders
        </Typography>
        <Box display="flex" alignItems="center" justifyContent="flex-end" width="100%" mb={2}>
                <Box ml={2}>
                    <GridToolbarFilterButton />
                </Box>
                <Box ml={2}>
                    <GridToolbarDensitySelector />
                </Box>
                <Box ml={2}>
                    <GridToolbarExport />
                </Box>
            </Box>
      
    </GridToolbarContainer>
);



export default HistoricalOrder;
