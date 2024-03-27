import React, { useMemo, useEffect, useRef, useState, useContext } from "react";
import styled from "@emotion/styled";
import {
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Divider,
  Paper as MuiPaper,
  IconButton,
  AppBar,
  Toolbar,
  InputLabel,
} from "@mui/material";
import {
  Folder,
  FolderOpen,
  Description,
  Image,
  InsertDriveFile,
} from "@mui/icons-material";
import DownloadIcon from "@mui/icons-material/Download";
import { Box, spacing } from "@mui/system";
// import Fade from "react-reveal/Fade";
import FolderIcon from "@mui/icons-material/Folder";

import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Grid, TextField, Typography } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import useMediaQuery from "@mui/material/useMediaQuery";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/RemoveRedEye";
import DeleteIcon from "@mui/icons-material/Delete";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import {
  getDocuments,
  getCategories,
  deleteDocumentById,
  getDocumentsByCategoryId,
} from "../apis/document-management";

import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import MaterialReactTable from "material-react-table";
import GridOnIcon from "@mui/icons-material/GridOn";
import VisibilityIcon from "@mui/icons-material/Visibility";
import GridViewIcon from "@mui/icons-material/GridView";
import axios from "axios";
import { apiRoutes } from "../routes/apiRoutes";

import "react-toastify/dist/ReactToastify.min.css";
import { SiteContext } from "../../../index";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Button = styled(MuiButton)(spacing);
const Paper = styled(MuiPaper)(spacing);

const themeCustom = createTheme({
  palette: {
    custom_black: {
      main: "#000000",
      contrastText: "#FFFFFF",
    },
  },
});

const FileIcon = ({ type }) => {
  if (!type) {
    return null;
  }
  let fileType = type.files[0].fileName;
  const fileExtension = fileType.split(".").pop().toLowerCase();

  switch (fileExtension) {
    case "docx":
      return <Description />;
    case "pdf":
      return <InsertDriveFile />;
    case "png":
      return <Image />;
    case "jpg":
      return <Image />;
    case "jpeg":
      return <Image />;
    // add more cases for other file types
    default:
      return type.file[0].fileName;
  }
};

