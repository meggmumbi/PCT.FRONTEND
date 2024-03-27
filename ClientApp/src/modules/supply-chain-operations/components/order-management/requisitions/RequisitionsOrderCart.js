import React from 'react';
import MaterialReactTable from "material-react-table";
import {
    Button,
    createTheme,
    Grid,
    IconButton,
    ThemeProvider,
    Typography,
    TextField
} from "@mui/material";

import { useMemo, useRef, useState,useContext } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import EditIcon from '@mui/icons-material/Edit';
import UploadIcon from '@mui/icons-material/Upload';
import _ from 'lodash';
import { useMutation } from "@tanstack/react-query";
import { saveRequisition } from "../../../apis/order";
import { ToastContainer, toast } from "react-toastify";
import { SiteContext } from "../../../../../index";
import { useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { DatePicker } from "@mui/x-date-pickers"

import dayjs from "dayjs";
import AsyncImage from '../../AsyncImage';
import {
    getFromLocalStorage,
    removeItem,
    setLocalStorage
} from '../../../../../common/utils/LocalStorage';

function RequisitionsOrderCart(props) {
    const { accounts } = useMsal();
    const lCartItems = getFromLocalStorage('requisition-order-cart-items') || [];

    console.log("lCartItems", lCartItems)
    const user = accounts.length > 0 && accounts[0];
    const tableInstanceRef = useRef(null);
    const [rowSelection, setRowSelection] = useState({});
    const navigate = useNavigate();
    const [localCartData, setLocalCartData] = useState(lCartItems);

    const siteContext = useContext(SiteContext);
    const selectedSite = siteContext.selectedSite;

    const {
        destinationCountry,
        destinationOrganisation,
        requisitionDate,
        email,
        requisitionType,
        isApproved,
        isRequisitioned,
        description,
        code,
        tenantId
    } = getFromLocalStorage('requisition-general-details');

    

    const mutation = useMutation({
        mutationFn: saveRequisition,
        onError: (error, variables, context) => {
            // An error happened!
            toast.error('Error occurred while saving requisition', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        },
        onSuccess: (data, variables, context) => {
            toast.success('Requisition saved successfully!', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            navigate("/psa/requisition-order-list")
        }
    });

    const productImage = (item) => {
        return item.values && item.values.IMAGE_ATTRIBUTE && item.values.IMAGE_ATTRIBUTE.length > 0 ? item.values.IMAGE_ATTRIBUTE[0]._links.download.href : "";
    }

    const getItemRowRenderMarkup = (row, cell) => {

        return (
            <Grid container >
                <Grid xs={2}><AsyncImage src={productImage(row.original)} height={50} /></Grid>
                <Grid xs={10} container orientation="row">
                    <Grid xs={12} sx={{ color: '#586A84', fontSize: 8, wordWrap: 'break-word' }} md={{ fontSize: 8 }}>
                        {row.original.productName}
                    </Grid>
                    <Grid xs={12} sx={{ mb: 1.5, fontSize: "0.8em", color: '#E47200', fontWeight: 'bold' }}>
                        {row.original.productCategory}
                    </Grid>
                </Grid>
            </Grid>
        )
    }

    const columns = useMemo(
        () => [
            {
                accessorKey: 'productName', //simple recommended way to define a column
                header: 'Product',
                enableEditing: false,
                size: 100,
                Cell: ({ cell, row }) => getItemRowRenderMarkup(row, cell),
            },
            {
                accessorKey: 'quantity', //simple recommended way to define a column
                header: 'Quantity',
                size: 100,

            },
            {
                accessorKey: 'transportMode', //simple recommended way to define a column
                header: 'Mode of Transport',
                size: 100,
                editable: 'always',
                editVariant: "select",
                editSelectOptions: ["Sea", "Air", "Road"],
            },
            {
                accessorKey: 'deliveryDate', //simple recommended way to define a column
                header: 'Delivery Date',
                size: 130,
                type: "date",
                format: "yyyy-MM-dd",
                sorting: false,
                Edit: ({ cell }) => <DatePicker
                    value={cell.getValue()}
                    inputFormat="yyyy-MM-dd"
                    onChange={(value) => handleSaveCell(cell, dayjs(value).format('YYYY-MM-DD'))}
                    renderInput={(params) => <TextField variant="standard"{...params} />}
                />
            },
            {
                accessorKey: 'total', //simple recommended way to define a column
                header: 'Totals',
                size: 100,
                enableEditing: false,
            }
        ],
        [],
    );
    const tableTheme = useMemo(

        () =>

            createTheme({

                palette: {
                    background: {
                        default: '#fff'
                    }
                }
            })
    );

    const popError = (message) => {
        toast.error(message, {
            position: 'top-right',
            autoClose: 10000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    }


    const submitRequisition = async () => {
        if (!localCartData) {
            popError("Error, Could not submit empty list of products");
            return false;
        }

        let productError;

        localCartData.map((item, index) => {
            if (!item?.productName) {
                productError = "Error, missing estimated delivery date for " + item.productName + " on line " + (index + 1);
            } 
            else if (!item?.productCategory) {
                productError = "Error, missing product category for " + item.productName + " on line " + (index + 1);
            } 
            else if (!item?.productCode) {
                productError = "Error, missing product code for " + item.productName + " on line " + (index + 1);
            } else if (!item?.quantity) {
                productError = "Error, quantity for " + item.productName + " on line " + (index + 1);
            } else if (!item?.total) {
                productError = "Error, total cost for " + item.productName + " on line " + (index + 1);
            } else if (!item?.transportMode) {
                productError = "Error, Transport mode for " + item.productName + " on line " + (index + 1);
            }
            if (productError) {
                return;
            }
        });

        if (productError) {
            popError(productError);
            return;
        }


        let payload = {
            "code": code,
            "destinationCountry": destinationCountry,
            "destinationOrganisation": destinationOrganisation,
            "requisitionDate": requisitionDate,
            "email": email,
            "requisitionType": requisitionType,
            "totalAmount": _.sumBy(localCartData, 'total'),
            "isApproved": isApproved,
            "isRequisitioned": isRequisitioned,
            "description": description,
            "products": localCartData,
            "TenantId": selectedSite.id
        }
        const response = await mutation.mutateAsync(payload);
        if (response.status === 200) {
            removeItem('requisition-order-cart-items');
        }

    }

    const handleSaveCell = (cell, value) => {
        localCartData[cell.row.index][cell.column.id] = value;
        localCartData[cell.row.index]["estimatedDeliveryCost"] =
            localCartData[cell.row.index]["estimatedDeliveryCost"] ?? 0;
        localCartData[cell.row.index]["transportMode"] =
            localCartData[cell.row.index]["transportMode"] ?? "Air";
        localCartData[cell.row.index]["deliveryDate"] =
            localCartData[cell.row.index]["deliveryDate"] ?? new Date().toISOString().slice(0, 10);
        localCartData[cell.row.index]["estimatedLeadTime"] =
            localCartData[cell.row.index]["estimatedLeadTime"] ?? 90;


        localCartData[cell.row.index]["total"] =
            (localCartData[cell.row.index]["quantity"]
                * localCartData[cell.row.index]["unitPrice"])
            + parseFloat(localCartData[cell.row.index]["estimatedDeliveryCost"] || 0);

        setLocalCartData([...localCartData]);
    };

    const handleRowDelete = row => {
        localCartData.splice(row.index, 1);
        setLocalCartData([...localCartData]);
        if (localCartData.length > 0) {
            setLocalStorage('requisition-order-cart-items', localCartData);
        } else {
            removeItem('requisition-order-cart-items');
        }

    }

    const handleRowEdit = row => {
        let product = localCartData[row.index];
        setLocalStorage('requisition-product-detail-item-code', product.productCode);
        navigate("/psa/requisition-product-details-page/" + product.productCode);
    }

    const orderHeaderCss = {
        fontSize: "34px",
        fontWeight: "bolder",
        textAlign: "left",
        margin: "10px 15px"
    }

    const headerTopGrid = {
        border: "none",
        mariginBotton: "10px",
        boxShadow: "5px"
    }
    const orderHeaderCssSmall = {
        fontSize: "24px",
        fontWeight: "normal",
        textAlign: "left",
        margin: "10px 15px"
    }

    return (
        <>
            <Grid container >
                <ToastContainer />
                <Grid item xs={12} style={{ padding: "10px 5px", margin: "10px" }} >
                    <Grid container style={headerTopGrid}>
                        <Grid item xs={12} md={11} >
                            <div style={orderHeaderCss} >Cart Details</div>
                            <div style={orderHeaderCssSmall} >
                                <b style={{ textTransform: "uppercase", fontSize: "18px" }}>
                                    {destinationCountry} . {destinationOrganisation} . {code} . {requisitionDate}
                                </b>
                            </div>
                        </Grid>

                        <Grid item xs={12} >
                            <hr style={{ width: "98%", margin: "0 auto" }} />
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12} md={12} sx={{ padding: "3px" }}>
                    <Grid>
                        <ThemeProvider theme={tableTheme}>
                            <MaterialReactTable
                                columns={columns}
                                data={localCartData}
                                enableColumnActions={false}
                                onRowSelectionChange={setRowSelection} //hoist internal state to your own state (optional)
                                state={{ rowSelection }} //manage your own state, pass it back to the table (optional)
                                tableInstanceRef={tableInstanceRef} //get a reference to the underlying table instance (optional)
                                muiTableProps={{
                                    sx: {
                                        tableLayout: 'fixed',
                                    },
                                }}
                                muiTableHeadCellProps={{
                                    sx: {
                                        '& .Mui-TableHeadCell-Content': {
                                            fontSize: '12px',
                                            color: '#667085'
                                        },
                                    },
                                }}
                                muiTableHeadCellFilterTextFieldProps={{
                                    sx: {
                                        m: '1rem 0', width: '100%', fontSize: '12px',
                                        '& .MuiInputBase-root': {
                                            color: '#0E6073',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            opacity: 0.9
                                        },
                                        '& .MuiBox-root': {
                                            color: '#0E6073',
                                            fontSize: '11px',
                                            fontWeight: 'normal',
                                            opacity: 0.9
                                        },
                                        input: {
                                            color: '#667085',
                                            "&::placeholder": {    // <----- Add this.
                                                opacity: 0.9,
                                                color: '#0E6073',
                                            }
                                        }
                                    },
                                    variant: 'outlined'
                                }}
                                enableRowActions
                                editingMode="table"
                                enableEditing
                                muiTableBodyCellEditTextFieldProps={({ cell }) => ({
                                    onChange: (event) => {
                                        handleSaveCell(cell, event.target.value);
                                    },
                                    variant: "standard",
                                    error: !cell.getValue(),
                                })}
                                positionActionsColumn="last"
                                renderRowActions={({ row, table }) => {
                                    return (
                                        <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '4px' }}>
                                            <IconButton
                                                color="primary"
                                                aria-label="edit"
                                                onClick={() => handleRowEdit(row)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton aria-label="delete" color="error">
                                                <DeleteIcon onClick={() => handleRowDelete(row)} />
                                            </IconButton>
                                        </Box>
                                    )
                                }}
                                initialState={{
                                    pagination: {
                                        pageSize: 5,
                                        pageIndex: 0
                                    },
                                    columnVisibility: { id: false }
                                }}
                                muiTablePaginationProps={{
                                    rowsPerPageOptions: [5, 10, 20],
                                    showFirstButton: false,
                                    showLastButton: false,
                                    SelectProps: {
                                        native: true
                                    },
                                    labelRowsPerPage: 'Number of rows visible'
                                }}

                            />
                        </ThemeProvider>

                    </Grid>
                </Grid>
                <Grid item xs={12} md={12} sx={{ padding: "5px" }}>

                    <Grid container spacing={2} direction="row" justifyContent="center" alignItems="center" sx={{ padding: "10px" }}>
                        <Grid item xs={12} md={12}>
                            <Typography variant="h6" gutterBottom sx={{ color: '', fontSize: "24px", fontWeight: "bold" }}>
                                Total Cost : ${_.sumBy(localCartData, 'total')}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Button variant="contained"
                                style={{
                                    backgroundColor: '#000',
                                    width: "250px",
                                    color: "#23A295;",
                                    fontSize: "18px"
                                }}
                                startIcon={<UploadIcon />}
                                onClick={() => submitRequisition()}>
                                Complete Requisition
                            </Button>
                        </Grid>
                    </Grid>

                </Grid>
            </Grid>
        </>
    );
}

export default RequisitionsOrderCart;
