import React, { useContext } from 'react';
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
import { createTheme, IconButton, ThemeProvider } from "@mui/material";
import MaterialReactTable from "material-react-table";
import EditIcon from "@mui/icons-material/Edit";
import { useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPurchaseOrderList, getPurchaseOrderSummary } from "../../../apis/order";
import LoadFromBase64 from '../../SimpleDocumentViewer';
import AttachmentIcon from '@mui/icons-material/Attachment';
import { setLocalStorage } from '../../../../../common/utils/LocalStorage';
import { useNavigate } from 'react-router-dom';
import { SiteContext } from '../../../../../index';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#fff' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'left',
    minHeight: '130px',
    color: theme.palette.text.secondary,
    boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px !important"
}));

const PurchaseOrderList = ({ pageSwitch }) => {
    const tableInstanceRef = useRef(null);
    const [rowSelection, setRowSelection] = useState({});
    const [data, setData] = useState([])
    const navigate = useNavigate();

    const siteContext = useContext(SiteContext);
    const selectedSite = siteContext.selectedSite;
    const [purchaseOrderSummary, setPurchaseOrderSummary] = useState({});

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10, //customize the default page size
    });

    useQuery(["getPurchaseOrderList", pagination, selectedSite.id], getPurchaseOrderList,
        {
            onSuccess: (response) => {
                setData(response.data.data)
            }
        }
    );

    useQuery(
        ["getPurchaseOrderSummary", selectedSite.id],
        getPurchaseOrderSummary,
        {
            onSuccess: (response) => {
                setPurchaseOrderSummary(response.data)
            }
        }
    );
    
    const columns = useMemo(
        () => [
            {
                accessorKey: 'id',
                enableHiding: false,
                header: 'id'
            },
            {
                accessorKey: 'poNumber',
                header: 'Order Number'
            },
            {
                accessorKey: 'salesQuoteNumber',
                header: 'Quote Number'
            },
            {
                accessorKey: 'dateRequestCommodities',
                header: 'Request Date'
            },
            {
                accessorKey: 'datePromisedDelivery',
                header: 'Delivey Date'
            },
            {
                accessorKey: 'requisitionCode',
                header: 'Requisition Code'
            },
            {
                accessorKey: 'currency',
                header: 'Currency'
            },
            {
                accessorKey: 'document',
                accessorFn: (row) => row,
                Cell: ({ cell, row }) => row?.original?.document
                    && <AttachmentIcon onClick={() => LoadFromBase64(row.original.document)} />,
                header: 'Attachments'
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
        <Box sx={{ flexGrow: 1, backgroundColor: '#fff', padding: '5px 5px 10px 5px' }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={2}>
                        <Grid item xs={3}>
                            <Card sx={{ boxShadow: 'none' }}>
                                <CardContent>
                                    <Typography sx={{ fontSize: 18, color: '#1570EF', fontWeight: 'bold' }}>
                                        Total Purchase Orders
                                    </Typography>
                                    <Typography sx={{ mb: 1.5, fontSize: 18, color: '#000', fontWeight: 'bold' }}>
                                        {purchaseOrderSummary.total}
                                    </Typography>
                                    <Typography variant="body2">
                                        Last 7 days
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Divider orientation="vertical" variant="middle" flexItem>
                            -
                        </Divider>
                        <Grid item xs={3}>
                            <Card sx={{ boxShadow: 'none' }}>
                                <CardContent>
                                    <Typography sx={{ fontSize: 18, color: '#E19133', fontWeight: 'bold' }}>
                                        Total Rejected
                                    </Typography>
                                    <Typography sx={{ mb: 1.5, fontSize: 18, color: '#000', fontWeight: 'bold' }}>
                                    {purchaseOrderSummary.rejected}
                                    </Typography>
                                    <Typography variant="body2">
                                        Last 7 days
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Divider orientation="vertical" variant="middle" flexItem>
                            -
                        </Divider>
                        <Grid item xs={3}>
                            <Card sx={{ boxShadow: 'none' }}>
                                <CardContent>
                                    <Typography sx={{ fontSize: 18, color: '#845EBC', fontWeight: 'bold' }}>
                                        Total Pending
                                    </Typography>
                                    <Typography sx={{ mb: 1.5, fontSize: 18, color: '#000', fontWeight: 'bold' }}>
                                    {purchaseOrderSummary.pending}
                                    </Typography>
                                    <Typography variant="body2">
                                        Last 7 days
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Divider orientation="vertical" variant="middle" flexItem>
                            -
                        </Divider>
                        <Grid item xs={2}>
                            <Card sx={{ boxShadow: 'none' }}>
                                <CardContent>
                                    <Typography sx={{ fontSize: 18, color: '#F36960', fontWeight: 'bold' }}>
                                        Approved
                                    </Typography>
                                    <Typography sx={{ mb: 1.5, fontSize: 18, color: '#000', fontWeight: 'bold' }}>
                                    {purchaseOrderSummary.approved}
                                    </Typography>
                                    <Typography variant="body2">
                                        Last 7 days
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                </Grid>
                <Grid item xs={12} sx={{ marginTop: '10px' }}>
                    <Item elevation={3}>


                        <ThemeProvider theme={tableTheme}>
                            <MaterialReactTable
                                columns={columns}
                                data={data}
                                enableColumnActions={false}
                                onRowSelectionChange={setRowSelection} //hoist internal state to your own state (optional)
                                state={{ rowSelection }} //manage your own state, pass it back to the table (optional)
                                tableInstanceRef={tableInstanceRef} //get a reference to the underlying table instance (optional)
                                muiTableHeadCellProps={{
                                    sx: {
                                        '& .Mui-TableHeadCell-Content': {
                                            fontSize: '16px',
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
                                            fontSize: '12px',
                                            fontWeight: 'bold',
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
                                positionActionsColumn="last"
                                renderRowActions={({ row, table }) => {
                                    return (
                                        <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
                                            <IconButton
                                                color="primary"
                                                aria-label="edit"
                                                onClick={() => {
                                                    setLocalStorage("selected-purchase-order", row.original);
                                                    navigate("/psa/approve-purchase-order");
                                                }
                                                }
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Box>
                                    )
                                }}
                                initialState={{
                                    pagination: {
                                        pageSize: 10,
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
                                    labelRowsPerPage: 'Number of rows visible'
                                }}
                            />


                        </ThemeProvider>
                    </Item>
                </Grid>
            </Grid>
        </Box>

    );
}

export default PurchaseOrderList;
