import React, { useContext, useEffect } from 'react';
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
import { useMemo, useRef, useState } from "react";
import { createTheme, IconButton, ThemeProvider } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getRequisitionsList, getRequisitionsListSummary } from "../../../apis/product-catalog";
import MaterialReactTable from "material-react-table";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import _ from "lodash";
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

const ApprovalList = ({ pageSwitch }) => {

    const tableInstanceRef = useRef(null);
    const [rowSelection, setRowSelection] = useState({});
    const [data, setData] = useState([])
    const navigate = useNavigate();
    const [rowCount, setRowCount] = useState(0);
    const siteContext = useContext(SiteContext);
    const selectedSite = siteContext.selectedSite;

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10, //customize the default page size
    });

    const [requisitionListSummary, setRequisitionListSummary] = useState({});

    const { refetch } = useQuery(["getRequisitionsList", pagination, selectedSite.id],
        getRequisitionsList,
        {
            onSuccess: (response) => {
                setData(response.data.data)
                setRowCount(response.data.totalRecords);
            }
        }
    );




    useEffect(() => {
        refetch();
    }, [pagination.pageIndex, pagination.pageSize, refetch])


    useEffect(() => {
        let summaryResponse = getRequisitionsListSummary();
        summaryResponse.then((resp) => {
            setRequisitionListSummary(resp.data);
        })
    }, [])

    const columns = useMemo(
        () => [
            {
                accessorKey: 'code',
                header: 'Code',
            },
            {
                accessorKey: 'requisitionType',
                header: 'Type'
            },
            {
                accessorKey: 'destinationCountry',
                header: 'Country'
            },
            {
                accessorKey: 'destinationOrganisation',
                header: 'Organisation'
            },
            {
                accessorKey: 'description',
                header: 'Description'
            },
            {
                accessorKey: 'totalAmount',
                header: 'Total Amount'
            },
            {
                accessorKey: 'approvalStatus',
                header: 'Status'
            }
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
                        <Grid item xs={2}>
                            <Card sx={{ boxShadow: 'none' }}>
                                <CardContent>
                                    <Typography sx={{ fontSize: 18, color: '#1570EF', fontWeight: 'bold' }}>
                                        Approvals
                                    </Typography>
                                    <Typography sx={{ mb: 1.5, fontSize: 18, color: '#000', fontWeight: 'bold' }}>
                                        {requisitionListSummary.total || 0}
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
                                    <Typography sx={{ fontSize: 18, color: '#E19133', fontWeight: 'bold' }}>
                                        Approved
                                    </Typography>
                                    <Typography sx={{ mb: 1.5, fontSize: 18, color: '#000', fontWeight: 'bold' }}>
                                        {requisitionListSummary.approved || 0}
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
                                        {requisitionListSummary.rejected || 0}
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
                                    <Typography sx={{ fontSize: 18, color: '#845EBC', fontWeight: 'bold' }}>
                                        In Progress
                                    </Typography>
                                    <Typography sx={{ mb: 1.5, fontSize: 18, color: '#000', fontWeight: 'bold' }}>
                                        {requisitionListSummary.pending || 0}
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
                                    <Typography sx={{ fontSize: 18, color: 'red', fontWeight: 'bold' }}>
                                        Not Started
                                    </Typography>
                                    <Typography sx={{ mb: 1.5, fontSize: 18, color: '#000', fontWeight: 'bold' }}>
                                        {requisitionListSummary.pending || 0}
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
                                state={{ rowSelection, pagination }} //manage your own state, pass it back to the table (optional)
                                tableInstanceRef={tableInstanceRef} //get a reference to the underlying table instance (optional)
                                enablePagination={true}
                                manualPagination={true}
                                rowCount={rowCount}
                                onPaginationChange={setPagination}
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
                                                    setLocalStorage("approval_data", row.original);
                                                    navigate("/psa/approve-approvals");

                                                }
                                                }
                                            >
                                                <VisibilityOutlinedIcon />
                                            </IconButton>
                                        </Box>
                                    )
                                }}
                                initialState={{
                                    pagination: pagination,
                                    columnVisibility: { id: false }
                                }}
                                muiTablePaginationProps={{
                                    rowsPerPageOptions: [5, 10, 20, 30, 50, 100],
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

export default ApprovalList;
