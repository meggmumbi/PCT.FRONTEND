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
  Paper,
  Stack,
  Tab,
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
import MaterialReactTable from "material-react-table";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ReplyIcon from "@mui/icons-material/Reply";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import TemplateVersion from "./TemplateVersion";
import {
  getTemplate,
  postTemplate,
  updateTemplate,
} from "../../apis/data-import";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import _ from "lodash";
import Papa from "papaparse";
import UploadIcon from "@mui/icons-material/Upload";
import { Download } from "@mui/icons-material";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);

const themeCustom = createTheme({
  palette: {
    custom_black: {
      main: "#000000",
      contrastText: "#FFFFFF",
    },
    custom_green: {
      main: "#23A295",
      contrastText: "#FFFFFF",
    },
  },
});

function TemplatePage(props) {
  const tableInstanceRef = useRef(null);
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState([]);
  const [dataColumns, setDataColums] = useState([]);
  const [enableUpload, setEnableUpload] = useState(false);
  const [templateVersions, setTemplateVersion] = useState([]);
  const [newVersions, setNewVersions] = useState([]);
  const [tableListVersions, setTableListVersions] = useState([]);
  const [showTable, setShowTable] = useState(true);
  const [tab, setTab] = useState("template");
  const [selectedVersion, setSelectedVersion] = useState("");
  const navigate = useNavigate();
  const siteContext = useContext(SiteContext);
  let { id } = useParams();

  const {
    data: template,
    isLoading,
    isError,
  } = useQuery(["getTemplate", id], getTemplate, {
    enabled: !!id,
    onSuccess: (response) => {
      //Replace to only update values needed
      formik.setValues({
        id: response.data.id,
        name: response.data.name,
        description: response.data.description ? response.data.description : "",
        tenantId: response.data.tenantId,
      });
      setTemplateVersion(response.data.versions);
    },
  });

  useEffect(() => {
    setTableListVersions([...templateVersions, ...newVersions]);
  }, [newVersions, templateVersions]);


  const postMutation = useMutation({ mutationFn: postTemplate });
  const updateMutation = useMutation({ mutationFn: updateTemplate });

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      tenantId: siteContext.selectedSite.id,
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Required"),
      tenantId: Yup.string().required("Required"),
    }),

    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        if (id !== "") {
          values.versions = newVersions;
          values.id = id;
          await postMutation.mutateAsync(values);
        } else {
          values.versions = newVersions;
          await updateMutation.mutateAsync(values);
        }
        toast.success("Data upload successfully", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          onClose: navigate(-1),
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

  const columns = useMemo(
    () => [
      {
        accessorKey: "id", //simple recommended way to define a column
        enableHiding: true,
        header: "Id",
      },
      {
        accessorKey: "versionName", //simple recommended way to define a column
        header: "Version",
      },
      {
        accessorKey: "description", //simple recommended way to define a column
        header: "Description",
      },
      {
        accessorKey: "dateCreated", //simple recommended way to define a column
        header: "Date Created",
      },
      {
        accessorKey: "dateUpdated", //simple recommended way to define a column
        header: "Date Updated",
      },
    ],
    []
  );
  const tableTheme = useMemo(() =>
    createTheme({
      MuiContainer: {
        styleOverrides: {
          maxWidth: "200px",
        },
      },
      palette: {
        background: {
          default: "#fff",
        },
      },
    })
  );
  const handleTabChange = (id, tab, row) => {
    setSelectedVersion({ id: id, data: row });
    setTab(tab);
  };
  const updateVersion = (response) => {
    let findIndex = _.findIndex(newVersions, { tempid: response.tempId });
    if (findIndex !== -1) {
      setNewVersions([...newVersions.splice(findIndex, 1, response)]);
    } else {
      response.tempid = _.uniqueId("tempid_");
      setNewVersions([...newVersions, response]);
    }
  };

  const handleDownload = (row) => {
    const DATA = [];
    const obj = {};
    const fields = row.original.fields;
    for (const field of fields) {
      obj[field.fieldName] = "";
    }
    DATA.push(obj);
    // Convert the data to CSV format using PapaParse
    const csv = Papa.unparse(DATA);

    // Create a Blob containing the CSV data
    const csvBlob = new Blob([csv], { type: "text/csv" });

    // Create a URL for the Blob
    const csvUrl = URL.createObjectURL(csvBlob);

    // Create an invisible link element to trigger the download
    const link = document.createElement("a");
    link.href = csvUrl;
    link.download = `${row.original.versionName}.csv`;

    link.click();

    // Clean up by revoking the URL to release resources
    URL.revokeObjectURL(csvUrl);
  };

  return (
    <>
      {/* <ToastContainer />
      <Helmet title="Data Imports" />

      <Breadcrumbs aria-label="Breadcrumb" mt={2} gutterBottom>
        <Link component={NavLink} to="/data-import/templates">
          Templates
        </Link>
        <Typography>Template</Typography>
      </Breadcrumbs> */}
      <Grid container spacing={3} alignItems="stretch">
        <Grid item md={12} style={{ display: "flex", width: "100%" }}>
          <Paper
            square={true}
            sx={{
              borderTop: 5,
              borderColor: "#000000",
              width: "100%",
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
                sx={{
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  textTransform: "capitalize",
                }}
              >
                {tab}
              </Typography>
              <Typography gutterBottom>{tab} details: </Typography>
            </Grid>
            <Box sx={{ width: "100%", typography: "body1" }}>
              <TabContext value={tab}>
                {/*<Box sx={{ borderBottom: 1, borderColor: 'divider',visibility:'hidden',height:'0px'}}>*/}
                <Box
                  sx={{
                    borderBottom: 1,
                    borderColor: "divider",
                    visibility: "hidden",
                    height: "0px",
                  }}
                >
                  <TabList aria-label="Template tabs">
                    <Tab label="Template" value="template" />
                    <Tab label="Version" value="version" />
                  </TabList>
                </Box>
                <TabPanel value="template">
                  <form onSubmit={formik.handleSubmit}>
                    <Card>
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
                                direction="row"
                                justifyContent="flex-start"
                                alignItems="center"
                              >
                                <Grid item sx={6} md={6}>
                                  <FormControl
                                    sx={{
                                      m: 1,
                                      width: "100%",
                                      marginBottom: "20px",
                                    }}
                                    size="medium"
                                  >
                                    <FormLabel
                                      style={{
                                        fontSize: "16px",
                                        color: "#000",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Template Name*
                                    </FormLabel>
                                    <TextField
                                      name="name"
                                      label="Name"
                                      value={formik.values.name}
                                      error={Boolean(
                                        formik.touched.name &&
                                        formik.errors.name
                                      )}
                                      fullWidth
                                      helperText={
                                        formik.touched.domain &&
                                        formik.errors.domain
                                      }
                                      onBlur={formik.handleBlur}
                                      onChange={formik.handleChange}
                                      variant="outlined"
                                      sx={{
                                        borderRadius: "10px",
                                        "& legend": { display: "none" },
                                        "& .MuiInputLabel-shrink": {
                                          opacity: 0,
                                          transition: "all 0.2s ease-in",
                                        },
                                      }}
                                      my={2}
                                    />
                                  </FormControl>
                                  <FormControl
                                    sx={{
                                      m: 1,
                                      width: "100%",
                                      marginBottom: "20px",
                                    }}
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
                                      name="description"
                                      label="Description"
                                      value={formik.values.description}
                                      error={Boolean(
                                        formik.touched.description &&
                                        formik.errors.description
                                      )}
                                      fullWidth
                                      helperText={
                                        formik.touched.description &&
                                        formik.errors.description
                                      }
                                      onBlur={formik.handleBlur}
                                      onChange={formik.handleChange}
                                      multiline
                                      variant="outlined"
                                      sx={{
                                        borderRadius: "10px",
                                        marginTop: 2,
                                        "& legend": { display: "none" },
                                        "& .MuiInputLabel-shrink": {
                                          opacity: 0,
                                          transition: "all 0.2s ease-in",
                                        },
                                      }}
                                      rows={5}
                                      my={2}
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item sm={12}>
                                  <Box
                                    sx={{
                                      backgroundColor: "red",
                                      maxWidth: "80vw",
                                    }}
                                  >
                                    <Paper square={true} elevation={8}>
                                      <ThemeProvider
                                        theme={tableTheme}
                                        maxWidth={"10vw"}
                                      >
                                        <MaterialReactTable
                                          columns={columns}
                                          data={tableListVersions}
                                          enableColumnActions={false}
                                          tableInstanceRef={tableInstanceRef} //get a reference to the underlying table instance (optional)
                                          muiTableHeadCellProps={{
                                            sx: {
                                              "& .Mui-TableHeadCell-Content": {
                                                fontSize: "16px",
                                                color: "#667085",
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
                                          enableRowActions
                                          positionActionsColumn="last"
                                          renderRowActionMenuItems={({
                                            row,
                                            closeMenu,
                                          }) => {
                                            return [
                                              <MenuItem
                                                key={1}
                                                onClick={() =>
                                                  handleTabChange(
                                                    row.original.id,
                                                    "version",
                                                    row.original
                                                  )
                                                }
                                                sx={{
                                                  width: "140px",
                                                }}
                                              >
                                                <VisibilityIcon />
                                                &nbsp; View
                                              </MenuItem>,
                                              <MenuItem
                                                key={2}
                                                onClick={() =>
                                                  handleDownload(row)
                                                }
                                                sx={{ width: "140px" }}
                                              >
                                                <Download /> &nbsp; Download
                                              </MenuItem>,
                                            ];
                                          }}
                                          initialState={{
                                            pagination: {
                                              pageSize: 10,
                                              pageIndex: 0,
                                            },
                                            columnVisibility: { id: false },
                                          }}
                                          muiTablePaginationProps={{
                                            rowsPerPageOptions: [5, 10, 20],
                                            showFirstButton: false,
                                            showLastButton: false,
                                            SelectProps: {
                                              native: true,
                                            },
                                            labelRowsPerPage:
                                              "Number of rows visible",
                                          }}
                                          positionGlobalFilter="left"
                                          //add custom action buttons to top-left of top toolbar
                                          renderTopToolbarCustomActions={({
                                            table,
                                          }) => (
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
                                                onClick={() =>
                                                  handleTabChange("", "version")
                                                }
                                                sx={{
                                                  fontWeight: "bolder",
                                                  backgroundColor: "#333333",
                                                  "&:hover": {
                                                    background: "#333333",
                                                    color: "white",
                                                  },
                                                }}
                                              >
                                                Version
                                              </Button>
                                            </Box>
                                          )}
                                        />
                                      </ThemeProvider>
                                    </Paper>
                                  </Box>
                                </Grid>
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
                                    fontWeight: "bolder",
                                    backgroundColor: "#333333",
                                    "&:hover": {
                                      background: "#333333",
                                      color: "white",
                                    },
                                  }}
                                >
                                  Back
                                </Button>

                                <Button
                                  type="submit"
                                  variant="contained"
                                  startIcon={<UploadIcon />}
                                  sx={{
                                    fontWeight: "bolder",
                                    backgroundColor: "#333333",
                                    "&:hover": {
                                      background: "#333333",
                                      color: "white",
                                    },
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
                </TabPanel>
                <TabPanel value="version">
                  <TemplateVersion
                    action={handleTabChange}
                    templateId={id}
                    id={selectedVersion.id}
                    versionUpdate={updateVersion}
                    versionData={selectedVersion.data}
                  />
                </TabPanel>
              </TabContext>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}

export default TemplatePage;
