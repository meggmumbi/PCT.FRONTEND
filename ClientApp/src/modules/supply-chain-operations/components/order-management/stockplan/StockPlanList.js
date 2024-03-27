import React from 'react';
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import {styled} from "@mui/material/styles";
import {useMemo, useRef, useState} from "react";
import {Button, createTheme, IconButton, MenuItem, ThemeProvider, useTheme} from "@mui/material";
import {useQuery} from "@tanstack/react-query";
import {getRequisitionsList} from "../../../apis/product-catalog";
import MaterialReactTable from "material-react-table";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import _ from 'lodash';


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#fff' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'left',
    minHeight:'130px',
    color: theme.palette.text.secondary,
    boxShadow:"rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px !important"
}));

function createData(code,date,delivery,country,cost,status) {
    return { code,date,delivery,country,cost,status};
}

const rows = [
    createData('req-0023-a1', '22-01-03','22-01-05', 'Kenya','$ 2,000,000','pending'),
    createData('req-0563-br', '23-01-03','22-03-03', 'Sudan','$ 134,000,000','approved'),
    createData('req-1245-ks', '23-01-03','22-03-03', 'Senegal','$ 89,000','level-3'),
];


export const stockPlanData = [
    {
        "id": 1,
        "code": "USAID-FY2023",
        "organisation": "Global-Fund",
        "country": "Kenya",
        "period": "FY2023",
        "amount": "$5,949,907.46",
        "status": "Active"
    },
    {
        "id": 2,
        "code": "Global-Fund-FY2023",
        "organisation": "USAID",
        "country": "Senegal",
        "period": "FY2023",
        "amount": "$3,899,660.66",
        "status": "Closed"
    },
    {
        "id": 3,
        "code": "USAID-FY2023",
        "organisation": "Global-Fund",
        "country": "Sudan",
        "period": "FY2023",
        "amount": "$8,064,784.00",
        "status": "Closed"
    },
    {
        "id": 4,
        "code": "Global-Fund-FY2023",
        "organisation": "USAID",
        "country": "Nigeria",
        "period": "FY2023",
        "amount": "$3,654,451.46",
        "status": "Active"
    },
    {
        "id": 5,
        "code": "USAID-FY2023",
        "organisation": "Global-Fund",
        "country": "Tanzania",
        "period": "FY2023",
        "amount": "$9,167,410.33",
        "status": "Active"
    },
    {
        "id": 6,
        "code": "USAID-FY2023",
        "organisation": "USAID",
        "country": "Senegal",
        "period": "FY2023",
        "amount": "$7,133,158.57",
        "status": "Active"
    },
    {
        "id": 7,
        "code": "Global-Fund-FY2023",
        "organisation": "Global-Fund",
        "country": "Malawi",
        "period": "FY2023",
        "amount": "$4,782,787.43",
        "status": "Active"
    },
    {
        "id": 8,
        "code": "Global-Fund-FY2023",
        "organisation": "Global-Fund",
        "country": "Senegal",
        "period": "FY2023",
        "amount": "$2,295,505.35",
        "status": "Closed"
    },
    {
        "id": 9,
        "code": "Global-Fund-FY2023",
        "organisation": "USAID",
        "country": "Malawi",
        "period": "FY2023",
        "amount": "$9,139,265.09",
        "status": "Active"
    },
    {
        "id": 10,
        "code": "Global-Fund-FY2023",
        "organisation": "Global-Fund",
        "country": "Nigeria",
        "period": "FY2023",
        "amount": "$5,468,849.98",
        "status": "Cancelled"
    }
]


