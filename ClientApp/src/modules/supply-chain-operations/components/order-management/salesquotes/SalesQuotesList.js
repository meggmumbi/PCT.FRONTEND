import React, { useContext } from 'react';
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
import { createTheme, IconButton, ThemeProvider, useTheme } from "@mui/material";
import MaterialReactTable from "material-react-table";
import EditIcon from "@mui/icons-material/Edit";
import { useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSalesQuoteList, getSalesQuoteSummary } from "../../../apis/sales-quote";
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


const SalesQuotesList = () => {
    const tableInstanceRef = useRef(null);
    const [rowSelection, setRowSelection] = useState({});
    const [data, setData] = useState([])
    const navigate = useNavigate();
    const siteContext = useContext(SiteContext);
    const selectedSite = siteContext.selectedSite;
    const [salesQuoteSummary, setSalesQuoteSummary] = useState({});

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10, //customize the default page size
    });
    const {
        _
    } = useQuery(["getSalesQuoteList", pagination, selectedSite.id], getSalesQuoteList,
        {
            onSuccess: (response) => {
                console.log("Received sales quote data", response.data.data);
                setData(response.data.data)
            }
        }
    );

    const { __ } = useQuery(
        ["getSalesQuoteSummary", selectedSite.id],
        getSalesQuoteSummary,
        {
            onSuccess: (response) => {
                setSalesQuoteSummary(response.data)
            }
        }
    );
    


    const columns = useMemo(
        () => [
            {
                accessorKey: 'id', //simple recommended way to define a column
                enableHiding: false,
                header: 'id'
            },
            {
                accessorKey: 'requisitionCode', //simple recommended way to define a column
                header: 'Code'
            },
            {
                accessorKey: 'vendorId', //simple recommended way to define a column
                header: 'Vendor'
            },
            {
                accessorKey: 'salesQuoteNumber', //simple recommended way to define a column
                header: 'Quote Number'
            },
            {
                accessorKey: 'dateSupplierIssuedQuote', //simple recommended way to define a column
                header: 'Quote Date'
            },
            {
                accessorKey: 'approved', //simple recommended way to define a column
                accessorFn: (row) => row.approved ? "Approved" : "",
                header: 'approved'
            },
            {
                accessorKey: 'document', //simple recommended way to define a column
                accessorFn: (row) => row,
                Cell: ({ cell, row }) => row?.original?.document
                    && <AttachmentIcon onClick={() => LoadFromBase64(row.original.document)} />,
                header: 'Attachments'
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
        <Box sx={{ flexGrow: 1, backgroundColor: '#fff', padding: '5px 5px 10px 5px' }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={2}>
                        <Grid item xs={3}>
                            <Card sx={{ boxShadow: 'none' }}>
                                <CardContent>
                                    <Typography sx={{ fontSize: 18, color: '#1570EF', fontWeight: 'bold' }}>
                                        Total Sales Quotes
                                    </Typography>
                                    <Typography sx={{ mb: 1.5, fontSize: 18, color: '#000', fontWeight: 'bold' }}>
                                        {salesQuoteSummary.total}
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
                                        Total Approved
                                    </Typography>
                                    <Typography sx={{ mb: 1.5, fontSize: 18, color: '#000', fontWeight: 'bold' }}>
                                    {salesQuoteSummary.approved}
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
                                        Pending Approval
                                    </Typography>
                                    <Typography sx={{ mb: 1.5, fontSize: 18, color: '#000', fontWeight: 'bold' }}>
                                    {salesQuoteSummary.pending}
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
                                        Rejected
                                    </Typography>
                                    <Typography sx={{ mb: 1.5, fontSize: 18, color: '#000', fontWeight: 'bold' }}>
                                    {salesQuoteSummary.rejected}
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
                                                    setLocalStorage("sales-quote-detail-row", row.original);
                                                    navigate("/psa/sales-quotes-details");

                                                }}
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

export default SalesQuotesList;
