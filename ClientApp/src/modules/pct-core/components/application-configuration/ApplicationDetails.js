import React, {useRef, useState} from "react";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Card,
  Typography,
  Paper,
  Grid,
  CardContent,
  CardHeader,
  Button,
  Divider,
  Switch,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { red } from "@mui/material/colors";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  changeModuleStatus, changeStatus,
  getApplication,
  getApplicationModules,
} from "../../apis/mis-administration";
import { Add as AddIcon } from "@mui/icons-material";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import ApplicationHeaderBar from './ApplicationHeaderBar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import SvgIcon from '@mui/material/SvgIcon';
import _ from "lodash";

const label = { inputProps: { "aria-label": "Switch demo" } };

const ApplicationDetails = () => {
  const indexRef = useRef();
  let { id } = useParams();
  const [appDialog, setAppDialog] = useState(false);
  const [disable, setDisable] = useState(false);
  const [enable, setEnable] = useState(false);
  const [enableAll, setEnableAll] = useState(false);
  const [disableAll, setDisableAll] = useState(false);
  const [moduleId, setModuleId] = useState();
  const [appDetails,setAppDetails] = useState(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    isLoading,
    isError,
    data: applicationData,
  } = useQuery(
      ["getApplication", id],
      getApplication, 
      { 
        enabled: !!id,
        onSuccess:(response) => {
          setAppDetails(response.data)
        }
      });

  const mutation = useMutation({ mutationFn: changeModuleStatus });
  const appMutation = useMutation({ mutationFn: changeStatus });

  const handleEnableDialog = (inputModuleId) => {
    setEnable(true);
    setModuleId(inputModuleId);
  };
  const handleDisableDialog = (inputModuleId) => {
    setDisable(true);
    setModuleId(inputModuleId);
  };

  const handleEnableAllDialog = (inputModuleId) => {
    setEnableAll(true);
  };
  const handleDisableAllDialog = () => {
    setDisableAll(true);
  };

  const appStatusSwitch = async () => {
    await appMutation.mutateAsync({ id: id, status: !appDetails.isActive });
    appDetails.isActive = !appDetails.isActive
    setAppDialog(false);
  };


  const disableModule = async () => {
    await mutation.mutateAsync({ moduleId: moduleId, status: false });
    setDisable(false);
    _.find(appDetails.modules,{id:moduleId}).isActive = false;
  };

  const enableModule = async () => {
    await mutation.mutateAsync({ moduleId: moduleId, status: true });
    _.find(appDetails.modules,{id:moduleId}).isActive = true;
    setEnable(false);
  };

  const disableAllModules = async () => {
    appDetails.modules.map(async module => {
      mutation.mutateAsync({ moduleId: module.id, status: false });
      _.find(appDetails.modules,{id:module.id}).isActive = false;
    })
    setDisableAll(false);
  };

  const enableAllModules = async () => {
    appDetails.modules.map(async module => {
        mutation.mutateAsync({ moduleId: module.id, status: true });
      _.find(appDetails.modules,{id:module.id}).isActive = true;
    })
    setEnableAll(false);
  };
  



  return (
    <React.Fragment>
      <Helmet title="Application Details" />
      <ApplicationHeaderBar />

      {!isLoading && !isError && appDetails!= null ? (
        <React.Fragment>
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="flex-start"
            sx={{ backgroundColor: '#fff', minHeight: '70vh' }}
            p={3}
          >
            <Grid item xs={12}>
              <Card mb={6} square={true} sx={{ border: '0.1rem solid #d6d6d6', borderRadius: 2, minHeight: '65vh' }}>
                <CardHeader
                  avatar={
                    <Grid
                      container
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <SvgIcon viewBox="-5 0 35 20" sx={{ transform: 'rotate(90deg)', width: '40px', height: '30px', cursor: 'pointer' }} onClick={() =>
                        navigate(
                          `/MISAdministration/application-configuration`
                        )}>
                        <path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z" />
                      </SvgIcon>

                      <Avatar sx={{ bgcolor: "#185c37" }} variant="square" aria-label="recipe">
                        {appDetails.applicationName.charAt(0)}
                      </Avatar>
                      <ArrowBackIcon viewBox="0 0 500 500" />
                    </Grid>
                  }
                  title={appDetails.applicationName}
                  action={
                    <Switch
                      name="isActive"
                      value={appDetails.isActive}
                      checked={appDetails.isActive}
                      onChange={(event, checked) => {setAppDialog(true)}}
                      {...label}
                    />
                  }
                />

                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item md={12}>
                      <Typography variant="h5" gutterBottom>
                        Descriptions
                      </Typography>
                    </Grid>
                    <Grid item md={12}>
                      <Typography variant="body2" gutterBottom sx={{ color: '#797979', fontSize: '1rem' }}>
                        {appDetails.description}
                      </Typography>
                      <Divider />
                    </Grid>

                    <Grid item md={12}>
                      <Typography variant="h5" gutterBottom>
                        Version
                      </Typography>
                    </Grid>
                    <Grid item md={12}>
                      <Typography variant="body2" gutterBottom sx={{ color: '#797979', fontSize: '1rem' }}>
                        Application ID: {appDetails.version}
                      </Typography>
                      <Divider />
                    </Grid>

                    <Grid item md={12}>
                      <Typography variant="h5" gutterBottom >
                        Module Configurations
                      </Typography>
                    </Grid>
                    <Grid item md={12}>
                      <Typography variant="body2" gutterBottom sx={{ color: '#797979', fontSize: '1rem' }}>
                        {appDetails.description}
                      </Typography>
                    </Grid>
                    <Grid item md={12}>
                      <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography variant="body2" gutterBottom sx={{ color: '#797979', fontSize: '1rem' }}>
                          Enable All
                        </Typography>
                        <Switch
                          name="isActive"
                          value={_.every(appDetails.modules,{isActive:true})}
                          checked={_.every(appDetails.modules,{isActive:true})}
                          onChange={(event, checked) => {
                            checked
                              ? handleEnableAllDialog()
                              : handleDisableAllDialog();
                          }}
                          {...label}
                        />

                      </Grid>

                      <Divider />
                    </Grid>

                    {!isLoading && !isError ? (
                      <React.Fragment>
                        {appDetails.modules.map((res, index) => (
                          <React.Fragment key={index}>
                            <Grid item md={6}>
                              <Typography variant="h5" gutterBottom sx={{ color: '#797979', fontSize: '1rem' }}>
                                {res.moduleName}
                              </Typography>
                            </Grid>
                            <Grid item md={6}>
                              <Box display="flex" justifyContent="flex-end">
                                <Switch
                                  name="isActive"
                                  value={res.isActive}
                                  checked={res.isActive}
                                  onChange={(event, checked) => {
                                    checked
                                      ? handleEnableDialog(res.id)
                                      : handleDisableDialog(res.id);
                                  }}
                                  {...label}
                                />
                              </Box>
                            </Grid>
                          </React.Fragment>
                        ))}
                      </React.Fragment>
                    ) : (
                      <React.Fragment>No Module Configured</React.Fragment>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </React.Fragment>
      ) : (
        <React.Fragment>Application Details Cannot Be Retrieved</React.Fragment>
      )}

      <Dialog
          open={appDialog}
          onClose={()=>setAppDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{appDetails!=null && appDetails.isActive?'Disable Application?':'Enable Application?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to {appDetails!=null && appDetails.isActive?'disable':'enable'} this application?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setAppDialog(false)}>Cancel</Button>
          <Button onClick={appStatusSwitch} autoFocus>
             {appDetails!=null && appDetails.isActive?'Disable':'Enable'}
          </Button>
        </DialogActions>
      </Dialog>
















      <Dialog
        open={disable}
        onClose={()=>setDisable(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Disable Module?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to disable this module?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setDisable(false)}>Cancel</Button>
          <Button onClick={disableModule} autoFocus>
            Disable
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={enable}
        onClose={()=>setEnable(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Enable Module?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to enable this module?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setEnable(false)}>Cancel</Button>
          <Button onClick={enableModule} autoFocus>
            Enable
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
          open={disableAll}
          onClose={()=>setDisableAll(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Disable All Modules?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to disable all modules?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setDisableAll(false)}>Cancel</Button>
          <Button onClick={disableAllModules} autoFocus>
            Disable
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
          open={enableAll}
          onClose={()=>setEnableAll(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Enable All Modules?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to enable all modules?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setEnableAll(false)}>Cancel</Button>
          <Button onClick={enableAllModules} autoFocus>
            Enable
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
export default ApplicationDetails;