function StockPlanList({pageSwitch}) {
    const [requisitions, setRequisitions] = useState([]);
    const tableInstanceRef = useRef(null);
    const [rowSelection, setRowSelection] = useState({});
    /*const [data, setData] = useState([])*/
    const globalTheme = useTheme();




    const columns = useMemo(
        () => [
            {
                accessorKey: 'id', //simple recommended way to define a column
                enableHiding: false,
                header: 'id'
            },
            {
                accessorKey: 'code', //simple recommended way to define a column
                header: 'Code'
            },
            {
                accessorKey: 'organisation', //simple recommended way to define a column
                header: 'Organisation'
            },
            {
                accessorKey: 'country', //simple recommended way to define a column
                header: 'country'
            },
            {
                accessorKey: 'period', //simple recommended way to define a column
                header: 'Period'
            },
            {
                accessorKey: 'amount', //simple recommended way to define a column
                header: 'Amount'
            },
            {
                accessorKey: 'status', //simple recommended way to define a column
                header: 'Status'
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



    return (
        <Box sx={{ flexGrow: 1,backgroundColor:'#fff',padding:'5px 5px 10px 5px' }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Grid container  direction="row" justifyContent="flex-start" alignItems="center" spacing={2}>
                        <Grid item xs={3}>
                            <Card sx={{boxShadow:'none'}}>
                                <CardContent>
                                    <Typography sx={{ fontSize: 18, color:'#1570EF',fontWeight:'bold' }}>
                                        Stock Plans
                                    </Typography>
                                    <Typography sx={{ mb: 1.5,fontSize: 18,color:'#000',fontWeight:'bold' }}>
                                        {stockPlanData.length}
                                    </Typography>
                                    <Typography variant="body2">
                                        FY 2023
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Divider orientation="vertical" variant="middle" flexItem>
                            -
                        </Divider>
                        <Grid item xs={3}>
                            <Card sx={{boxShadow:'none'}}>
                                <CardContent>
                                    <Typography sx={{ fontSize: 18, color:'#E19133',fontWeight:'bold' }}>
                                        Active
                                    </Typography>
                                    <Typography sx={{ mb: 1.5,fontSize: 18,color:'#000',fontWeight:'bold' }}>
                                        {_.filter(stockPlanData,{status:'Active'}).length}
                                    </Typography>
                                    <Typography variant="body2">
                                        FY 2023
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Divider orientation="vertical" variant="middle" flexItem>
                            -
                        </Divider>

                        <Grid item xs={3}>
                            <Card sx={{boxShadow:'none'}}>
                                <CardContent>
                                    <Typography sx={{ fontSize: 18, color:'#F36960',fontWeight:'bold' }}>
                                        Closed
                                    </Typography>
                                    <Typography sx={{ mb: 1.5,fontSize: 18,color:'#000',fontWeight:'bold' }}>
                                        {_.filter(stockPlanData,{status:'Closed'}).length}
                                    </Typography>
                                    <Typography variant="body2">
                                        FY 2023
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Divider orientation="vertical" variant="middle" flexItem>
                            -
                        </Divider>

                        <Grid item xs={2}>
                            <Card sx={{boxShadow:'none'}}>
                                <CardContent>
                                    <Typography sx={{ fontSize: 18, color:'#F36960',fontWeight:'bold' }}>
                                        Cancelled
                                    </Typography>
                                    <Typography sx={{ mb: 1.5,fontSize: 18,color:'#000',fontWeight:'bold' }}>
                                        {_.filter(stockPlanData,{status:'Cancelled'}).length}
                                    </Typography>
                                    <Typography variant="body2">
                                        FY 2023
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                    </Grid>

                </Grid>
                <Grid item xs={12} sx={{marginTop:'10px'}}>
                    <Item elevation={3}>
                        <ThemeProvider theme={tableTheme}>
                                <MaterialReactTable
                                    columns={columns}
                                    data={stockPlanData}
                                    enableColumnActions={false}
                                    onRowSelectionChange={setRowSelection} //hoist internal state to your own state (optional)
                                    state={{ rowSelection }} //manage your own state, pass it back to the table (optional)
                                    tableInstanceRef={tableInstanceRef} //get a reference to the underlying table instance (optional)
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
                                    enableRowActions
                                    positionActionsColumn="last"
                                    renderRowActions={({row, table}) => {
                                        return (
                                            <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
                                                <IconButton
                                                    color="primary"
                                                    aria-label="edit"
                                                    onClick={()=>pageSwitch('approval',row.original)}
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

export default StockPlanList;
