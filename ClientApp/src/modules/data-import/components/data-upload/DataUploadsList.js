import React, { useMemo, useRef, useState, useContext } from 'react';
import { ToastContainer } from "react-toastify";
import { Helmet } from "react-helmet-async";
import {
    Box,
    Breadcrumbs,
    Button as MuiButton,
    Card as MuiCard,
    CardContent as MuiCardContent,
    Grid,
    Link,
    MenuItem,
    Paper,
    TextField as MuiTextField,
    Typography,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MaterialReactTable from "material-react-table";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DownloadIcon from '@mui/icons-material/Download';
import { useQuery } from "@tanstack/react-query";
import { getAllTemplates, getTenantUploads, getUploadData } from "../../apis/data-import";
import { SiteContext } from "../../../../index";
import Papa from 'papaparse';


const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);

function DataUploadsList(props) {
    const navigate = useNavigate();
    const tableInstanceRef = useRef(null);
    const [rowSelection, setRowSelection] = useState({});
    const [data, setData] = useState([])
    const siteContext = useContext(SiteContext);

    const { data: uploads, isLoading, isError } = useQuery(
        ["getTenantUploads", siteContext.selectedSite.id],
        getTenantUploads
    );

    const fetchData = async (rowId) => {
        try {
            getUploadData({ queryKey: ["getUploadData", rowId] }).then((response) => {
                exportToCSV(response.data);
            })
        } catch (e) {
            console.log(e);
        }
    };

    const exportToCSV = (exportData) => {
        if (exportData.length === 0) {
            alert('No data to export!');
            return;
        }

        const csv = Papa.unparse(exportData, {
            header: true,
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute('download', 'data.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'id', //simple recommended way to define a column
                enableHiding: true,
                header: 'Id'
            },
            {
                accessorKey: 'fileName', //simple recommended way to define a column
                header: 'File Name'
            },
            {
                accessorKey: 'fileType', //simple recommended way to define a column
                header: 'Type'
            },
            {
                accessorKey: 'uploadDescription', //simple recommended way to define a column
                header: 'Description'
            },
            {
                accessorKey: 'size', //simple recommended way to define a column
                header: 'Size'
            },
            {
                accessorKey: 'importedBy', //simple recommended way to define a column
                header: 'Imported By'
            },
            {
                accessorKey: 'status', //simple recommended way to define a column
                header: 'Status'
            },
        ],
        [],
    );
    const tableTheme = useMemo(

        () =>

            createTheme({
                MuiContainer: {
                    styleOverrides: {
                        maxWidth: '200px'
                    }
                },
                palette: {
                    background: {
                        default: '#fff'
                    }
                }
            })
    );
    return (
        <>
            {/* <ToastContainer />
            <Helmet title="Data Imports" />

            <Breadcrumbs aria-label="Breadcrumb" mt={2} gutterBottom>
                <Link component={NavLink} to="data-import/uploads">
                    Data Uploads
                </Link>
            </Breadcrumbs> */}
            <Box>
                <Paper square={true} sx={{ borderTop: 5 }} elevation={8}>
                    <Card square={true} sx={{ py: 5, pl: 2 }}>
                        <Grid container spacing={12}>
                            <Grid item md={12} sx>
                                <Typography variant="h1" gutterBottom display="inline" sx={{ fontSize: '2rem' }}>
                                    Data Uploads
                                </Typography>
                                <Typography variant="caption" display="block" gutterBottom>
                                    Display the details of the recently uploaded data
                                </Typography>
                            </Grid>
                        </Grid>
                    </Card>
                </Paper>
                <Paper square={true} elevation={8}>
                    {!isLoading && !isError ? (
                        <ThemeProvider theme={tableTheme} maxWidth={'10vw'}>
                            <MaterialReactTable
                                columns={columns}
                                data={uploads.data}
                                enableColumnActions={false}
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
                                    return [
                                        <MenuItem key={1}
                                            onClick={() =>
                                                navigate(
                                                    `${window.location.pathname}/upload/${row.original.id}`
                                                )
                                            }
                                            sx={{
                                                width: '140px'
                                            }}
                                        >
                                            <VisibilityIcon />&nbsp; View
                                        </MenuItem>,
                                        <MenuItem key={1}
                                            onClick={() =>
                                                fetchData(row.original.id)
                                            }
                                            sx={{
                                                width: '140px'
                                            }}
                                        >
                                            <DownloadIcon />&nbsp; Download
                                        </MenuItem>
                                    ];
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
                                            onClick={() => {
                                                navigate(
                                                    `${window.location.pathname}/upload`
                                                )
                                            }}
                                            sx={{
                                                fontWeight: 'bolder',
                                                backgroundColor: '#333333',
                                                "&:hover": {
                                                    background: "#333333",
                                                    color: "white"
                                                }
                                            }}
                                        >
                                            Upload
                                        </Button>
                                    </Box>
                                )}
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
                    ) : (
                        <>No data </>
                    )}

                </Paper>

            </Box>











        </>
    );
}

export default DataUploadsList;
