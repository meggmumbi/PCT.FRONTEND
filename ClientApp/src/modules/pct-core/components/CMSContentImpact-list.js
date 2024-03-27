import React, { useState, useContext } from "react";
import { useLocation } from 'react-router-dom';
import { Button, Card, CardContent, Paper } from "@mui/material";
import {
    Box,
    Breadcrumbs as MuiBreadcrumbs,
    Button as MuiButton,
    Card as MuiCard,
    CardContent as MuiCardContent,
    CircularProgress,
    Divider as MuiDivider,
    Grid,
    Link,
    MenuItem,
    TextField as MuiTextField,
    Typography,
} from "@mui/material";
import { Trash as TrashIcon } from "react-feather";
import { Plus as PlusIcon } from "react-feather";
import { Shield as ShieldIcon } from "react-feather";
import { DataGrid } from "@mui/x-data-grid";
import Avatar from "@mui/material/Avatar";
import {useNavigate} from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getCMSContentImpact } from "../apis/cmscontent-impact";
import { GetCMSContentRolessByID } from "../apis/cmscontent-roles";
import { newCMSContentRoles } from "../apis/cmscontent-roles";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';



const CMSContentImpactList = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery(["getCMSContentImpact"], getCMSContentImpact);
  const mutation = useMutation({ mutationFn: newCMSContentRoles });
  const contentType = "1";
  const [contendID, setcontendID] = React.useState("");
  const { data: dataRoles, isLoading: isLoadingRoles, isError: isErrorRoles, refetch } =
      useQuery([contendID, contentType], GetCMSContentRolessByID, { refetchOnWindowFocus: false, staleTime: 0, cacheTime:0}
        );


  const [open, setOpen] = React.useState(false);
  const handleClickOpen = (e) => {              
      setcontendID(e);
      setOpen(true);
  };
  const handleClose = () => {
        setOpen(false);
  };
  const handleCloseSave = async () => {
      try {
          console.log("submiting");
          let contentValue = contendID;
          if (dataRoles) { 
              for (var i = 0; i < dataRoles.data.length; i++) {
                  var newValue = { "Id_roles": dataRoles.data[i].id, "Id_content": contendID, "Type": contentType, "Status": document.getElementById(dataRoles.data[i].id).checked };
                  mutation.mutateAsync(newValue);
              }
          }        
          await setcontendID("");
          setOpen(false);        
          await setcontendID(contentValue);
      } catch (e) {
          console.log(e);
      }      
  };

    const AddContentBox = () => {
        if (dataRoles) {
            return dataRoles.data.map(element => (
                <div>
                    <FormControlLabel control={<Checkbox id={element.id} defaultChecked={element.status} />}
                        label={element.name} />
                </div>
            ))
        } 
    };

    //Filter page options based on permissions
    const location = useLocation();
    const currentPath = location.pathname.replace(/\//g, "", "");
    const showCreate = true;
    const showUpdateAndDelete = true;

  return (
    <Card mb={6}>
      <CardContent pb={1}>
        <Grid container spacing={12}>
            <Grid item md={12}>
                <Typography variant="h4" gutterBottom display="inline" style={{ fontWeight: 600 }}>
                Content - Our Impact
                </Typography>
            </Grid>
        </Grid>
        <br />
        <Grid container spacing={6}>
          <Grid item md={4}>
            <Button
                mr={2}
                variant="contained"
                onClick={() => navigate("/MISAdministration/content-impact-create")}
                style={{ display: showCreate ? "inline-flex" : "none" }}
            >
                Add New Content
            </Button>
          </Grid>
          <Grid item md={4}>
            <Button variant="outlined" color="primary" mt={3}
                onClick={() => navigate("/MISAdministration/content-registry")}>
                Cancel
            </Button>
          </Grid>
        </Grid>

      </CardContent>

      <Paper>
        <div style={{ height: 650, width: "100%" }}>
          <DataGrid  rowHeight={150}
            columns={[
              {
                field: "title",
                headerName: "Title",
                editable: false,
                flex: 1,
              },
              {
                field: "description",
                headerName: "Description",
                editable: false,
                flex: 1,
              },
                {
                    field: "image",
                    headerName: "Image",
                    editable: false,
                    flex: 1,
                    width: 200,
                    renderCell: (params) => {
                        return (
                            <>
                                <Avatar sx={{ width: 130, height: 130 }} variant="square" src={params.value} />
                            </>
                        );
                    }
                },
                  {
                        field: "action",
                        headerName: "Permissions",
                        sortable: false,
                        editable: false,
                        flex: 1,
                        renderCell: (params) => {
                            return (
                                <>
                                    <Button 
                                        startIcon={<ShieldIcon />}
                                        size="small"
                                        onClick={() => handleClickOpen(params.id)}></Button>
                                </>
                            );
                        }
                    },

            ]}
            rows={isLoading || isError ? [] : data ? data.data : []}
            loading={isLoading}
          />
        </div>
          </Paper>

          <div>
              <Dialog open={open} onClose={handleClose}>
                  <DialogTitle>Assign Permissions</DialogTitle>
                  <DialogContent>
                      <DialogContentText>
                          <FormGroup>
                              {AddContentBox()}
                          </FormGroup>
                      </DialogContentText>
                  </DialogContent>
                    <br />
                    <Button variant="contained" onClick={handleCloseSave} style={{ display: showUpdateAndDelete ? "inline-flex" : "none" }}>Save</Button>
                    <br />
                    <Button onClick={handleClose}>Cancel</Button>
                      

              </Dialog>
          </div>


      </Card>



  )
};
export default CMSContentImpactList;