import React, { useMemo, useState} from 'react';


import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import {Card, CardContent, Grid} from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material';
import MaterialReactTable from "material-react-table";
import { getFromLocalStorage } from '../../../../../common/utils/LocalStorage';
import { useQuery } from '@tanstack/react-query';
import { getRequisitionProducts } from '../../../apis/order';



const PurchaseOrder = ()  => {

    const row = getFromLocalStorage("selected-purchase-order");
    const [purchaseOrderData, setPurchaseOrderData] = useState({});

    const { _ } = useQuery(
        ["getRequisitionProducts", row.requisitionCode],
        getRequisitionProducts,
        {
          onSuccess: (data) => {
            setPurchaseOrderData(data.data[0])
          },
        }
      );


    const PurchaseOrderProductTable = () => {
    
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
        const tableTheme = createTheme({
            palette: {
                background: {
                    default: '#fff'
                }
            }
        })
        
        return (
            <ThemeProvider theme={tableTheme}>
               <MaterialReactTable
                    columns={columns}
                    data={purchaseOrderData?.products}
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
                    />
            </ThemeProvider>
        )
    }

    return (
        <Grid container spacing={3}>
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
                Purchase Order Details
                </Typography>
            </Grid>
            <Card>
                <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                    <Typography sx={{ fontSize: 14 }}>
                    PO Numer: {row.poNumber}
                    </Typography>
                    </Grid>
                    <Grid item xs={6}>
                    <Typography sx={{ fontSize: 14 }}>
                    Sales Quote Number:{row?.salesQuoteNumber}
                    </Typography>
                    </Grid>
                    <Grid item xs={6}>
                    <Typography sx={{ fontSize: 14 }}>
                    Requisition Code: {row?.requisitionCode}
                    </Typography>
                    </Grid>
                    <Grid item xs={6}>
                    <Typography sx={{ fontSize: 14 }}>
                    Requisition Date: { row?.dateRequestCommodities }
                    </Typography>
                    </Grid>
                    <Grid item xs={6}>
                    <Typography sx={{ fontSize: 18, fontWeight: "bold" }}>
                    Promised Delivery Date:  {row.datePromisedDelivery}
                    </Typography>
                    </Grid>
                    <Grid item xs={6}>
                    <Typography sx={{ fontSize: 18, fontWeight: "bold" }}>
                    Qoute Amount: {row?.tot }
                    </Typography>
                    </Grid>
                </Grid>
                </CardContent>
            </Card>
   
            <Grid item xs={12} sm={12} sx={{padding:'0px 5px 5px 5px'}}>
                <Box sx={{ flexGrow: 1,backgroundColor:'#fff',padding:'5px 5px 10px 5px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sx={{marginTop:'10px'}}>
                             { purchaseOrderData?.products &&   <PurchaseOrderProductTable /> }
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
            </Grid>
        </Paper>
    </Grid>
    );
}

export default PurchaseOrder;
