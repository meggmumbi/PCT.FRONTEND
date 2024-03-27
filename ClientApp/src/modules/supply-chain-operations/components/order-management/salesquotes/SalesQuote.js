import React, {useState, useMemo, useContext} from 'react';


import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import {Card, CardContent, Grid, Select, TextField} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import MaterialReactTable from "material-react-table";
import { createTheme, ThemeProvider } from '@mui/material';
import { getRequisitionProducts, postSalesQuoteApproveStatus } from "../../../apis/order";
import {ToastContainer, toast} from "react-toastify";
import { UserInformation } from "../../../../../index.js";  
import { useQuery } from '@tanstack/react-query';
import { getFromLocalStorage } from '../../../../../common/utils/LocalStorage.js';
import 'react-toastify/dist/ReactToastify.min.css'

const  SalesQuote = () => {
    const row = getFromLocalStorage("sales-quote-detail-row") || {}
    const [approvalStatus, setApprovalStatus] = React.useState("");
    const [requisitionData, setRequisitionData] = useState({});
    const [approvedStatus, setApprovedStatus] = useState(row.status === 'Approved');
    const [description, setDescription] = useState();
    const user = useContext(UserInformation);

    const { _ } = useQuery(
        ["getRequisitionProducts", row.requisitionCode],
        getRequisitionProducts,
        {
          onSuccess: (data) => {
            setRequisitionData(data.data[0])
          },
        }
      );
    

    const approvalCategories = [
        "Approve",
        "Reject"
    ];
    const handleChange = (event) => {
        setApprovalStatus(event.target.value);
    };

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

    const popSuccess = (message) => {
        toast.success(message, {
            position: 'top-right',
            autoClose: 10000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    }

    const updateApprovalStatus = (stati) => {
        setApprovedStatus(stati);
    }

    const handleSubmitApproval = () => {

        let errors = null;
        if(!approvalStatus) {
           errors = "Error, Approval status is required"
        } 

        if(errors) {
            popError(errors);
            return false;
        }

        let request = {
          "SalesQuoteId": row.id,
          "approvedBy": user.username
        }
        postSalesQuoteApproveStatus(request).then((response) => {
            popSuccess("Sales qoute NO " + row.salesQuoteNumber + " approved " );
            updateApprovalStatus(true);
        });

    }


    const SalesQuoteProductTable = () => {
    
        const columns = useMemo(
            () => [
                {
                    accessorKey: 'productCode',
                    header: 'Product Code'
                },
                {
                    accessorKey: 'productCategory', 
                    header: 'Category   '
                },
                {
                    accessorKey: 'productName', 
                    header: 'Product Name'
                },
                {
                    accessorKey: 'quantity', 
                },
                {
                    accessorKey: 'unitPrice', 
                    header: 'Price'
                },
                {
                    accessorKey: 'total', 
                    header: 'Total Price'
                },
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
        return (
            <ThemeProvider theme={tableTheme}>
               {requisitionData?.products && <MaterialReactTable
                    columns={columns}
                    data={requisitionData?.products}
                    enableColumnActions={false}
                    enableRowActions={false}
                    enablePagination={false}
                    enableFilters={false}
                    enableFullScreenToggle={false}
                    enableTopToolbar={false}
                    muiTableHeadCellProps={{
                        sx: {
                            '& .Mui-TableHeadCell-Content': {
                                fontSize:'11px',
                                color: '#667085',
                            },
                        },
                    }}
                    /> }
            </ThemeProvider>
        )
    }

    return (
        <Grid container spacing={3} alignItems="stretch" >
        <ToastContainer />
        <Paper
            square={true}
            sx={{
            borderTop: 5,
            borderColor: "#000000",
            width:"100%"
            }}
            elevation={8}
             >
            <Grid container spacing={3}>
                <Grid
                item
                xs={12}
                sx={{ padding: "10px", textAlign: "left", marginTop:"10px" }}
            >
                <Typography
                gutterBottom
                sx={{ fontSize: "2rem", fontWeight: "bold" }}
                >
                Sales Quote Details: { approvedStatus && " - Approved"}
                </Typography>
            </Grid>
            <Card>
                <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                    <Typography sx={{ fontSize: 14 }}>
                    Quote Code: {row.salesQuoteNumber}
                    </Typography>
                    </Grid>
                    <Grid item xs={6}>
                    <Typography sx={{ fontSize: 14 }}>
                    Requisition Code:{row?.requisitionCode}
                    </Typography>
                    </Grid>
                    <Grid item xs={6}>
                    <Typography sx={{ fontSize: 14 }}>
                    Destination Country: {requisitionData?.destinationCountry}
                    </Typography>
                    </Grid>
                    <Grid item xs={6}>
                    <Typography sx={{ fontSize: 14 }}>
                        Requisition Date: { requisitionData?.requisitionDate }
                    </Typography>
                    </Grid>
                    <Grid item xs={6}>
                    <Typography sx={{ fontSize: 18, fontWeight: "bold" }}>
                    Quote Date:  {row.dateSupplierIssuedQuote}
                    </Typography>
                    </Grid>
                    <Grid item xs={6}>
                    <Typography sx={{ fontSize: 18, fontWeight: "bold" }}>
                    Qoute Amount: {requisitionData?.totalAmount }
                    </Typography>
                    </Grid>
                </Grid>
                </CardContent>
            </Card>
   
            <Grid item xs={12} sm={12} sx={{padding:'0px 5px 5px 5px'}}>
                <Box sx={{ flexGrow: 1,backgroundColor:'#fff',padding:'5px 5px 10px 5px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sx={{marginTop:'10px'}}>
                                <SalesQuoteProductTable />
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
            </Grid>

            {!approvedStatus && ( <Grid item xs={12} sm={12}>
                <Box sx={{ width: '100%' }}>
                
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={2}>
                            <InputLabel
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    fontWeight: 700
                                }}
                            >
                                Approver
                            </InputLabel>
                        </Grid>
                        <Grid item xs={12} sm={10}>
                            <Typography sx={{ fontSize: 14, color:'#000',fontWeight:'bold' }}>
                                {user.username}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={2}>
                            <InputLabel
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    fontWeight: 700
                                }}
                            >
                                Status
                            </InputLabel>
                        </Grid>
                        <Grid item xs={12} sm={10} sx={{padding:'20px'}}>
                            <FormControl fullWidth size="small">
                                <InputLabel id="demo-simple-select-label">Status</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={approvalStatus}
                                    label="Status"
                                    onChange={handleChange}
                                >
                                    {approvalCategories.map((item) => (
                                        <MenuItem value={item}>{item}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <InputLabel
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    fontWeight: 700
                                }}
                            >
                                Justification
                            </InputLabel>
                        </Grid>
                        <Grid item xs={12} sm={10} sx={{padding:'20px'}}>
                            <TextField
                                id="outlined-multiline-static"
                                label="Justification"
                                multiline
                                fullWidth
                                rows={4}
                                onChange={(e) => setDescription(e.target.value)}
                                defaultValue={description}
                            />
                        </Grid>

                    </Grid>

                    <Box sx={{ mb: 2 }}>
                        <div>
                            <Button
                                variant="contained"
                                onClick={ handleSubmitApproval}
                                sx={{ mt: 1, mr: 1 }}
                            >
                                Approve
                            </Button>
                        </div>
                    </Box>
                            
                </Box>
            </Grid>)
        }
        </Paper>
        </Grid>
    );
}

export default SalesQuote;
