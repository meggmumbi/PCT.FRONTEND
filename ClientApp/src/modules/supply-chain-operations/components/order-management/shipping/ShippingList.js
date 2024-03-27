import React, { useContext, useMemo, useRef, useState } from 'react';
import MaterialReactTable from "material-react-table";
import { MenuItem } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Box from "@mui/material/Box";
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider, useTheme } from '@mui/material';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useNavigate } from 'react-router-dom';
import PinDropIcon from '@mui/icons-material/PinDrop';
import { useQuery } from "@tanstack/react-query";
import { setLocalStorage } from '../../../../../common/utils/LocalStorage';
import { SiteContext } from '../../../../../index';
import { getShipmentListSummary, getShipmentList} from '../../../apis/shipment';


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#fff' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'left',
    minHeight: '130px',
    color: theme.palette.text.secondary,
    boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px !important"
}));

const ShippingList = () => {

    const tableInstanceRef = useRef(null);
    const [rowSelection, setRowSelection] = useState({});
    const [data, setData] = useState([]);
    const siteContext = useContext(SiteContext);
    const selectedSite = siteContext.selectedSite;
    const [shipementSummary, setShipmentSummary] = useState({})


    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10, //customize the default page size
    });


    const navigate = useNavigate();

    const navigateToShippingDetails = (row) => {
        setLocalStorage("shipment-data-row", row.original)
        navigate('/psa/shipping-details');
    };

    const navigateToTracking = () => {
        navigate('/psa/shipping-tracking');
    };
    useQuery(["getShipmentList", pagination, selectedSite.id], getShipmentList,
        {
            onSuccess: (response) => {
                console.log("shipement data", response?.data.data);
                setData(response.data.data)
            }
        }
    );

    useQuery(
        ["getShipmentListSummary", selectedSite.id],
        getShipmentListSummary,
        {
            onSuccess: (response) => {
                setShipmentSummary(response.data)
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
                accessorKey: 'consignmentCode',
                header: 'Shipment code'
            },
            {
                accessorKey: 'originCountry',
                header: 'Departure Country'
            },
            {
                accessorKey: 'destinationCountry',
                header: 'Destination Country'
            },
            {
                accessorKey: 'dateDepartOriginPort',
                header: 'Departure Date'
            },
            {
                accessorKey: 'expectedDateArriveDestinationPort',
                header: 'Delivery Date'
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
        <div>
            <Box sx={{ flexGrow: 1, backgroundColor: '#fff', padding: '5px 5px 10px 5px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={2}>
                            <Grid item xs={2}>
                                <Card sx={{ boxShadow: 'none' }}>
                                    <CardContent>
                                        <Typography sx={{ fontSize: 18, color: '#1570EF', fontWeight: 'bold' }}>
                                            Total Shipped
                                        </Typography>
                                        <Typography sx={{ mb: 1.5, fontSize: 18, color: '#000', fontWeight: 'bold' }}>
                                            {shipementSummary.total}
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
                                            Total Delivered
                                        </Typography>
                                        <Typography sx={{ mb: 1.5, fontSize: 18, color: '#000', fontWeight: 'bold' }}>
                                        {shipementSummary.delivered}
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
                                            In Transit
                                        </Typography>
                                        <Typography sx={{ mb: 1.5, fontSize: 18, color: '#000', fontWeight: 'bold' }}>
                                        {shipementSummary.inTransit}
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
                                            Rejected/Spoiled
                                        </Typography>
                                        <Typography sx={{ mb: 1.5, fontSize: 18, color: '#000', fontWeight: 'bold' }}>
                                        {shipementSummary.rejected}
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
                                    onRowSelectionChange={setRowSelection}
                                    state={{ rowSelection }}
                                    tableInstanceRef={tableInstanceRef}
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
                                    enableRowActions={true}
                                    positionActionsColumn="last"
                                    renderRowActionMenuItems={({ row, closeMenu }) => {
                                        let dropDownItems = [
                                            <MenuItem key={1}
                                                onClick={() => {
                                                    navigateToShippingDetails(row);
                                                    closeMenu();
                                                }}
                                                sx={{
                                                    width: '140px'
                                                }}
                                            >
                                                <VisibilityIcon />&nbsp; View
                                            </MenuItem>,
                                            <MenuItem key={2}
                                                onClick={() => {
                                                    navigateToTracking();
                                                    closeMenu();
                                                }}
                                                sx={{
                                                    width: '140px'
                                                }}
                                            >
                                                <PinDropIcon />&nbsp; Tracking

                                            </MenuItem>
                                        ];
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
                            </ThemeProvider>

                        </Item>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}

export default ShippingList;
