import React from 'react';
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { useMemo, useRef, useState } from "react";
import { Button, createTheme, MenuItem, ThemeProvider } from "@mui/material";
import MaterialReactTable from "material-react-table";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useQuery } from "@tanstack/react-query";
import { getAllSites } from "../../apis/mis-endpoints";
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import {
    Card,
    Typography,
    Grid,
    CardContent,
    CardHeader,
    Switch,
    TextField
} from "@mui/material";
import {useNavigate} from "react-router-dom";


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#fff' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'left',
    minHeight: '130px',
    color: theme.palette.text.secondary,
    boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px !important"
}));

function SiteList(props) {
    const tableInstanceRef = useRef(null);
    const [rowSelection, setRowSelection] = useState({});
    const [data, setData] = useState([])
    const navigate = useNavigate();

    const {
        isLoading,
        isError
    } = useQuery(["getAllSitesList"], getAllSites,
        {
            onSuccess: (response) => {
                setData(response.data)
                console.log(response.data)
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
                accessorKey: 'name', //simple recommended way to define a column
                header: 'Name'
            },
            {
                accessorKey: 'description', //simple recommended way to define a column
                header: 'Description'
            },
            {
                accessorKey: 'created_by', //simple recommended way to define a column
                header: 'Created By'
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
        <Item elevation={3}>
            <Box>
                <Paper square={true} sx={{ borderTop: 5 }} elevation={8}>
                    <Card mb={6} square={true} sx={{ py: 5, pl: 2 }}>
                        <Grid container spacing={12}>
                            <Grid item md={12} sx>
                                <Typography variant="h1" gutterBottom display="inline" sx={{ fontSize: '2rem' }}>
                                    Tenants
                                </Typography>
                            </Grid>
                        </Grid>
                    </Card>
                </Paper>
            </Box>
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
                    renderRowActionMenuItems={({ row, closeMenu }) => {
                        let dropDownItems = [
                            <MenuItem key={1}
                                onClick={() =>navigate(
                                    `/MISAdministration/tenants/tenant/${row.original.id}`
                                )}
                                sx={{
                                    width: '140px'
                                }}
                            >
                                <VisibilityIcon />&nbsp; View
                            </MenuItem>,
                            <MenuItem key={2} onClick={() => {
                                //handleDeleteRow(row)
                                closeMenu();
                            }}>
                                <DeleteIcon /> &nbsp; Delete
                            </MenuItem>
                        ];
                        return dropDownItems;
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
                    positionGlobalFilter='left'

                    //add custom action buttons to top-left of top toolbar
                    renderTopToolbarCustomActions={({ table }) => (
                        <Box
                            sx={{
                                display: "flex",
                                gap: "1rem",
                                p: "4px",
                                right: "15px",
                                position: "absolute",
                            }}
                        >
                            <Button
                                variant="contained"
                                startIcon={<AddCircleIcon />}
                                onClick={() =>navigate(
                                    `/MISAdministration/tenants/tenant`
                                )}
                                sx={{
                                    fontWeight: 'bolder',
                                    backgroundColor: '#333333',
                                    "&:hover": {
                                        background: "#333333",
                                        color: "white"
                                    }
                                }}
                            >
                                Tenant
                            </Button>
                        </Box>
                    )}
                />


            </ThemeProvider>

        </Item>

    );
}

export default SiteList;
