import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import MaterialReactTable from "material-react-table";
import { Button, MenuItem, Paper,TextField } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckIcon from '@mui/icons-material/Check';

import Box from "@mui/material/Box";
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { ThemeProvider } from '../../../../common/contexts/ThemeContext';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import InputAdornment from '@mui/material/InputAdornment';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';
import { useQuery } from "@tanstack/react-query";
import { getSupplyPlan, getSupplyPlanList, getSupplyPlanSummary } from "../../apis/supply-plan";
import { useNavigate } from 'react-router-dom';
import { setLocalStorage } from '../../../../common/utils/LocalStorage';
import { SiteContext, UserInformation } from '../../../../index';



const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'left',
    minHeight: '130px',
    boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px !important"
}));

const SupplyPlanList = (props) => {
    const tableInstanceRef = useRef(null);
    const [rowSelection, setRowSelection] = useState({});
    const [data, setData] = useState([])
    const [rowCount, setRowCount] = useState(0);
    
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const siteContext = useContext(SiteContext);
    const selectedSite = siteContext.selectedSite;  
    const [supplyPlanListSummary, setSupplyPlanListSummary ] = useState({})
    const navigate = useNavigate();

    const userInfo = useContext(UserInformation);
    const user = userInfo.userInformation;

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10, //customize the default page size
    });

    const { refetch } = useQuery(
        ["getSupplyPlanList", pagination, selectedSite.id],
        getSupplyPlanList,
        {
            onSuccess: (response) => {
                setData(response.data.data)
                setRowCount(response.data.totalRecords);
                
            }
        }
    );

    const { refetch : refetchSupplyPlanSummary } = useQuery(
        ["getSupplyPlanSummary", selectedSite.id,startDate,endDate],
        getSupplyPlanSummary,
        {
            onSuccess: (response) => {
                setSupplyPlanListSummary(response.data)                
            }
        }
    );

    useEffect(() => {
        if (refetchSupplyPlanSummary) {
          refetchSupplyPlanSummary();
        }
      }, [startDate, endDate, refetchSupplyPlanSummary]);
    
    useEffect(() => {
        refetch();
    }, [pagination.pageIndex, pagination.pageSize, refetch])

    const handleApproveRow = (row) => {
        setLocalStorage('supply-plan-detail-row', row.original)
        navigate('/psa/supply-plan-detail-page');
    }

    const handleViewRow = (row) => {
        setLocalStorage('supply-plan-detail-row', row.original)
        navigate('/psa/supply-plan-detail-page');
    }
    const clearStartDate = () => {
        setStartDate(null);
      };
    
      const clearEndDate = () => {
        setEndDate(null);
      };

    const handleMakeRequisitionFromSupplyPlan = (row) => {

            getSupplyPlan({queryKey: ["getSupplyPlan", row.original.id]}).then((response) => {
                let products = response.data.products;
                let cartItems = [];
               
                products.map((item, index) => {                   
                    cartItems.push({
                        productCode: item.productCode,
                        productName: item.productName,
                        productCategory:item?.family || "NOT SET",
                        quantity: item.desiredProductQuantity,
                        unitPrice:item.estimatedUnitPrice,
                        estimatedDeliveryCost:null,
                        estimatedLeadTime:null,
                        deliveryDate:item.estimatedShipmentDate,
                        transportMode:null,
                        total: parseFloat(item.estimatedUnitPrice) * parseFloat(item.desiredProductQuantity),
                    });
                });
                
                setLocalStorage('requisition-order-cart-items', cartItems)
                console.log("items",cartItems);

                let requisitionDetailsFromSupplyPlan ={
                    destinationCountry: response.data.countryId,
                    destinationOrganisation:response.data.countryProgramName,
                    requisitionDate:new Date().toISOString().slice(0, 10),
                    email:user.username,
                    requisitionType:"Supply Plan",
                    isApproved:false,
                    isRequisitioned:false,
                    description:"Supply plan Requisition Order",
                    code:"REQ-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
                    tenantId: response.data.tenantId

                }
       
                setLocalStorage('requisition-general-details', requisitionDetailsFromSupplyPlan);

                console.log("Setting local staorage", cartItems);
                navigate('/psa/requisition-order-cart')
            
            })
    }

    const columns = useMemo(
        () => [
            {
                accessorKey: 'countryName',
                header: 'Country'
            },
            {
                accessorKey: 'countryProgramName',
                header: 'Program Name'
            },
 
            {
                accessorKey: 'fyStartDate',
                header: 'FY Start Date'
            },
            {
                accessorKey: 'fyEndDate',
                header: 'FY End Date'
            },
            {
                accessorKey: 'status',
                header: 'Status '
            },
        ],
        [],
    );

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
                                            Total Supply Plans
                                        </Typography>
                                        <Typography sx={{ mb: 1.5, fontSize: 18, color: '#000', fontWeight: 'bold' }}>
                                            {supplyPlanListSummary?.total || 0}
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
                                            {supplyPlanListSummary?.approved || 0}
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
                                        <Typography sx={{ fontSize: 18, color: '#840821', fontWeight: 'bold' }}>
                                            Rejected
                                        </Typography>
                                        <Typography sx={{ mb: 1.5, fontSize: 18, color: '#000', fontWeight: 'bold' }}>
                                            {supplyPlanListSummary?.rejected || 0}
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
                                            {supplyPlanListSummary?.pending || 0}
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
                            <ThemeProvider >

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
                                            row.original.status !== "Approve" &&
                                                (<MenuItem key={2} onClick={() => {
                                                        handleApproveRow(row)
                                                        closeMenu();
                                                    }}> 
                                                    <CheckIcon /> &nbsp; Approve
                                                </MenuItem>),
                                            <MenuItem key={1}
                                              onClick={() => {
                                                  handleMakeRequisitionFromSupplyPlan(row);
                                                  closeMenu();
                                              }}
                                              sx={{
                                                  width: '140px'
                                              }}
                                          >
                                              <CheckIcon />&nbsp; Make Requisition Order
                                          </MenuItem>,
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
                                        columnVisibility: { id: false,"mrt-row-expand": false, },
                                        expanded: false
                                    }}
                                    muiTablePaginationProps={{
                                        rowsPerPageOptions: [5, 10, 20, 30, 50, 100],
                                        labelRowsPerPage: 'Number of rows visible'
                                    }}
                                    //add custom action buttons to top-left of top toolbar
                                    renderTopToolbarCustomActions={({ table }) => (
                                        <Box sx={{ display: 'flex', gap: '1rem', p: '4px' }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => {
                                                    navigate("/psa/supply-plan-upload")
                                                }}
                                                sx={{
                                                    fontWeight: 'bolder',
                                                    "&:hover": {
                                                        background: "rgb(153, 46, 98)",
                                                        color: "white"
                                                    }
                                                }}
                                            >
                                                Upload Supply Plan
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

export default SupplyPlanList;
