import React, { useEffect, useState, useContext } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import styled from "@emotion/styled";
import {
  Box,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  CircularProgress,
  Grid,
  InputLabel,
  FormControl,
  FormLabel,
  Stack,
  TextField as MuiTextField,
  Typography,
  MenuItem,
  RadioGroup,
  Checkbox,
  IconButton,
  ListItem,
  List,
  Radio,
  FormControlLabel,
  Select,
} from "@mui/material";
import { spacing } from "@mui/system";
import { SiteContext } from "../../../index";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import ReplyIcon from "@mui/icons-material/Reply";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ToastContainer, toast } from "react-toastify";
import {
  getCategories,
  postDocument,
  getDocumentSelected,
  postCategory,
} from "../apis/document-management";
import Paper from "@mui/material/Paper";
import _ from "lodash";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { version } from "process";
import { useDropzone } from "react-dropzone";
import FileTable from "../components/FileTable";
import { Folder, FolderOpen } from "@mui/icons-material";

import "react-toastify/dist/ReactToastify.min.css";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#fff" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  boxShadow:
    "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px !important",
}));

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

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
    custom_white: {
      main: "#FFFFFF",
      contrastText: "#FFFFFF",
    },
  },
});

const blue = {
  100: "#DAECFF",
  200: "#b6daff",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  900: "#003A75",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const AddDocument = () => {
  const [open, setOpen] = useState(false);
  const [folderOpen, setFolderOpen] = useState(false);
  const [versions, setVersions] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const siteContext = useContext(SiteContext);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategory] = useState([]);
  const [selectedFile, setSelectedFile] = useState();
  const [filesData, setFilesData] = useState([]);
  const [documents, setdocuments] = useState();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone();
  const theme = useTheme();

  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const [accordion, setAccordion] = useState({
    version: "",
    filelink: "",
  });
  const [file, setFile] = useState("");
  const navigate = useNavigate();
  let { id } = useParams();

  const [folderData, setFolderData] = useState({
    name: "",
    parent: selectedCategory ? selectedCategory : null,
    tenantId: siteContext.selectedSite?.id,
  });

  const createFolderMutation = useMutation({ mutationFn: postCategory });

  const handlefolderClose = () => {
    setFolderOpen(false);
  };

  const handleCreateFolder = async () => {
    try {
      await createFolderMutation.mutateAsync(folderData);

      toast.success("Folder Created Successfully");
      handlefolderClose();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFolderData((prevData) => ({ ...prevData, [name]: value }));
  };

  const mutation = useMutation({ mutationFn: postDocument });
  const popError = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 6000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const popSuccess = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      category: "",
      tenantId: null,
      parent: null,
    },

    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        if (selectedCategory.length === 0) {
          popError("Please select a folder to store the documents");
          return;
        } else if (filesData.length === 0) {
          popError(
            "No document has been uploaded. Upload a document and try again."
          );
          return;
        } else {
          const docItems = {
            documentName: values.name,
            description: values.description,
            category: selectedCategory,
            tenantId: siteContext.selectedSite?.id,
            files: filesData,
          };
          if (!!id) {
            console.log(docItems);
            docItems.id = id;
            await mutation.mutateAsync(docItems);
            popSuccess("Document has been updated successfully");
            navigate("/MISAdministration/document-management");
          } else {
            console.log(docItems);

            await mutation.mutateAsync(docItems);

            popSuccess("Document has been added successfully");

          }


          resetForm();
        }
      } catch (error) {
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });


  const { } = useQuery(["getCategories", siteContext.selectedSite ? siteContext.selectedSite.id : ""], getCategories, {

    onSuccess: (response) => {
      setCategory(response.data || []);
    },
  });

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);

    console.log("category", selectedCategory);
  };

  const handleSubCategoryChange = (event) => {
    setSelectedSubCategory(event.target.value);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleModalFolerOpen = () => {
    setFolderOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const { refetch } = useQuery(
    ['getDocumentSelected', id],
    () => getDocumentSelected(id),
    {
      enabled: !!id,
      onSuccess: (response) => {
        //setData(response.data);
        formik.setValues({
          name: response.data.documentName,
          description: response.data.description,
          category: response.data.category,
          tenantId: null,
          parent: response.data.category.id,
          version: response.data.files[0].version
        })
        let temp = []
        response.data.files.map(file => {
          temp.push(
            {
              id: file.id,
              version: file.version,
              fileName: file.fileName,
              size: null,
              file: file.file,
            }
          )
        });
        setFilesData(temp)
        setSelectedCategory(response.data.category.id)
      },
    }
  );

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    console.log(event);
    console.log(isExpanded);
    setExpanded(isExpanded ? panel : false);
  };
  const handleChange = (field, value, version) => {
    setAccordion((prev) => ({
      ...prev,
      [versions]: {
        ...prev[versions],
        [field]: value,
      },
    }));
  };

  const handleFileChange = (event, version) => {
    setSelectedFile(event.target.files[0]);

  };

  const handleRemoveFile = (fileName, version) => {
    console.log(fileName);
    // Implement the logic to remove the file from the selectedFiles state
    setFilesData((prevFiles) =>
      prevFiles.filter((file) => file.fileName !== fileName)
    );
  };

  const handleFileUpload = () => {
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onload = () => {
      const fileData = {
        version: accordion[versions].version,
        fileName: selectedFile.name,
        size: selectedFile.size,
        file: reader.result.split(",")[1],
      };
      setFilesData((prev) => [...prev, fileData]);
      setAccordion((prev) => ({
        ...prev,
        [version]: {
          ...prev[version],
          file: reader.result.split(",")[1],
        },
      }));
    };
  };

  const getChildren = (parentId) => {
    return categories.filter((category) => category.parent === parentId);
  };

  const isCategoryOrChildSelected = (categoryId) => {
    return (
      selectedCategory === categoryId ||
      categories.some(
        (category) =>
          category.parent === categoryId &&
          isCategoryOrChildSelected(category.id)
      )
    );
  };

  const renderCategories = (parentCategoryId = null, depth = 0) => {
    const children = categories.filter(
      (category) => category.parent === parentCategoryId
    );
    const hasChildCategories = children.length > 0;

    return (
      <div key={parentCategoryId} style={{ marginLeft: depth * 20 }}>
        <RadioGroup
          aria-label={`category-${parentCategoryId}`}
          name={`category-${parentCategoryId}`}
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <FormControlLabel
            value={parentCategoryId}
            control={<Radio />}
            label={getCategoryName(parentCategoryId)}
          />
        </RadioGroup>

        {hasChildCategories && (
          <div
            style={{
              display: isCategoryOrChildSelected(parentCategoryId)
                ? "block"
                : "none",
            }}
          >
            {children.map((childCategory) =>
              renderCategories(childCategory.id, depth + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : "";
  };

  const handleCategoryClick = (categoryId) => {
    const index = selectedCategory.indexOf(categoryId);

    if (index === -1) {
      setSelectedCategory([...selectedCategory, categoryId]);
    } else {
      setSelectedCategory(selectedCategory.slice(0, index));
    }
  };

  return (
    <React.Fragment>
      <ToastContainer />
      <form onSubmit={formik.handleSubmit}>
        <Grid container alignItems="stretch">

          <Grid item md={8} style={{ display: "flex", width: "100%" }}>
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
                  sx={{ fontSize: "1.5rem", fontWeight: "bold" }}
                >
                  Add New Documents
                </Typography>
              </Grid>
              <Dialog open={folderOpen}>
                <DialogTitle>New Folder</DialogTitle>
                <DialogContent>
                  <Grid
                    item
                    md={12}

                  >
                    <Typography
                      gutterBottom
                      sx={{ fontSize: "1.0rem", fontWeight: "bold" }}
                    >
                      Name *
                    </Typography>
                    <TextField
                      name="name"
                      label="Name"
                      fullWidth
                      onChange={handleInputChange}
                      variant="outlined"
                      sx={{
                        borderRadius: "10px",
                      }}
                      InputProps={{
                        style: {
                          borderRadius: "10px",
                        },
                      }}
                      my={2}
                    />
                  </Grid>

                  <Grid
                    item
                    md={12}

                  >
                    <Typography
                      gutterBottom
                      sx={{ fontSize: "1.0rem", fontWeight: "bold" }}
                    >
                      parent Folder *
                    </Typography>
                    <FormControl component="fieldset">
                      {categories
                        .filter((category) => !category.parent)
                        .map((mainCategory) => renderCategories(mainCategory.id))}
                    </FormControl>
                  </Grid>
                </DialogContent>
                <Stack
                  spacing={2}
                  direction="row"
                  sx={{
                    textAlign: "center",
                    justifyContent: "center",
                    display: "flex",
                  }}
                >
                  <Button
                    onClick={handlefolderClose}
                    sx={{
                      borderRadius: 2,
                      width: "30%",
                    }}
                    variant="outlined"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateFolder}
                    variant="contained"
                    sx={{
                      borderRadius: 2,
                      width: "30%",
                      backgroundColor: "black",
                    }}
                  >
                    Create
                  </Button>
                </Stack>

                <DialogActions></DialogActions>
              </Dialog>

              <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add Version</DialogTitle>
                <DialogContent>
                  <Grid
                    container
                    spacing={1}
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      sx={{
                        display: "flex",
                        justifyContent: "left",
                        alignItems: "center",
                      }}
                    >
                      <InputLabel
                        sx={{
                          marginRight: "10px",
                          display: "flex",
                          alignItems: "center",
                          fontWeight: 400,
                          width: "10rem",
                          fontSize: "1rem",
                          color: "black",
                        }}
                      >
                        Version
                      </InputLabel>
                      <TextField
                        onChange={(event) =>
                          handleChange("version", event.target.value, { version })
                        }
                        id="version"
                        label="Version"
                        sx={{
                          width: "100%",
                          borderRadius: "20px",
                        }}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      sx={{
                        display: "flex",
                        justifyContent: "left",
                        alignItems: "center",
                      }}
                    >
                      <InputLabel
                        sx={{
                          marginRight: "10px",
                          display: "flex",
                          alignItems: "center",
                          fontWeight: 400,
                          width: "10rem",
                          fontSize: "1rem",
                          color: "black",
                        }}
                      >
                        Description
                      </InputLabel>
                      <TextField
                        required
                        id="description"
                        label="Description"
                        multiline
                        rows={2}
                        variant="outlined"
                        InputProps={{
                          style: {
                            borderRadius: "10px",
                          },
                        }}
                        sx={{
                          marginTop: "20px",
                          width: "100%",
                          borderRadius: "10px",
                          marginBottom: "20px",
                        }}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      sx={{
                        display: "flex",
                        justifyContent: "left",
                        alignItems: "center",
                      }}
                    >
                      <InputLabel
                        sx={{
                          marginRight: "10px",
                          display: "flex",
                          alignItems: "center",
                          fontWeight: 400,
                          width: "10rem",
                          fontSize: "1rem",
                          color: "black",
                        }}
                      >
                        Document
                      </InputLabel>
                      <Grid
                        item
                        md={12}
                        sx={{
                          display: "flex",
                          justifyContent: "left",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          component="label"
                          variant="contained"
                          startIcon={<CloudUploadIcon />}
                        >
                          Select file
                          <VisuallyHiddenInput
                            type="file"
                            onChange={handleFileChange}
                          />
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </DialogContent>


                <DialogActions>
                  <Grid item xl={12} xs={12} md={12}>
                    <Grid container spacing={2} p={6}>
                      <Grid item xs={6} md={6}>
                        <Button
                          variant="contained"
                          sx={{

                            backgroundColor: "#000",
                          }}

                          onClick={handleFileUpload}
                        >
                          Upload
                        </Button>
                      </Grid>
                      <Grid
                        item
                        xs={6}
                        md={6}
                        sx={{ display: "flex", justifyContent: "right" }}
                      >
                        <Button

                          variant="contained"
                          sx={{

                            backgroundColor: "#000",

                          }}
                          onClick={handleClose}
                        >
                          Close
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>




                </DialogActions>
              </Dialog>


              <Card mb={12}>
                <CardContent>
                  {formik.isSubmitting ? (
                    <Box display="flex" justifyContent="center" my={6}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <>
                      <Grid
                        container
                        spacing={2}
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                      >
                        <Grid container spacing={8} alignItems="center">
                          <Grid item xs={6}>
                            <FormControl
                              sx={{
                                m: 1,
                                width: "100%",
                                marginBottom: "20px",
                              }}
                              size="medium"
                            >
                              <TextField
                                name="name"
                                label="Document Name"
                                value={formik.values.name}
                                required
                                error={Boolean(
                                  formik.touched.name && formik.errors.name
                                )}
                                fullWidth
                                helperText={
                                  formik.touched.name && formik.errors.name
                                }
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                variant="outlined"
                                InputProps={{
                                  style: {
                                    borderRadius: "10px",
                                  },
                                }}
                                my={2}
                              />
                            </FormControl>
                          </Grid>
                        </Grid>

                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={6}>
                            <FormControl
                              sx={{
                                m: 1,
                                width: "100%",
                                marginBottom: "20px",
                              }}
                              size="medium"
                            >
                              <TextField
                                name="description"
                                label="Document Description"
                                value={formik.values.description}
                                required
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
                                InputProps={{
                                  style: {
                                    borderRadius: "10px",
                                  },
                                }}
                                rows={5}
                                my={2}
                              />
                            </FormControl>
                          </Grid>
                        </Grid>
                        <Grid
                          item
                          md={12}
                          sx={{
                            display: "flex",
                            justifyContent: "left",
                            alignItems: "center",
                          }}
                        >
                          <InputLabel
                            sx={{
                              marginRight: "10px",
                              display: "flex",
                              justifyContent: "right",
                              alignItems: "center",
                              fontWeight: 700,
                              width: "8rem",
                              fontSize: "1rem",
                              color: "#376fd0",
                            }}
                          ></InputLabel>
                        </Grid>
                      </Grid>

                    </>
                  )}
                </CardContent>
              </Card>

            </Paper>
          </Grid>
          <Grid item md={4} style={{ display: "flex", width: "100%" }}>
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
                  sx={{ fontSize: "1.3rem", fontWeight: "bold" }}
                >
                  Select Folder *
                </Typography>
              </Grid>
              <FormControl component="fieldset">
                {categories
                  .filter((category) => !category.parent)
                  .map((mainCategory) => renderCategories(mainCategory.id))}
              </FormControl>
              <Grid item xs={12}>
                <Button
                  mr={2}
                  variant="contained"
                  sx={{
                    fontWeight: "bolder",
                    background: "#E19133",
                    "&:hover": {
                      background: "Black",
                      color: "white",
                    },
                  }}
                  onClick={handleModalFolerOpen}
                  startIcon={<AddCircleOutlineIcon />}
                >
                  New Folder
                </Button>

              </Grid>
            </Paper>
          </Grid>
          <Grid item md={12}>
            <FileTable
              files={filesData.map((file) => ({
                ...file,
                actions: true,
              }))}
              onRemoveFile={handleRemoveFile}
              handleOpen={handleOpen}
            />

          </Grid>
          <Grid item xl={12} xs={12} md={12}>
            <Grid container spacing={2} p={6}>
              <Grid item xs={6} md={6}>
                <Button
                  variant="contained"
                  sx={{
                    fontSize: "14px",

                    fontWeight: "bolder",
                    backgroundColor: "#333333",
                  }}
                  startIcon={<ReplyIcon />}
                  onClick={() => navigate("/MISAdministration/document-management/")}
                >
                  Back
                </Button>
              </Grid>
              <Grid
                item
                xs={6}
                md={6}
                sx={{ display: "flex", justifyContent: "right" }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  sx={{

                    backgroundColor: "#E19133",

                  }}
                  startIcon={<FileUploadIcon />}
                >
                  Upload
                </Button>
              </Grid>
            </Grid>
          </Grid>

        </Grid>
      </form>
    </React.Fragment>
  );
};
export default AddDocument;