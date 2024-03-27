import React, { useEffect, useMemo, useRef, useState, useContext } from "react";
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
  Stack,
  FormControl,
  FormLabel,
  TextField as MuiTextField,
  Typography,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Select,
} from "@mui/material";
import { spacing } from "@mui/system";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ReplyIcon from "@mui/icons-material/Reply";
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ToastContainer, toast } from "react-toastify";
import { SiteContext } from "../../../index";
import {
  getCategories, getCategoryDetails,
  postCategory,
  deleteCategoryById,
} from "../apis/document-management";
import Paper from "@mui/material/Paper";
import _ from "lodash";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import MaterialReactTable from "material-react-table";
import { version } from "process";

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

const AddCategory = () => {
  let { id } = useParams();

  const [requisitions, setRequisitions] = useState([]);
  const tableInstanceRef = useRef(null);
  const siteContext = useContext(SiteContext);
  const [rowSelection, setRowSelection] = useState({});
  const [categoryData, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategory] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const open = Boolean(anchorEl);

  const [filterModel, setFilterModel] = useState({
    items: [],
  });
  const [isDeleteModalOpen, setOpenDeleteModal] = useState(false);
  //const [id, setId] = useState();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const theme = useTheme();

  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));

  //   const deleteCategory = useQuery(
  //     ["deleteCategoryById", id],
  //     deleteCategoryById,

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const handleClick = (event, params) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(params);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleEditDocument = () => {
    navigate(`/MISAdministration/document-management/category/${selectedRow.id}`);
  };

  const { refetch } = useQuery(["getCategories", siteContext.selectedSite ? siteContext.selectedSite.id : ""], getCategories, {
    onSuccess: (response) => {
      console.log(response.data);
      setData(response.data);
      setRowCount(response.data.totalRecords);
    },
  });

  useEffect(() => {
    refetch();
  }, [pagination.pageIndex, pagination.pageSize, refetch]);

  const handleDeleteDocument = async () => {
    try {
      await Deletemutation.mutateAsync({
        queryKey: ["deleteCategoryById", id],
      });

      setOpenDeleteModal(false);

      toast.success("delete Successfull", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      queryClient.invalidateQueries(["getLocations"]);
      await refetch();
    } catch (error) {
      console.error("Error deleting document", error);
    }
  };


  const { } = useQuery(["getCategories", siteContext.selectedSite ? siteContext.selectedSite.id : ""], getCategories, {

    onSuccess: (response) => {
      setCategory(response.data);
    },
  });

  const { } = useQuery(
    ['getCategoryDetails', id],
    () => getCategoryDetails(id),
    {
      onSuccess: (response) => {
        console.log("details", response.data);
        formik.setValues({
          name: response.data.name,
          parent: response.data.parent,
          description: response.data.description,
        })
        setSelectedCategory(response.data.parent)
      },
    }
  );

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const mutation = useMutation({ mutationFn: postCategory });
  const Deletemutation = useMutation({ mutationFn: deleteCategoryById });

  const popError = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 10000,
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
      parent: null,
      tenantId: null,
    },
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const docItems = {
          name: values.name,
          description: values.description,
          parent: selectedCategory ? selectedCategory : null,
          tenantId: siteContext.selectedSite?.id,
        };
        if (!!id) {
          docItems.id = id;
          await mutation.mutateAsync(docItems);
          popSuccess("Category has been updated successfully");
        } else {
          await mutation.mutateAsync(docItems);
          popSuccess("Category has been added successfully");
        }


        await refetch();


        resetForm();

        handleRedirectToFolders();
      } catch (error) {
        console.log(error);
        popError(error.response.data);
      }
    },
  });

  const handleRedirectToFolders = () => {
    navigate(`/MISAdministration/document-management/folderList`);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "name", //simple recommended way to define a column
        header: "Folder",
      },
      {
        accessorKey: "description", //simple recommended way to define a column
        header: "Description",
      },
    ],
    []
  );

  const tableTheme = useMemo(() =>
    createTheme({
      palette: {
        background: {
          default: "#fff",
        },
      },
    })
  );

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
            disabled={parentCategoryId === id}
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
      <Grid container alignItems="stretch" p={isLgUp ? 12 : 5}>
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
                Add New Folder
              </Typography>
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
                      <Grid
                        container
                        spacing={2}
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                      >
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
                                name="name"
                                label="Folder Name"
                                value={formik.values.name}
                                required
                                error={Boolean(
                                  formik.touched.name && formik.errors.name
                                )}
                                fullWidth
                                helperText={
                                  formik.touched.name && formik.errors.name
                                }
                                InputProps={{
                                  style: {
                                    borderRadius: "10px",
                                  },
                                }}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                variant="outlined"
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
                                label="Description"
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
                                InputProps={{
                                  style: {
                                    borderRadius: "10px",
                                  },
                                }}
                                variant="outlined"
                                rows={5}
                                my={2}
                              />
                            </FormControl>
                          </Grid>
                        </Grid>
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
                              onClick={() =>
                                navigate(
                                  "/MISAdministration/document-management/folderList"
                                )
                              }
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
                              startIcon={<ArrowCircleUpIcon />}
                            >
                              Save
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    </>
                  )}
                </CardContent>
              </Card>
            </form>
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
                Select Parent Folder
              </Typography>
            </Grid>
            <FormControl component="fieldset">
              {categories
                .filter((category) => !category.parent)
                .map((mainCategory) => renderCategories(mainCategory.id))}
            </FormControl>

          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
export default AddCategory;
