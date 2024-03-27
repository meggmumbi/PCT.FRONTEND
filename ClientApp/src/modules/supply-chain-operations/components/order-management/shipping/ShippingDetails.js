import React, {useMemo, useRef, useState} from 'react';
import MaterialReactTable from "material-react-table";
import {Button, MenuItem} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ReplyIcon from '@mui/icons-material/Reply';
import Box from "@mui/material/Box";
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { createTheme, ThemeProvider, useTheme } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { getFromLocalStorage } from '../../../../../common/utils/LocalStorage';
import { getRequisitionProducts } from '../../../apis/order';
import { useQuery } from '@tanstack/react-query';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#fff' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'left',
    minHeight:'130px',
    color: theme.palette.text.secondary,
    boxShadow:"rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px !important"
}));

const ShippingDetails = () => {
    const rowdata = getFromLocalStorage("shipment-data-row");

    console.log("Row data here", rowdata);
    const tableInstanceRef = useRef(null);
    const [rowSelection, setRowSelection] = useState({});
    const [data, setData] = useState([])

    const navigate = useNavigate();

    const { _ } = useQuery(
        ["getRequisitionProducts", rowdata?.requisitionCode],
        getRequisitionProducts,
        {
          onSuccess: (data) => {
            setData(data.data[0])
          },
        }
      );

    

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
    <Grid container spacing={3} alignItems="stretch" >
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
                    Shipment Details
                    </Typography>
                </Grid>
            </Grid>
            <Card>
                <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                    <Typography sx={{ fontSize: 14 }}>
                    Shipment Code:  {rowdata?.consignmentCode}
                    </Typography>
                    </Grid>
                    <Grid item xs={6}>
                    <Typography sx={{ fontSize: 14 }}>
                    Departure Country:{rowdata?.originCountry}
                    </Typography>
                    </Grid>
                    <Grid item xs={6}>
                    <Typography sx={{ fontSize: 14 }}>
                    Destination Country:  {rowdata?.destinationCountry}
                    </Typography>
                    </Grid>
                    <Grid item xs={6}>
                    <Typography sx={{ fontSize: 14 }}>
                    Delivery Date: {rowdata?.expectedDateArriveDestinationPort}
                    </Typography>
                    </Grid>
                    <Grid item xs={6}>
                    <Typography sx={{ fontSize: 18, fontWeight: "bold" }}>
                    Promised Delivery Date:  {rowdata?.expectedDateArriveDestinationPort}
                    </Typography>
                    </Grid>
                    <Grid item xs={6}>
                    <Typography sx={{ fontSize: 18, fontWeight: "bold" }}>
                    Qoute Amount: {rowdata?.tot }
                    </Typography>
                    </Grid>
                </Grid>
                </CardContent>
            </Card>


            <Grid item xs={12} sx={{marginTop:'10px'}}>
                    <ThemeProvider theme={tableTheme}>
                        { data && <MaterialReactTable
                            columns={columns}
                            data={data}
                            enableColumnActions={false}
                            onRowSelectionChange={setRowSelection} 
                            state={{ rowSelection }} 
                            tableInstanceRef={tableInstanceRef} 
                            muiTableHeadCellProps={{
                                sx: {
                                    '& .Mui-TableHeadCell-Content': {
                                        fontSize:'16px',
                                        color: '#667085'
                                    },
                                },
                            }}
                            muiTableHeadCellFilterTextFieldProps={{
                                sx: { m: '1rem 0', width: '100%',fontSize:'12px',
                                    '& .MuiInputBase-root': {
                                        color: '#0E6073',
                                        fontSize:'12px',
                                        fontWeight:'bold',
                                        opacity:0.9
                                    },
                                    '& .MuiBox-root': {
                                        color: '#0E6073',
                                        fontSize:'12px',
                                        fontWeight:'bold',
                                        opacity:0.9
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
                            enableRowActions={false}
                            positionActionsColumn="last"
                            renderRowActionMenuItems={({row, closeMenu}) => {
                                let dropDownItems = [
                                    <MenuItem key={1}
                                                onClick={() => {
                                                    //props.pageSwitch('add',row.original);
                                                    closeMenu();
                                                }}
                                                sx={{
                                                    width:'140px'
                                                }}
                                    >
                                        <VisibilityIcon/>&nbsp; View
                                    </MenuItem>
                                ];
                                if(row.original.menu_category === 'system'){
                                    //Remove delete and disable from dropdown options
                                    dropDownItems.pop();
                                    dropDownItems.pop();
                                }
                                return dropDownItems;
                            }}
                            initialState={{
                                pagination: {
                                    pageSize: 5,
                                    pageIndex: 0
                                },
                                columnVisibility: { id: false }
                            }} muiTablePaginationProps={{
                            rowsPerPageOptions: [5, 10, 20],
                            showFirstButton: false,
                            showLastButton: false,
                            SelectProps: {
                                native: true
                            },
                            labelRowsPerPage: 'Rows'
                        }}

                        />
                    }
                    </ThemeProvider>
            </Grid>
        </Paper>

    </Grid>
        
    );
}

export default ShippingDetails;