const DocumentList = () => {
  const [requisitions, setRequisitions] = useState([]);
  const siteContext = useContext(SiteContext);
  const tableInstanceRef = useRef(null);
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [categories, setCategory] = useState("");
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const theme = useTheme();

  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));
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

  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);

  const {} = useQuery(
    [
      "getCategories",
      siteContext.selectedSite ? siteContext.selectedSite.id : "",
    ],
    getCategories,
    {
      onSuccess: (response) => {
        setFolders(response.data);
      },
    }
  );

  useEffect(() => {
    // fetch files from the endpoint based on the selected folder
    if (selectedFolder) {
      axios.get(`${apiRoutes.alldocuments}`).then((response) => {
        if (selectedFolder && response.data.files) {
          const filteredFiles = response.data.files.filter(
            (file) => file.category === selectedFolder.id
          );
          setFiles(filteredFiles);
        }
      });
    }
  }, [selectedFolder]);

  const handleFolderClick = (folder) => {
    // set the selected folder and expand or collapse it
    setSelectedFolder(folder);
    folder.expanded = !folder.expanded;
    setFolders([...folders]);
  };

  const ActionsMenu = ({ file }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const downloadFile = (file, fileName) => {
      console.log("filefilefilefile", file);
      const byteCharacters = atob(file);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/octet-stream" });

      const a = document.createElement("a");
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = `${fileName}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    };

    return (
      <>
        <Button
          startIcon={<MoreVertIcon />}
          size="small"
          onClick={handleClick}
        ></Button>
        <Menu
          id={`demo-customized-menu-${file.id}`}
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem
            onClick={() =>
              downloadFile(file.files[0].file, file.files[0].fileName)
            }
          >
            <DownloadIcon />
            Downloads {file.fileName}
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => handleEditDocument(file.id)} disableRipple>
            <EditIcon />
            Edit
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => handleOpenDeleteModal(file.id)}
            disableRipple
          >
            <DeleteIcon />
            Delete
          </MenuItem>
        </Menu>
      </>
    );
  };

  const handleClick = (event, params) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(params);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditDocument = (id) => {
    navigate(`/MISAdministration/document-management/document/${id}`);
  };

  const Deletemutation = useMutation({ mutationFn: deleteDocumentById });

  const { refetch } = useQuery(
    [
      "getDocuments",
      pagination,
      siteContext.selectedSite?.id,
      selectedFolder?.id,
    ],
    getDocuments,
    {
      onSuccess: (response) => {
        if (selectedFolder && response.data) {
          // Find the document that matches the selected folder ID
          const matchingDocuments = response.data.data;

          console.log(matchingDocuments);
          // Concatenate files from all matching documents
          const allFiles = matchingDocuments.flatMap((doc) => doc.files || []);

          // Update files state with files from all matching documents
          setFiles(matchingDocuments);

          // Set the total record count based on all matching documents
          setRowCount(response.data.totalRecords);
        } else {
          // No files found for the selected folder
          setFiles([]);
          setRowCount(0);
        }
      },
    }
  );

  useEffect(() => {
    refetch();
  }, [pagination.pageIndex, pagination.pageSize, refetch, selectedFolder]);


  const handleDelete = async (id) => {
    try {
      await deleteDocumentById(id);
      await refetch();

      setOpenDeleteModal(false);

      toast.success("Successfully deleted document", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClose: handleToastClose,
      });
    } catch (error) {
      toast.error("Error deleting document", error);
    }
  };

  function handleOpenDeleteModal(id) {
    setId(id);
    setOpenDeleteModal(true);
    handleClose();
  }

  function handleCloseModal() {
    setOpenDeleteModal(false);
  }

  const handleToastClose = () => {
    navigate("/MISAdministration/document-management/");
  };

  const columns = useMemo(
    () => [
      {
        field: "fileType",
        headerName: "File Type",
        width: 150,
        renderCell: (params) => <FileIcon type={params.row} />,
      },
      { field: "documentName", headerName: "Document Name", width: 400 },
      { field: "createdBy", headerName: "Created by", width: 100 },
      { field: "CreateDate", headerName: "Date Created", width: 150 },

      {
        field: "version",
        headerName: "Version",
        width: 200,
        renderCell: (params) =>
          params.row.files[0] ? params.row.files[0].version : "null",
      },

      {
        field: "actions",
        headerName: "Actions",
        width: 150,
        renderCell: (params) => <ActionsMenu file={params.row} />,
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

  const renderFolder = (folder, depth = 0) => {
    const hasChildFolders = folders.some((f) => f.parent === folder.id);
    const isRootFolder = !folder.parent;

    return (
      <Box
        key={folder.id}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",

          padding: 2,

          marginLeft: depth * 5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            style={{ color: "#E19133" }}
            onClick={() => handleFolderClick(folder)}
          >
            {folder?.expanded ? <FolderOpen /> : <Folder />}
          </IconButton>
          <Typography>{`${folder.name}`}</Typography>
        </Box>

        {hasChildFolders && (
          <Box sx={{ display: folder?.expanded ? "block" : "none" }}>
            {folders
              .filter((f) => f?.parent === folder?.id)
              .map((childFolder) => renderFolder(childFolder, depth + 1))}
          </Box>
        )}

        {!hasChildFolders && (isRootFolder || folder.expanded) && (
          <Box sx={{ marginLeft: 5, backgroundColor: "fff" }}>
            {Array.isArray(files) &&
              files
                .filter((file) => file?.folderId === folder?.id)
                .map((file) => (
                  <Box
                    key={file.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "fff",
                      padding: 2,
                    }}
                  >
                    <FileIcon type={file.fileType} />
                    <Typography>{`${file.name}`}</Typography>

                    <ActionsMenu file={file} />
                  </Box>
                ))}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        backgroundColor: "#fff",
        flexDirection: "column",
      }}
    >
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
        <Typography
          gutterBottom
          sx={{ fontSize: "2.5rem", fontWeight: "bold" }}
        >
          Document Management
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search document"
            InputProps={{
              startAdornment: <FilterListIcon />,
            }}
          />
          <IconButton>
            <FilterListIcon />
          </IconButton>
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
              navigate("/MISAdministration/document-management/document/")
            }
            startIcon={<AddCircleOutlineIcon />}
          >
            New Document
          </Button>
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
            onClick={() =>
              navigate("/MISAdministration/document-management/folderList/")
            }
            startIcon={<AddCircleOutlineIcon />}
          >
            New Folder
          </Button>
        </Box>
      </Box>

      <Box sx={{ flex: 1, display: "flex", backgroundColor: "#fff" }}>
        <Box
          sx={{
            width: 300,
            borderRight: "1px solid gray",
            backgroundColor: "#fff",
            overflowY: "auto",
          }}
        >
          <Box
            sx={{
              overflowY: "auto",
              backgroundColor: "#fff",
              height: "calc(60vh)",
            }}
          >
            {folders
              .filter((folder) => !folder.parent)
              .map((rootFolder) => renderFolder(rootFolder))}
          </Box>

          <Grid item xs={6}>
            <InputLabel
              variant="contained"
              onClick={() =>
                navigate("/MISAdministration/document-management/folderList/")
              }
              sx={{
                marginTop: "50px",
                backgroundColor: "#fff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: 700,
                width: "10rem",
                fontSize: "1rem",
                color: "#E19133",
              }}
            >
              Manage Folders
            </InputLabel>
          </Grid>
        </Box>

        <Box sx={{ flex: 1, overflowY: "auto", backgroundColor: "#fff" }}>
          <DataGrid
            rows={files}
            columns={columns}
            pageSize={10}
            scrollbarSize={10}
            scrolling={{ rowHeight: 40, mode: "virtual" }}
          />
        </Box>
      </Box>

      <Dialog
        open={isDeleteModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete Document</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete document?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete} color="primary">
            Yes
          </Button>
          <Button onClick={handleCloseModal} color="error" autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentList;
