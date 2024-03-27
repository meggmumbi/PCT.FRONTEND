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
import {getCategoryById} from "../../apis/category";
import {getUnitById} from "../../apis/unit";
import {deleteCarrierById, getCarriers} from "../../apis/carrier";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
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

const CarriersDataTable = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [filterModel, setFilterModel] = useState({
    items: [],
  });
  const [isDeleteModalOpen, setOpenDeleteModal] = useState(false);
  const [id, setId] = useState();
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { refetch } = useQuery(
    ["deleteCarrierById", id],
    deleteCarrierById,
    { enabled: false }
  );
  const handleClick = (event, params) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(params);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleEditCarrier = () => {
    navigate(
      `/master-data-registry/carriers/new-carrier/${selectedRow.id}`
    );
  };
  const handleDeleteVendor = async () => {
    await refetch();
    setOpenDeleteModal(false);
    await queryClient.invalidateQueries(["getCarriers"]);
  };
  const {
    data: carriersData,
    isLoading,
    isError,
  } = useQuery(["getCarriers"], getCarriers);

  function GetLocationCategoryName (params) {
    const productCategoryId = params.value;
    const result = useQuery(
      ["getCategoryById", productCategoryId],
      getCategoryById
    );
    if (result && result.data) {
      return result.data.data.name;
    }
  }

  function GetLocationUnitName (params) {
    const productUnitId = params.value;
    const result = useQuery(
      ["getUnitById", productUnitId],
      getUnitById
    );
    if (result && result.data) {
      return result.data.data.name;
    }
  }

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
            onClick={() => navigate("/master-data-registry/carriers/new-carrier")}
            startIcon={<AddCircleOutlineIcon  />}
          >
            CARRIER
          </Button>
        </ThemeProvider>
      </CardContent>
      <br />
      <Paper>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            columns={[
              {
                field: "name",
                headerName: "Carrier Name",
                editable: false,
                flex: 1,
              },
              {
                field: "category",
                headerName: "Category",
                editable: false,
                flex: 1,
                valueGetter: GetLocationCategoryName,
              },
              {
                field: "unit",
                headerName: "Units",
                editable: false,
                flex: 1,
                valueGetter: GetLocationUnitName,
              },
              {
                field: "description",
                headerName: "Description",
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
                        onClick={handleEditCarrier}
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
            rows={isLoading || isError ? [] : carriersData ? carriersData.data : []}
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
            Delete Carrier
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete Carrier?
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
export default CarriersDataTable;
