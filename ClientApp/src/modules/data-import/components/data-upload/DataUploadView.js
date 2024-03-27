import React, { useContext, useEffect, useState, useMemo, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Helmet } from "react-helmet-async";
import {
    Box,
    Breadcrumbs, Button,
    Button as MuiButton, Card,
    Card as MuiCard,
    CardContent as MuiCardContent,
    CircularProgress,
    FormControl,
    FormLabel,
    Grid,
    Link,
    MenuItem,
    Paper,
    Stack, Tab,
    TextField as MuiTextField,
    Typography,
    useTheme,
} from "@mui/material";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { SiteContext } from "../../../../index";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllTemplates, getUploadData, postUploadData, downloadData } from "../../apis/data-import";
import { useFormik } from "formik";
import * as Yup from "yup";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import MaterialReactTable from "material-react-table";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ReplyIcon from "@mui/icons-material/Reply";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import _ from "lodash";
import UploadIcon from "@mui/icons-material/Upload";

function DataUploadView(props) {
    const tableInstanceRef = useRef(null);
    const [rowSelection, setRowSelection] = useState({});
    const [dataColumns, setDataColums] = useState([])
    const [columnsFlag, setColumnsFlag] = useState(false)
    const siteContext = useContext(SiteContext);
    const [rowCount, setRowCount] = useState(0);
    const [columnsFilter, setColumnsFilter] = useState([]);
    const navigate = useNavigate();
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    let { id } = useParams();

    const fetchData = async () => {
        const response = await postUploadData({
            queryKey: ["postUploadData", id],
            pageNumber: pagination.pageIndex,
            pageSize: pagination.pageSize,
            filterOptions: columnsFilter.map(({ id, value }) => ({
                column: id,
                value: value
            }))

        });
        return response.data;
    };


    const { data, isLoading, isError, refetch } = useQuery(
        ["postUploadData", id],
        () => fetchData(),
        {
            enabled: !!id
        }
    );

    useEffect(() => {
        refetch();
    }, [pagination, columnsFilter]);

    useEffect(() => {
        if (data && data.Data.length > 0 && columnsFlag === false) {
            let tempColumns = [];
            _.keys(data.Data[0]).map(key => tempColumns.push({
                accessorKey: key,
                header: key
            }));
            setDataColums(tempColumns);
            setColumnsFlag(true);
        }
    }, [data]);

    // const { data, isLoading, isError } = useQuery(
    //     ["postUploadData", id],
    //     () => postUploadData({ queryKey: ["postUploadData", id] }),
    //     {
    //         enabled: !!id,
    //         onSuccess: (response) => {

    //             if (response.data.Data.length > 0) {
    //                 let tempColumns = [];
    //                 _.keys(response.data.Data[0].data[0]).map(key => tempColumns.push({
    //                     accessorKey: key,
    //                     header: key
    //                 }))
    //                 setDataColums(tempColumns)
    //             }                
    //         }
    //     }

    // );

    const handlePageChange = async (pageIndex, pageSize) => {
        setPagination(prevPagination => ({
            ...prevPagination,
            pageIndex: pageIndex,
            pageSize: pageSize
        }));
        console.log("pagination", pagination);
    };

    // const downloadCSV = async () => {
    //     const response = await downloadData({
    //         queryKey: ["downloadData", id],
    //         pageNumber: pagination.pageIndex,
    //         pageSize: pagination.pageSize,
    //         filterOptions: columnsFilter
    //     });
    //     const DATA = response.data;
    //     const obj = {};
    //     const fields = row.original.fields;
    //     for (const field of fields) {
    //       obj[field.fieldName] = "";
    //     }
    //     DATA.push(obj);
    //     // Convert the data to CSV format using PapaParse
    //     const csv = Papa.unparse(DATA);

    //     // Create a Blob containing the CSV data
    //     const csvBlob = new Blob([csv], { type: "text/csv" });

    //     // Create a URL for the Blob
    //     const csvUrl = URL.createObjectURL(csvBlob);

    //     // Create an invisible link element to trigger the download
    //     const link = document.createElement("a");
    //     link.href = csvUrl;
    //     link.download = `${row.original.versionName}.csv`;

    //     link.click();

    //     // Clean up by revoking the URL to release resources
    //     URL.revokeObjectURL(csvUrl);
    //   };


    const downloadCSV = async () => {
        const response = await downloadData({
            queryKey: ["downloadData", id],
            filterOptions: columnsFilter.map(({ id, value }) => ({
                column: id,
                value: value
            }))
        });

        // Construct CSV content with headers
        let csvContent = "data:text/csv;charset=utf-8,";
        const headers = Object.keys(response.data[0]).join(",") + "\n";
        csvContent += headers;

        // Add rows of data
        response.data.forEach(row => {
            let rowData = "";
            Object.keys(response.data[0]).forEach((key, index) => {
                rowData += `"${row[key]}"`;
                if (index < Object.keys(response.data[0]).length - 1) {
                    rowData += ",";
                }
            });
            csvContent += rowData + "\n";
        });

        // Create download link
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "data.csv");
        document.body.appendChild(link);
        link.click();
    };




    const columns = useMemo(
        () => {
            var col = []
            dataColumns.map(c =>
                col.push(c)
            )
            return dataColumns;
        },
        [dataColumns],
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
        <>
            {/* <ToastContainer />
            <Helmet title="Data Export Db Configs" />

            <Breadcrumbs aria-label="Breadcrumb" mt={2} gutterBottom>
                <Link component={NavLink} to="/data-export/data-export-db-configs">
                    Data Upload
                </Link>
                <Typography>Data Upload</Typography>
            </Breadcrumbs> */}
            <Box>
                <Paper square={true} sx={{ borderTop: 5 }} elevation={8}>
                    <Card mb={6} square={true} sx={{ py: 5, pl: 2 }}>
                        <Grid container spacing={12}>
                            <Grid item md={12} sx>
                                <Typography variant="h1" gutterBottom display="inline" sx={{ fontSize: '2rem' }}>
                                    Data Upload
                                </Typography>
                            </Grid>
                        </Grid>
                    </Card>
                </Paper>
            </Box>
            {!isLoading && !isError ? (
                <ThemeProvider theme={tableTheme}>
                    <MaterialReactTable
                        columns={columns}
                        data={data.Data}
                        enableColumnActions={false}
                        onRowSelectionChange={setRowSelection}
                        state={{ rowSelection, pagination }}
                        enablePagination={true}
                        manualPagination={true}
                        rowCount={rowCount}
                        onPaginationChange={setPagination}
                        tableInstanceRef={tableInstanceRef}
                        onColumnFiltersChange={setColumnsFilter}
                        defaultColumn={{
                            minSize: 10,
                            maxSize: 30,
                            size: 30,
                        }}
                        muiTableHeadCellProps={{
                            sx: {
                                "& .Mui-TableHeadCell-Content": {
                                    fontSize: "18px",
                                    color: "#000",
                                    fontWeight: "bold",
                                },
                            },
                        }}
                        muiTableHeadCellFilterTextFieldProps={{
                            sx: {
                                m: "1rem 0",
                                width: "100%",
                                fontSize: "12px",
                                "& .MuiInputBase-root": {
                                    color: "#0E6073",
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                    opacity: 0.9,
                                },
                                "& .MuiBox-root": {
                                    color: "#0E6073",
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                    opacity: 0.9,
                                },
                                input: {
                                    color: "#667085",
                                    "&::placeholder": {
                                        // <----- Add this.
                                        opacity: 0.9,
                                        color: "#0E6073",
                                    },
                                },
                            },
                            variant: "outlined",
                        }}
                        initialState={{
                            pagination: pagination,
                            expanded: false,
                            columnVisibility: {
                                id: false,
                                "mrt-row-expand": false,
                            }
                        }}
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
                                    startIcon={<ReplyIcon />}
                                    onClick={() =>
                                        navigate(-1)
                                    }
                                    sx={{
                                        fontWeight: 'bolder',
                                        backgroundColor: '#333333',
                                        "&:hover": {
                                            background: "#333333",
                                            color: "white"
                                        }
                                    }}
                                >
                                    Back
                                </Button>
                                <Button
                                    variant="contained"
                                    startIcon={<DownloadForOfflineIcon />}
                                    onClick={downloadCSV}
                                    sx={{
                                        fontWeight: 'bolder',
                                        backgroundColor: '#333333',
                                        "&:hover": {
                                            background: "#333333",
                                            color: "white"
                                        }
                                    }}
                                >
                                    Download
                                </Button>
                            </Box>
                        )}
                        muiTablePaginationProps={{
                            rowsPerPageOptions: [5, 10, 20, 30, 50, 100],
                            labelRowsPerPage: 'Number of rows visible'
                        }}

                    />


                </ThemeProvider>

            ) : (<>No records found</>)}
        </>
    );
}

export default DataUploadView;