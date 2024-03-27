import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import styled from "@emotion/styled";
import {
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent, Divider, Paper as MuiPaper, Stack, Tooltip,
} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {spacing} from "@mui/system";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from '@mui/icons-material/Done';
import { toast } from "react-toastify";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {approveProduct, deleteProductById, getProducts} from "../../apis/product";
import {getCategoryById} from "../../apis/category";
import {getUnitById} from "../../apis/unit";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import UploadIcon from '@mui/icons-material/Upload';

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
    custom_blue: {
      main: "#23A295",
      contrastText: "#FFFFFF",
    },
  },
});

const ProductsDataTable = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const [filterModel, setFilterModel] = useState({
    items: [],
  });
  const [isDeleteModalOpen, setOpenDeleteModal] = useState(false);
  const [isApproveModalOpen, setOpenApproveModal] = useState(false);
  const [id, setId] = useState();
  const [productId, setProductId] = useState();
  const [approved, setApproved] = useState(false);
  const [selectedRowId, setSelectedRowId] = React.useState(null);
  const queryClient = useQueryClient();

  const handleClick = (event, rowId) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowId(rowId);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedRowId(null);
  };

  const handleEditProduct = (rowId) => {
    navigate(
      `/master-data-registry/products/new-product/${rowId}`
    );
  };

  const {
    data: productsData,
    isLoading,
    isError,
    error
  } = useQuery(["getProducts"], getProducts);
  const { refetch } = useQuery(
    ["deleteProductById", id],
    deleteProductById,
    { enabled: false }
  );
  const {
    isLoading: isLoadingApproveProduct
  } = useQuery(["approveProduct", productId], approveProduct, {
    enabled: !!productId && approved
  });
  function GetProductCategoryName(params) {
    const productCategoryId = params.value;
    const result = useQuery(
      ["getCategoryById", productCategoryId],
      getCategoryById
    );
    if (result && result.data) {
      return result.data.data.name;
    }
  }

  function GetProductUnitName(params) {
    const productUnitId = params.value;
    const result = useQuery(
      ["getUnitById", productUnitId],
      getUnitById
    );
    if (result && result.data) {
      return result.data.data.name;
    }
  }

  function GetProductStatus(params) {
    const productStatus = params.row.status;
    if (productStatus == 0) {
      return "Pending";
    } else {
      return "Approved";
    }
  }

  if (isLoading) {
    return "Loading....";
  }

  if (isError) {
    toast(error.response.data, {
      type: "error",
    });
  }

  const handleDeleteProduct = async () => {
    await refetch();
    setOpenDeleteModal(false);
    await queryClient.invalidateQueries(["getProducts"]);
  };

  const handleApproveProduct = async () => {
    setApproved(true);
    setOpenApproveModal(false);
    await queryClient.invalidateQueries(["getProducts"]);
  };

  const buildMenuItems = (rowId) => {
    const menuItems = [];

    menuItems.push(
      <MenuItem onClick={() => handleEditProduct(rowId)} disableRipple key="edit">
        <EditIcon />
        Edit
      </MenuItem>
    );

    const isApproveMenuItemVisible = productsData.data.data.find((row) => row.identifier === rowId)?.status === 0;
    if (isApproveMenuItemVisible) {
      menuItems.push(
        <Divider key="divider" />,
        <MenuItem onClick={() => handleOpenApproveModal(rowId)} disableRipple key="approve">
          <DoneIcon />
          Approve
        </MenuItem>
      );
    }

    menuItems.push(
      <Divider key="divider2" />,
      <MenuItem onClick={() => handleOpenDeleteModal(rowId)} disableRipple key="delete">
        <DeleteIcon />
        Delete
      </MenuItem>
    );

    return menuItems;
  };

  function handleOpenDeleteModal(id) {
    setId(id);
    setOpenDeleteModal(true);
    handleClose();
  }

  function handleOpenApproveModal(id) {
    setProductId(id);
    setOpenApproveModal(true);
    handleClose();
  }

  function handleCloseModal() {
    setOpenDeleteModal(false);
  }

  function handleCloseApproveModal() {
    setOpenApproveModal(false);
  }

  return (
    <Card mb={6}>
      <CardContent pb={1}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
        >
          <ThemeProvider theme={themeCustom}>
            <Button
              mr={2}
              variant="contained"
              onClick={() => navigate("/master-data-registry/products/new-product")}
              startIcon={<AddCircleOutlineIcon  />}
            >
              PRODUCT
            </Button>
          </ThemeProvider>
          <ThemeProvider theme={themeCustom}>
            <Button
              mr={2}
              variant="contained"
              color="custom_blue"
              onClick={() => navigate("/master-data-registry/products/new-product")}
              startIcon={<UploadIcon  />}
            >
              PRODUCTS
            </Button>
          </ThemeProvider>
        </Stack>
      </CardContent>
      <br />
      <Paper>
        <div style={{ height: 800, width: "100%" }}>
          <DataGrid
              getRowId={(row) => row.identifier}
            columns={[
              {
                field: "name",
                headerName: "Name",
                editable: false,
                flex: 1,
                valueGetter: (params) => params.row.values.l3[0].data
              },
              {
                field: "code",
                headerName: "Code",
                editable: false,
                flex: 1,
                valueGetter: (params) => params.row.identifier
              },
              {
                field: "family",
                headerName: "Category",
                editable: false,
                flex: 2
              },
              {
                field: "unit",
                headerName: "Unit",
                editable: false,
                flex: 1,
                valueGetter: (params) => params.row.values.basE_UOM[0].data
              },
              {
                field: "identifier",
                headerName: "Status",
                editable: false,
                flex: 1,
                valueGetter: GetProductStatus,
              },
              {
                field: "status",
                headerName: "Action",
                sortable: false,
                flex: 1,
                renderCell: (params) => {
                  const isMenuOpen = selectedRowId === params.row.identifier;

                  return (
                    <div>
                      <Button
                        startIcon={<MoreVertIcon />}
                        size="small"
                        onClick={(event) => {
                          handleClick(event, params.row.identifier);
                        }}
                      ></Button>
                      <Menu
                        id={`demo-customized-menu-${params.row.identifier}`}
                        MenuListProps={{
                          'aria-labelledby': `demo-customized-button-${params.row.id}`,
                        }}
                        anchorEl={anchorEl}
                        open={isMenuOpen}
                        onClose={handleClose}
                      >
                        {buildMenuItems(params.row.id)}
                      </Menu>
                    </div>
                  );
                },
              },
            ]}
            rows={isLoading || isError ? [] : productsData ? productsData.data.data : []}
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
            Delete Product
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete Product?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleDeleteProduct}
              color="primary"
            >
              Yes
            </Button>
            <Button onClick={handleCloseModal} color="error" autoFocus>
              No
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={isApproveModalOpen}
          onClose={handleCloseApproveModal}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Approve Product
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to approve the Product?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleApproveProduct}
              color="primary"
            >
              Yes
            </Button>
            <Button onClick={handleCloseApproveModal} color="error" autoFocus>
              No
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Card>
  );
};
export default ProductsDataTable;
