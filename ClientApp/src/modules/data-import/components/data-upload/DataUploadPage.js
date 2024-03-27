import React, { useContext, useEffect, useState, useMemo, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Helmet } from "react-helmet-async";
import {
    Box,
    Breadcrumbs,
    Button as MuiButton,
    Card as MuiCard,
    CardContent as MuiCardContent,
    CircularProgress,
    FormControl,
    FormLabel,
    Grid,
    Link,
    MenuItem,
    Paper, Select,
    Stack,
    TextField as MuiTextField,
    Typography,
    useTheme,
} from "@mui/material";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { SiteContext } from "../../../../index";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import CSVReader from "./CSVUploadComponent";
import MaterialReactTable from "material-react-table";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ReplyIcon from "@mui/icons-material/Reply";
import { getAllTemplates, getVersion, postDataUpload } from "../../apis/data-import";
import _ from 'lodash';
import UploadIcon from "@mui/icons-material/Upload";


const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);




function DataUploadPage(props) {
    const tableInstanceRef = useRef(null);
    const [rowSelection, setRowSelection] = useState({});
    const [data, setData] = useState([])
    const [dataColumns, setDataColums] = useState([])
    const [enableUpload, setEnableUpload] = useState(false);
    const [templateVersions, setTemplateVersions] = useState([]);
    const navigate = useNavigate();
    const siteContext = useContext(SiteContext);
    let { id } = useParams();

    const { data: templates, isLoading, isError } = useQuery(
        ["getTemplates", siteContext.selectedSite.id],
        getAllTemplates,
        {
            enabled: !!siteContext.selectedSite.id,
        }
    );



    const postMutation = useMutation({ mutationFn: postDataUpload });

    const formik = useFormik({

        initialValues: {
            templateId: null,
            versionId: null,
            uploadDescription: '',
            tenantId: siteContext.selectedSite.id,
            fileName: '',
            fileType: '',
            file: '',
            data: []
        },
        validationSchema: Yup.object().shape({
            templateId: Yup.string().required("Required"),
            versionId: Yup.string().required("Required")
        }),

        onSubmit: async (values, { resetForm, setSubmitting }) => {
            console.log(values);
            try {
                if (id) {
                    values.id = id;
                    await postMutation.mutateAsync(values);

                } else {
                    console.log('values--------', values)
                    await postMutation.mutateAsync(values);
                }
                toast.success("Data upload successfully", {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    onClose: navigate(-1)
                });


            } catch (error) {
                toast.error(error.response.error, {
                    position: "top-right",
                    autoClose: 10000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        },
    });

    useEffect(() => {
        if (!isLoading && !isError && _.find(templates.data, { id: formik.values.templateId }) !== undefined) {
            setTemplateVersions(_.find(templates.data, { id: formik.values.templateId }).versions)
            formik.setFieldValue("versionId", null)
            formik.setFieldValue("data", [])
            setData([])
        }
    }, [formik.values.templateId]);


    const dataUpdate = (items) => {
        setDataColums(items.headers)
        setData(items.data);
        formik.setFieldValue("data", items.data)
        formik.setFieldValue("fileName", items.fileName)
        formik.setFieldValue("fileType", items.fileType)
        formik.setFieldValue("fileSize", items.fileSize)
    }

    const columns = useMemo(
        () => {
            console.log('dataColumns ----', dataColumns)
            var col = []
            dataColumns.map(c =>
                col.push(
                    {
                        accessorKey: c, //simple recommended way to define a column
                        header: c
                    },
                )
            )
            return col;
        },
        [dataColumns],
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
                <Link component={NavLink} to="/data-import/uploads">
                    Data Uploads
                </Link>
                <Typography>Upload</Typography>
            </Breadcrumbs> */}
            <Grid container spacing={3} alignItems="stretch">
                <Grid item md={12} style={{ display: "flex", width: "100%" }}>
                    <Paper
                        square={true}
                        sx={{
                            borderTop: 5,
                            borderColor: "#000000",
                            width: "100%",
                            px: 3,
                            py: 5,
                        }}
                        elevation={8}
                    >
                        <Grid
                            item
                            xs={12}
                            md={6}
                            sm={6}
                            sx={{ padding: "10px", textAlign: "left" }}
                        >
                            <Typography
                                gutterBottom
                                sx={{ fontSize: "2.5rem", fontWeight: "bold" }}
                            >
                                Data Upload
                            </Typography>
                            <Typography gutterBottom>Enter template details below: </Typography>
                        </Grid>

                        <form onSubmit={formik.handleSubmit}>
                            <Card mb={12}>
                                <CardContent>
                                    {formik.isSubmitting ? (
                                        <Box display="flex" justifyContent="center" my={6}>
                                            <CircularProgress />
                                        </Box>
                                    ) : (
                                        <>
                                            <Box>

                                                <Grid
                                                    container
                                                    layout={'row'}
                                                    spacing={5}
                                                >
                                                    <Grid item sm={6}>
                                                        <FormControl
                                                            sx={{ m: 1, width: "100%", marginBottom: "20px" }}
                                                            size="medium"
                                                        >
                                                            <FormLabel
                                                                style={{ fontSize: "16px", color: "#000", fontWeight: "bold", }}
                                                            >
                                                                Template Name*
                                                            </FormLabel>
                                                            <Select
                                                                name='templates'
                                                                id='templates'
                                                                value={formik.values.templateId}
                                                                label='templates'
                                                                onChange={(e) => formik.setFieldValue("templateId", e.target.value)}
                                                                inputProps={{ 'aria-label': 'Without label' }}
                                                                sx={{
                                                                    marginTop: 2,
                                                                    '& legend': { display: 'none' },
                                                                    '& .MuiInputLabel-shrink': { opacity: 0, transition: "all 0.2s ease-in" },
                                                                    width: '100%'
                                                                }}
                                                                displayEmpty
                                                            >
                                                                <MenuItem value={null}>Select Template</MenuItem>
                                                                {!isLoading && !isError && templates.data.map(template => (
                                                                    <MenuItem value={template.id}>{template.name}</MenuItem>
                                                                ))
                                                                }
                                                            </Select>

                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item sm={6}>
                                                        <FormControl
                                                            sx={{ m: 1, width: "100%", marginBottom: "20px" }}
                                                            size="medium"
                                                        >
                                                            <FormLabel
                                                                style={{
                                                                    fontSize: "16px",
                                                                    color: "#000",
                                                                    fontWeight: "bold",
                                                                }}
                                                            >
                                                                Template Version*
                                                            </FormLabel>
                                                            <Select
                                                                name='versions'
                                                                id='version'
                                                                value={formik.values.versionId}
                                                                label='templates'
                                                                onChange={(e) => {
                                                                    formik.setFieldValue("versionId", e.target.value);
                                                                    formik.setFieldValue("data", []);
                                                                    setData([]);
                                                                }}
                                                                inputProps={{ 'aria-label': 'Without label' }}
                                                                sx={{
                                                                    marginTop: 2,
                                                                    '& legend': { display: 'none' },
                                                                    '& .MuiInputLabel-shrink': { opacity: 0, transition: "all 0.2s ease-in" },
                                                                    width: '100%'
                                                                }}
                                                                displayEmpty
                                                            >
                                                                <MenuItem value={null}>Select Version</MenuItem>
                                                                {!isLoading && !isError && templateVersions.map(version => (
                                                                    <MenuItem value={version.id}>{version.versionName}</MenuItem>
                                                                ))
                                                                }
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item sm={6}>
                                                        <FormControl
                                                            sx={{ m: 1, width: "100%", marginBottom: "20px" }}
                                                            size="medium"
                                                        >
                                                            <FormLabel
                                                                style={{
                                                                    fontSize: "16px",
                                                                    color: "#000",
                                                                    fontWeight: "bold",
                                                                }}
                                                            >
                                                                Description
                                                            </FormLabel>
                                                            <TextField
                                                                name="uploadDescription"
                                                                label="Description"
                                                                value={formik.values.uploadDescription}
                                                                error={Boolean(
                                                                    formik.touched.uploadDescription &&
                                                                    formik.errors.uploadDescription
                                                                )}
                                                                fullWidth
                                                                helperText={
                                                                    formik.touched.uploadDescription &&
                                                                    formik.errors.uploadDescription
                                                                }
                                                                onBlur={formik.handleBlur}
                                                                onChange={formik.handleChange}
                                                                multiline
                                                                variant="outlined"
                                                                inputProps={{ 'aria-label': 'Without label' }}
                                                                sx={{
                                                                    borderRadius: "10px",
                                                                    marginTop: 2,
                                                                    '& legend': { display: 'none' },
                                                                    '& .MuiInputLabel-shrink': { opacity: 0, transition: "all 0.2s ease-in" }
                                                                }}
                                                                rows={5}
                                                                my={2}
                                                            />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item sm={6}>
                                                        <div style={{ padding: 20, height: '100%' }}>
                                                            <CSVReader setData={dataUpdate} action={setEnableUpload} />
                                                        </div>
                                                    </Grid>
                                                    {data.length > 0 &&
                                                        <Grid item sm={12}>
                                                            <Box sx={{ backgroundColor: 'red', maxWidth: '80vw' }}>
                                                                <Paper square={true} elevation={8}>
                                                                    <ThemeProvider theme={tableTheme} maxWidth={'10vw'}>
                                                                        <MaterialReactTable
                                                                            columns={columns}
                                                                            data={data}
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
                                                                </Paper>

                                                            </Box>
                                                        </Grid>
                                                    }


                                                </Grid>

                                                <Grid
                                                    container
                                                    direction="row"
                                                    justifyContent="space-between"
                                                    alignItems="center"
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
                                                        type="submit"
                                                        variant="contained"
                                                        startIcon={<UploadIcon />}
                                                        sx={{
                                                            fontWeight: 'bolder',
                                                            backgroundColor: '#333333',
                                                            "&:hover": {
                                                                background: "#333333",
                                                                color: "white"
                                                            }
                                                        }}
                                                    >
                                                        Save
                                                    </Button>
                                                </Grid>
                                            </Box>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </form>
                    </Paper>
                </Grid>
            </Grid>


        </>
    );
}

export default DataUploadPage;
