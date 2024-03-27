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
  IconButton,
  Stack,
  FormControl,
  FormLabel,
  TextField as MuiTextField,
  Typography,
  MenuItem,
  Divider,
  Select,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { spacing } from "@mui/system";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ToastContainer, toast } from "react-toastify";
import { SiteContext } from "../../../index";
import { getCategories, postCategory, deleteCategoryById, getAllCategories } from "../apis/document-management";
import Paper from "@mui/material/Paper";
import _ from "lodash";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import FolderIcon from "@mui/icons-material/Folder";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import MaterialReactTable from "material-react-table";
import { version } from "process";

import 'react-toastify/dist/ReactToastify.min.css'

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

const FolderList = () => {
  const tableInstanceRef = useRef(null);
  const siteContext = useContext(SiteContext);
  const [rowSelection, setRowSelection] = useState({});
  const [categoryData, setData] = useState([])
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [categories, setCategory] = useState("");
  const [rowCount, setRowCount] = useState(0);
  const [selectedRow, setSelectedRow] = useState(null);

  const open = Boolean(anchorEl);
  const theme = useTheme();
  const [filterModel, setFilterModel] = useState({
    items: [],
  });
  const [isDeleteModalOpen, setOpenDeleteModal] = useState(false);
  const [id, setId] = useState();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const handleClick = (event, params) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(params);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleArrowBackClick = () => {
    navigate("/MISAdministration/document-management");
  };

  const { refetch } = useQuery(
    ["getAllCategories", pagination, siteContext.selectedSite ? siteContext.selectedSite.id : ""],
    getAllCategories,
    {
      onSuccess: (response) => {
        setData(response.data.data)
        setRowCount(response.data.totalRecords);
      }
    }
  );

  useEffect(() => {
    refetch();
  }, [pagination.pageIndex, pagination.pageSize, refetch])


  const handleDeleteDocument = async () => {
    try {

      await Deletemutation.mutateAsync({ queryKey: ["deleteCategoryById", id] });

      setOpenDeleteModal(false);

      popSuccess("delete Successfully");

      queryClient.invalidateQueries(['getLocations']);
      await refetch();
    } catch (error) {
      popError("Error deleting document");

    }
  };

  const { } = useQuery(["getCategories", siteContext.selectedSite ? siteContext.selectedSite.id : ""], getCategories, {
    onSuccess: (response) => {
      setCategory(response.data);
    },
  });



  function handleOpenDeleteModal(id) {
    setId(id);
    setOpenDeleteModal(true);
    handleClose();
  }

  const handleEditCategory = () => {
    navigate(`/MISAdministration/document-management/category/${selectedRow.id}`);
  };

  function handleCloseModal() {
    setOpenDeleteModal(false);
  }

  const mutation = useMutation({ mutationFn: postCategory });
  const Deletemutation = useMutation({ mutationFn: deleteCategoryById });

  const popError = (message) => {
    toast.error(message, {
      position: 'top-right',
      autoClose: 10000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }

  const popSuccess = (message) => {
    toast.success(message, {
      position: 'top-right',
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Folder',
        Cell: ({ row }) => (
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <FolderIcon style={{ marginRight: '5px' }} />
            {row.original.name}
          </Box>
        ),
      },
      {
        accessorKey: 'description',
        header: 'Description'
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
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          bgcolor: "white",
          borderTop: 5,
          borderColor: "#000000",
          width: "100%",
          px: 3,
          py: 5,
        }}
      >
        <Box>
          <Typography
            gutterBottom
            sx={{ fontSize: "2.5rem", fontWeight: "bold" }}
          >
            <IconButton
              onClick={handleArrowBackClick}
              sx={{
                marginRight: "8px",
                color: "#000",
              }}
            >
              <ArrowBackIcon sx={{ fontSize: "2.5rem" }} />
            </IconButton>
            Folders
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>

          <Button
            mr={2}
            variant="contained"
            sx={{
              fontWeight: "bolder",
              background: "Black",
              "&:hover": {
                background: "Black",
                color: "white",
              },
            }}
            onClick={() =>
              navigate("/MISAdministration/document-management/category/")
            }
            startIcon={<AddCircleOutlineIcon />}
          >
            New Folder
          </Button>

        </Box>
      </Box>

      <Card mb={6}>
        <Paper>
          <ThemeProvider theme={tableTheme}>
            <MaterialReactTable
              columns={columns}
              data={categoryData}
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
              enableRowActions
              positionActionsColumn="last"
              renderRowActions={({ row, table }) => {
                return (
                  <>
                    <Button
                      startIcon={<MoreVertIcon />}
                      size="small"
                      onClick={(event) => handleClick(event, row.original)}
                    ></Button>
                    <Menu
                      id={`demo-customized-menu-${row.original.id}`}
                      MenuListProps={{
                        'aria-labelledby': 'demo-customized-button',
                      }}
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                    >
                      <MenuItem
                        onClick={() => handleEditCategory()}
                        disableRipple
                      >
                        <EditIcon />
                        Edit
                      </MenuItem>
                      <Divider />
                      <MenuItem
                        onClick={() => handleOpenDeleteModal(row.original.id)}
                        disableRipple
                      >
                        <DeleteIcon />
                        Delete
                      </MenuItem>
                    </Menu>
                  </>
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

          <Dialog
            open={isDeleteModalOpen}
            onClose={handleCloseModal}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              Delete Document
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete the document?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleDeleteDocument}
                color="primary"
              >
                Yes
              </Button>
              <Button onClick={handleCloseModal} color="error" autoFocus>
                No
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Card>

    </Box>
  );
};

export default FolderList;
