import React, {useState} from "react";
import styled from "@emotion/styled";
import {
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent, Divider,
  Paper as MuiPaper,
} from "@mui/material";
import {spacing} from "@mui/system";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {useNavigate} from "react-router-dom";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {deleteVendorById, getVendors} from "../../apis/vendor";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

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

const VendorsDataTable = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [filterModel, setFilterModel] = useState({
    items: [],
  });
  const [isDeleteModalOpen, setOpenDeleteModal] = useState(false);
  const [id, setId] = useState();
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleClick = (event, params) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(params);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleEditVendor = () => {
    navigate(
      `/master-data-registry/vendors/new-vendor/${selectedRow.id}`
    );
  };
  const {
    data: vendorsData,
    isLoading,
    isError,
  } = useQuery(["getVendors"], getVendors);
  const { refetch } = useQuery(
    ["deleteVendorById", id],
    deleteVendorById,
    { enabled: false }
  );
  const handleDeleteVendor = async () => {
    await refetch();
    setOpenDeleteModal(false);
    await queryClient.invalidateQueries(["getVendors"]);
  };

  function handleOpenDeleteModal(id) {
    setId(id);
    setOpenDeleteModal(true);
    handleClose();
  }

  function handleCloseModal() {
    setOpenDeleteModal(false);
  }

  return (
    <Card mb={6}>
      <CardContent pb={1}>
        <ThemeProvider theme={themeCustom}>
          <Button
            mr={2}
            variant="contained"
            onClick={() => navigate("/master-data-registry/vendors/new-vendor")}
            startIcon={<AddCircleOutlineIcon  />}
          >
            VENDOR
          </Button>
        </ThemeProvider>
      </CardContent>
      <br />
      <Paper>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            columns={[
              {
                field: "vendorName",
                headerName: "Name",
                editable: false,
                flex: 2,
              },
              {
                field: "vendorCode",
                headerName: "Code",
                editable: false,
                flex: 1,
              },
              {
                field: "vendorRating",
                headerName: "Rating",
                editable: false,
                flex: 1,
              },
              {
                field: "action",
                headerName: "Action",
                sortable: false,
                flex: 1,
                renderCell: (params) => (
                  <>
                    <Button
                      startIcon={<MoreVertIcon />}
                      size="small"
                      onClick={(event) => handleClick(event, params)}
                    ></Button>
                    <Menu
                      id="demo-customized-menu"
                      MenuListProps={{
                        'aria-labelledby': 'demo-customized-button',
                      }}
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                    >
                      <MenuItem
                        onClick={handleEditVendor}
                        disableRipple
                      >
                        <EditIcon />
                        Edit
                      </MenuItem>
                      <Divider />
                      <MenuItem
                        onClick={() => handleOpenDeleteModal(selectedRow.id)}
                        disableRipple
                      >
                        <DeleteIcon />
                        Delete
                      </MenuItem>
                    </Menu>
                  </>
                ),
              },
            ]}
            rows={isLoading || isError ? [] : vendorsData ? vendorsData.data : []}
            components={{ Toolbar: GridToolbar }}
          />
        </div>
        <Dialog
          open={isDeleteModalOpen}
          onClose={handleCloseModal}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Delete Vendor
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete Vendor?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleDeleteVendor}
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
  );
};
export default VendorsDataTable;
