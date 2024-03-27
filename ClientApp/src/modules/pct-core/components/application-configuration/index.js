import React from "react";
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
  Switch,
  TextField,
  debounce,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { Add as AddIcon } from "@mui/icons-material";
import { red } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { changeStatus, getApplications } from "../../apis/mis-administration";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import ApplicationHeaderBar from "./ApplicationHeaderBar";
import _ from "lodash";

const label = { inputProps: { "aria-label": "Switch demo" } };

const ModuleConfiguration = () => {
  const [open, setOpen] = React.useState(false);
  const [enable, setEnable] = React.useState(false);
  const [id, setId] = React.useState();
  const [apps, setApps] = React.useState();
  const [search, setSearch] = React.useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isLoading, isError, data } = useQuery(
    ["getApplications"],
    getApplications,
      {
        onSuccess:(response) => {
          _.remove(response.data,{applicationName:"PCT Core"})
        }
      }
  );

  // Filter the data based on the search term
  const filteredData = React.useMemo(() => {
    if (!data || !data.data) return [];
    return (
      !isLoading &&
      !isError &&
      data.data.filter((elem) =>
        elem.applicationName.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [data, search]);

  const mutation = useMutation({ mutationFn: changeStatus });

  const handleDisableDialog = (id, isActive) => {
    setOpen(true);
    setId(id);
  };
  const handleDisableCancel = () => {
    setOpen(false);
  };
  const handleEnableCancel = () => {
    setEnable(false);
  };
  const handleEnableDialog = (id, isActive) => {
    setEnable(true);
    setId(id);
  };

  const disableApplication = async () => {
    await mutation.mutateAsync({ id: id, status: false });
    setOpen(false);
    await queryClient.invalidateQueries(["getApplications"]);
  };

  const enableApplication = async () => {
    await mutation.mutateAsync({ id: id, status: true });
    setEnable(false);
    await queryClient.invalidateQueries(["getApplications"]);
  };

  const handleChangesQuery = (event) => {
    setSearch(event.target.value);
  };

  return (
    <React.Fragment>
      <ApplicationHeaderBar />
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        py={2}
        sx={{ backgroundColor: "#fff" }}
      >
        <Grid item>
          <TextField
            variant="outlined"
            id="app-search-box"
            sx={{
              m: 1,
              width: "50ch",
              "& legend": { display: "none" },
              "& .MuiInputLabel-shrink": {
                opacity: 0,
                transition: "all 0.2s ease-in",
              },
            }}
            placeholder="Search Application"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              style: {
                borderRadius: "0.75rem",
              },
            }}
            onChange={handleChangesQuery}
          />
        </Grid>
      </Grid>

      <Grid
        container
        rowSpacing={2}
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
        py={5}
        px={2}
        sx={{ backgroundColor: "#fff" }}
      >
        {!isLoading && !isError ? (
          filteredData.map((elem) => (
            <Grid item xs={6} md={4} lg={4} key={elem.id} p={1}>
              <Card
                mb={6}
                square={true}
                sx={{ border: "0.1rem solid #eaeaea", borderRadius: 2 }}
              >
                <CardHeader
                  avatar={
                    <Avatar
                      sx={{ bgcolor: "#185c37" }}
                      variant="square"
                      aria-label="recipe"
                    >
                      {elem.applicationName.charAt(0)}
                    </Avatar>
                  }
                  title={
                    <Typography
                      variant="h5"
                      sx={{ color: "#333333", fontWeight: "bold" }}
                    >
                      {elem.applicationName}
                    </Typography>
                  }
                  action={
                    <Typography
                      variant="h5"
                      sx={{ color: "#333333", fontWeight: "bold" }}
                    >
                      Version: {elem.version}
                    </Typography>
                  }
                  titleTypographyProps={{ variant: "h5" }}
                />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item md={12}>
                      <Typography
                        variant="body2"
                        gutterBottom
                        sx={{ color: "#797979" }}
                      >
                        {elem.description}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      md={12}
                      sx={{ color: "#797979", fontSize: "1rem" }}
                    >
                      Application ID: {elem.version}
                    </Grid>
                    <Grid item md={8}>
                      <Button
                        variant="outlined"
                        onClick={() =>
                          navigate(
                            `/MISAdministration/application-details/${elem.id}`
                          )
                        }
                        sx={{
                          borderRadius: "1rem",
                          color: "#333333",
                          borderColor: "#333333",
                        }}
                      >
                        Details
                      </Button>
                    </Grid>
                    <Grid item md={4}>
                      <Box display="flex" justifyContent="flex-end" pt={2}>
                        <Switch
                          name="isActive"
                          value={elem.isActive}
                          checked={elem.isActive}
                          onChange={(event, checked) => {
                            checked
                              ? handleEnableDialog(elem.id, elem.isActive)
                              : handleDisableDialog(elem.id, elem.isActive);
                          }}
                          {...label}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <React.Fragment>No Applications Configured</React.Fragment>
        )}
        <Dialog
          open={open}
          onClose={handleDisableCancel}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Remove Application?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to disable this application?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDisableCancel}>Cancel</Button>
            <Button onClick={disableApplication} autoFocus>
              Disable
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={enable}
          onClose={handleEnableCancel}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Enable Application?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to enable this application?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEnableCancel}>Cancel</Button>
            <Button onClick={enableApplication} autoFocus>
              Enable
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </React.Fragment>
  );
};
export default ModuleConfiguration;
