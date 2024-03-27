import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import MaterialReactTable from "material-react-table";
import { Button, MenuItem, Container } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckIcon from '@mui/icons-material/Check';
import Box from "@mui/material/Box";
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider, useTheme, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useQuery } from "@tanstack/react-query";
import { getRequisitionsList, getRequisitionsListSummary } from "../../../apis/product-catalog";
import _ from "lodash"
import { useNavigate } from 'react-router-dom';
import { removeItem, setLocalStorage } from '../../../../../common/utils/LocalStorage';
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

function RequisitionsList(props) {
    const tableInstanceRef = useRef(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [rowSelection, setRowSelection] = useState({});
    const [data, setData] = useState([])
    const [rowCount, setRowCount] = useState(0);
    const globalTheme = useTheme();
    const [requisitionListSummary, setRequisitionListSummary] = useState({});
    const navigate = useNavigate();
    const siteContext = useContext(SiteContext);
    const selectedSite = siteContext.selectedSite;

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10, //customize the default page size
    });


    const { refetch } = useQuery(
        ["getRequisitionsList", pagination, selectedSite.id],
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

    const { refetch: refetchRequisitionsListSummary } = useQuery(
        ["getRequisitionsListSummary", selectedSite.id, startDate, endDate],
        getRequisitionsListSummary,
        {
          onSuccess: (response) => {
            setRequisitionListSummary(response.data);
          },
        }
      );
    
      useEffect(() => {
        if (refetchRequisitionsListSummary) {
          refetchRequisitionsListSummary();
        }
      }, [startDate, endDate, refetchRequisitionsListSummary]);

    const handleApproveRow = (row) => {
        setLocalStorage("approval_data", row.original);
        navigate("/psa/approve-approvals")
    }

    const handleViewRow = (row) => {
        setLocalStorage("requisition-apporoval-row", row.original);
        navigate("/psa/requisition-detail-page")
    }

    const clearStartDate = () => {
        setStartDate(null);
      };
    
      const clearEndDate = () => {
        setEndDate(null);
      };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'code',
                header: 'Code'
            },
            {
                accessorKey: 'requisitionType',
                header: 'Type'
            },
            {
                accessorKey: 'email',
                header: 'Created By'
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
                header: 'Amount'
            },
            {
                accessorKey: 'approvalStatus',
                header: 'Approval Status'
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
    const innerTableTheme = useMemo(

        () =>

            createTheme({

                palette: {

                    mode: globalTheme.palette.mode,

                    primary: globalTheme.palette.secondary,

                    background: {

                        default:

                            globalTheme.palette.mode === 'light' ? '#FFFFE9' : '#000',

                    },

                },


            }),

        [globalTheme],

    );
    const RequisitionListDetailView = (props) => {
        const { row } = props;
        const columns = useMemo(
            () => [
                {
                    accessorKey: 'productCode',
                    width: 60,
                    header: 'Code'
                },
                {
                    accessorKey: 'productName',
                    width: 100,
                    header: 'Product Name'
                },
                {
                    accessorKey: 'productCategory',
                    width: 60,
                    header: 'Category'
                },
                {
                    accessorKey: 'quantity',
                    width: 50,
                    header: 'Quantity'
                },
                {
                    accessorKey: 'total',
                    width: 50,
                    header: 'Amount'
                },
                {
                    accessorKey: 'estimatedDeliveryCost',
                    width: 50,
                    header: 'Delivery Cost'
                },
                {
                    accessorKey: 'transportMode',
                    width: 20,
                    header: 'Transport'
                },
                {
                    accessorKey: 'deliveryDate',
                    width: 50,
                    header: 'Delivery Date'
                }
            ],
            [],
        );
        return (
            <ThemeProvider theme={innerTableTheme}>
                <MaterialReactTable
                    columns={columns}
                    data={row.original.products}
                    enableColumnActions={false}
                    enableRowActions={false}
                    enablePagination={false}
                    enableFilters={false}
                    enableFullScreenToggle={false}
                    enableTopToolbar={false}
                    muiTableHeadCellProps={{
                        sx: {
                            '& .Mui-TableHeadCell-Content': {
                                fontSize: '11px',
                                color: '#667085',
                            },
                        },
                    }}
                />
            </ThemeProvider>
        )

    }

    return (
        <div>
            <Box sx={{ flexGrow: 1, backgroundColor: '#fff', padding: '5px 5px 10px 5px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={0}>
                            <Grid item xs={2}>
                                <Card sx={{ boxShadow: 'none' }}>
                                    <CardContent>
                                        <Typography sx={{ fontSize: 18, color: '#1570EF', fontWeight: 'bold' }}>
                                            Total Requisitions
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
                                        <Typography sx={{ fontSize: 18, color: '#44710A', fontWeight: 'bold' }}>
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
                            <Grid item xs={1.5}>
                                <Card sx={{ boxShadow: 'none' }}>
                                    <CardContent>
                                        <Typography sx={{ fontSize: 18, color: '#840821', fontWeight: 'bold' }}>
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
                            <Grid item xs={1.5}>
                                <Card sx={{ boxShadow: 'none' }}>
                                    <CardContent>
                                        <Typography sx={{ fontSize: 18, color: '#E47200', fontWeight: 'bold' }}>
                                            Pending Approval
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
                            <Grid item xs={4}>
                                <Card sx={{ boxShadow: 'none' }}>
                                    <CardContent>
                                    <Typography sx={{ fontSize: 18, color: '#000', fontWeight: 'bold', marginBottom:'10px' }}>
                                            Filter
                                        </Typography>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <TextField
                                            id="start-date"
                                            label="Start Date"
                                            type="date"
                                            value={startDate || ''}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            InputProps={{
                                                endAdornment: (
                                                <InputAdornment position="end">
                                                    {startDate && (
                                                    <IconButton size="small" onClick={clearStartDate} edge="end">
                                                        <ClearIcon />
                                                    </IconButton>
                                                    )}
                                                </InputAdornment>
                                                ),
                                            }}
                                            />
                                              <span style={{ margin: '0 3px' }}></span> 
                                            <TextField
                                                id="end-date"
                                                label="End Date"
                                                type="date"
                                                value={endDate || ''}
                                                onChange={(e) => setEndDate(e.target.value)}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                InputProps={{
                                                    endAdornment: (
                                                    <InputAdornment position="end">
                                                        {endDate && (
                                                        <IconButton size="small" onClick={clearEndDate} edge="end">
                                                            <ClearIcon />
                                                        </IconButton>
                                                        )}
                                                    </InputAdornment>
                                                    ),
                                                }}
                                                />
                                                </div>
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
                                    enablePagination={true}
                                    manualPagination={true}
                                    rowCount={rowCount}
                                    onPaginationChange={setPagination}
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
                                    renderRowActionMenuItems={({ row, closeMenu }) => {
                                        let dropDownItems = [
                                            <MenuItem key={1}
                                                onClick={() => {
                                                    handleViewRow(row);
                                                    closeMenu();
                                                }}
                                                sx={{
                                                    width: '140px'
                                                }}
                                            >
                                                <VisibilityIcon />&nbsp; View
                                            </MenuItem>,
                                            <MenuItem key={2} onClick={() => {
                                                handleApproveRow(row)
                                                closeMenu();
                                            }}>
                                                <CheckIcon /> &nbsp; Approve
                                            </MenuItem>
                                        ];
                                        if (row.original.menu_category === 'system') {
                                            //Remove delete and disable from dropdown options
                                            dropDownItems.pop();
                                            dropDownItems.pop();
                                        }
                                        return dropDownItems;
                                    }}
                                    initialState={{
                                        pagination: pagination,
                                        columnVisibility: { id: false },
                                        expanded: false,
                                        columnVisibility: {
                                            "mrt-row-expand": false,
                                        }
                                    }}
                                    muiTablePaginationProps={{
                                        rowsPerPageOptions: [5, 10, 20, 30, 50, 100],
                                        labelRowsPerPage: 'Number of rows visible'
                                    }}
                                    renderDetailPanel={({ row }) => (<RequisitionListDetailView row={row} />)}
                                    positionExpandColumn="first"

                                    //add custom action buttons to top-left of top toolbar
                                    renderTopToolbarCustomActions={({ table }) => (
                                        <Box sx={{ display: 'flex', gap: '1rem', p: '4px' }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => {
                                                    navigate("/psa/requisition-upload")
                                                }}
                                                sx={{
                                                    fontWeight: 'bolder',
                                                    "&:hover": {
                                                        background: "rgb(153, 46, 98)",
                                                        color: "white"
                                                    }
                                                }}
                                            >
                                                Upload Requisitions
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="warning"
                                                onClick={() => {
                                                    removeItem("requisition-order-cart-items");
                                                    removeItem("requisition-product-detail-item-code")
                                                    removeItem("requisition-general-details");
                                                    navigate("/psa/requisition-order-general-details");
                                                }}
                                                sx={{
                                                    fontWeight: 'bolder',
                                                    "&:hover": {
                                                        background: "rgb(153, 46, 98)",
                                                        color: "white"
                                                    }
                                                }}
                                            >
                                                Create Requisition
                                            </Button>
                                        </Box>
                                    )}


                                />


                            </ThemeProvider>

                        </Item>


                    </Grid>
                </Grid>
            </Box>


        </div>



    );
}

export default RequisitionsList;
