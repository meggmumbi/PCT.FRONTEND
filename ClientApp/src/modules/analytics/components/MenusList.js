import React, { useContext } from "react";
import { Box, Card, CardContent, Divider, Paper } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { NavLink, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { DataGrid } from "@mui/x-data-grid";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteCategoryById, getMenus } from "../apis/analytics";
import { SiteContext } from "../../../index";
import { Edit2, Trash as TrashIcon } from "react-feather";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";

const MenusListData = () => {
  const [open, setOpen] = React.useState(false);
  const [id, setId] = React.useState();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const siteContext = useContext(SiteContext);
  const selectedSite = siteContext.selectedSite;

  const { data, isLoading, isError } = useQuery(
    ["getMenus", selectedSite.id],
    getMenus
  );
  const { refetch } = useQuery(["deleteCategoryById", id], deleteCategoryById, {
    enabled: false,
  });
  function GetParentName(params) {
    const val = params.row.parent;
    if (!isLoading && !isError) {
      const found = data.data.find((obj) => obj.id === val);
      if (found) {
        return found.name;
      }
    }
  }

  function handleClickOpen(id) {
    setOpen(true);
    setId(id);
  }

  function handleClose() {
    setOpen(false);
  }

  const handleDeleteMenu = async () => {
    await refetch();
    setOpen(false);
    await queryClient.invalidateQueries(["getMenus"]);
  };

  return (
    <Box>
      <Paper square={true} sx={{ borderTop: 5 }} elevation={8}>
        <Card mb={6} square={true}>
          <CardContent pb={1}>
            <Button
              variant="contained"
              color="primary"
              mr={2}
              onClick={() => navigate("/analytics/new-menu")}
            >
              <AddOutlinedIcon />
              NEW MENU
            </Button>
          </CardContent>
          <br />

          <Paper>
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid
                rowsPerPageOptions={[5, 10, 25]}
                columns={[
                  {
                    field: "name",
                    headerName: "Name",
                    editable: false,
                    flex: 1,
                  },
                  {
                    field: "parent",
                    headerName: "Parent",
                    editable: false,
                    flex: 1,
                    valueGetter: GetParentName,
                  },
                  {
                    field: "menuOrder",
                    headerName: "Order",
                    editable: false,
                    flex: 1,
                  },
                  {
                    field: "color",
                    headerName: "Color",
                    editable: false,
                    flex: 1,
                  },
                  {
                    field: "url",
                    headerName: "Url",
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
                        <NavLink to={`/analytics/new-menu/${params.id}`}>
                          <Button startIcon={<Edit2 />} size="small"></Button>
                        </NavLink>
                        <Button
                          startIcon={<TrashIcon />}
                          size="small"
                          onClick={() => handleClickOpen(params.id)}
                        ></Button>
                      </>
                    ),
                  },
                ]}
                rows={isLoading || isError ? [] : data.data}
              />
            </div>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">Delete Menu</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete Menu?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDeleteMenu} color="primary">
                  Yes
                </Button>
                <Button onClick={handleClose} color="error" autoFocus>
                  No
                </Button>
              </DialogActions>
            </Dialog>
          </Paper>
        </Card>
      </Paper>
    </Box>
  );
};

const MenusList = () => {
  return (
    <React.Fragment>
      <Helmet title="Menus" />
      <Divider />
      <MenusListData />
    </React.Fragment>
  );
};
export default MenusList;
