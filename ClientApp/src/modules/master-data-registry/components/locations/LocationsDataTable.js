import React, { useMemo, useRef, useState } from "react";
import styled from "@emotion/styled";
import {
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent, Divider,
  Paper as MuiPaper,
  IconButton,
} from "@mui/material";
import { Box, spacing } from "@mui/system";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteLocationById, getLocations } from "../../apis/location";
import { getCategoryById } from "../../apis/category";
import { getUnitById } from "../../apis/unit";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MaterialReactTable from "material-react-table";

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

const LocationsDataTable = () => {
  const [requisitions, setRequisitions] = useState([]);
  const tableInstanceRef = useRef(null);
  const [rowSelection, setRowSelection] = useState({});
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const [filterModel, setFilterModel] = useState({
    items: [],
  });
  const [isDeleteModalOpen, setOpenDeleteModal] = useState(false);
  const [id, setId] = useState();
  const queryClient = useQueryClient();

  const handleClick = (event, params) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(params);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleEditLocation = () => {
    navigate(
      `/master-data-registry/locations/new-location/${selectedRow.id}`
    );
  };
  const {
    data: locationsData,
    isLoading,
    isError,
  } = useQuery(["getLocations"], getLocations);
  const { refetch } = useQuery(
    ["deleteLocationById", id],
    deleteLocationById,
    { enabled: false }
  );
  async function GetLocationCategoryName(params) {
    console.log('eeeee', 'result');
    let name = 'ff'
    const productCategoryId = params;
    const result = useQuery(
      ["getCategoryById", params],
      getCategoryById, {
      onSuccess: (response) => {
        console.log('catttts2', response.data.name);
        name = response.data.name
      }
    }
    );
    if (result && result.data) {
      return name
    }
    console.log('eeeee', result);
    return name
  }

  function GetLocationUnitName(params) {
    const productUnitId = params.value;
    const result = useQuery(
      ["getUnitById", productUnitId],
      getUnitById
    );
    if (result && result.data) {
      return result.data.data.name;
    }
  }

  const handleDeleteLocation = async () => {
    await refetch();
    setOpenDeleteModal(false);
    await queryClient.invalidateQueries(["getLocations"]);
  };

  function handleOpenDeleteModal(id) {
    setId(id);
    setOpenDeleteModal(true);
    handleClose();
  }

  function handleCloseModal() {
    setOpenDeleteModal(false);
  }


  const columns = useMemo(
    () => [
      {
        accessorKey: 'name', //simple recommended way to define a column
        header: 'Name'
      },
      {
        accessorKey: 'category', //simple recommended way to define a column
        header: 'Category'
      },
      {
        accessorKey: 'description', //simple recommended way to define a column
        header: 'Description'
      }
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
    <Card mb={6}>
      <Paper>
        <ThemeProvider theme={tableTheme}>
          <MaterialReactTable
            columns={columns}
            data={isLoading || isError ? [] : locationsData ? locationsData.data : []}
            enableColumnActions={false}
            onRowSelectionChange={setRowSelection} //hoist internal state to your own state (optional)
            state={{ rowSelection }} //manage your own state, pass it back to the table (optional)
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
                      onClick={handleEditLocation}
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
            //add custom action buttons to top-left of top toolbar
            renderTopToolbarCustomActions={({ table }) => (
              <Box sx={{ display: 'flex', gap: '1rem', p: '4px' }}>
                <Button
                  mr={2}
                  variant="contained"
                  onClick={() => navigate("/master-data-registry/locations/new-location")}
                  startIcon={<AddCircleOutlineIcon />}
                >
                  LOCATION
                </Button>
              </Box>
            )}
          />


        </ThemeProvider>

        <Dialog
          open={isDeleteModalOpen}
          onClose={handleCloseModal}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Delete Location
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete Location?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleDeleteLocation}
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
export default LocationsDataTable;
