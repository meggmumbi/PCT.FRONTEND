import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { Box } from "@mui/system";
import Grid from "@mui/material/Grid";
import {
  Button,
  InputLabel,
  TextField,
  Typography,
  Card,
  Divider,
  ListItemText,
  List,
  ListItem,
  ListItemIcon, Accordion, AccordionSummary, Switch, AccordionDetails, CardContent,
} from "@mui/material";
import ReplyIcon from "@mui/icons-material/Reply";
import { useMutation, useQuery } from "@tanstack/react-query";
import UploadIcon from "@mui/icons-material/Upload";
import { useFormik } from "formik";
import * as Yup from "yup";
import Checkbox from "@mui/material/Checkbox";
import {
  getAllApplicationsWithModules, getTenant,
  newTenant, updateTenant,
} from "../../apis/mis-administration";
import { toast } from "react-toastify";
import {useNavigate, useParams} from "react-router-dom";
import _ from "lodash";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Avatar from "@mui/material/Avatar";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#fff" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  minHeight: "20rem",
}));

function customizer(value) {
  console.log( "valuesvaluesvaluesvalues --->sss1tempclonevaluedddd ",value)
  value.isActive = false;
  return value;
}

const label = { inputProps: { "aria-label": "Switch demo" } };

function Tenant(props) {
  const navigate = useNavigate();
  const [selectedValues, setSelectedValues] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [search, setSearch] = React.useState("");
  const[apps,setApps] = useState([])
  let { id } = useParams();
  let { id:urlId } = useParams();
  const { isLoading, isError, data } = useQuery(
      ["getAllApplicationsWithModules"],
      getAllApplicationsWithModules,
      {
        onSuccess: (response) => {
          _.remove(response.data, {applicationName: "PCT Core"})
          let temp =JSON.parse(JSON.stringify(response.data), (key, value) => {
            if (key==='isActive') {
              return false;
            } else if(["permissions","moduleTenants","applicationTenant"].includes(key)){
              //ignore keys
            }
            else {
              return value;
            }
          })
          setApps(temp)
        }
      }
  );


  const mutation = useMutation({ mutationFn: newTenant });
  const updateMutation = useMutation({ mutationFn: updateTenant });
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      applicationTenant: [],
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Required"),
      description: Yup.string().required("Required")
    }),
    onSubmit: async (values) => {
      try {
        let temp = [];

        apps.map(app =>{
          if(app.isActive || _.some(app.modules,{isActive:true})){
            temp.push({
              applicationId: app.id,
              isActive: app.isActive,
              modules: _.map(app.modules, ({id,isActive}) => ({moduleId: id,isActive:isActive}))
            })
          }
        })
        values.applicationTenant = temp;

        if(id !== undefined){
          values.id = id;
          await updateMutation.mutateAsync(values);
        }else{
          await mutation.mutateAsync(values);
        }

        navigate("/MISAdministration/tenants");
        toast.success(`Successfully saved tenant`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } catch (e) {
        toast.error("Error adding tenant", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    },
  });

  const { refetch } = useQuery(
      ['getTenant', id],
      getTenant,
      {
        enabled: !!id && data !=undefined && Boolean(data.data) && apps.length > 0,
        onSuccess: (response) => {
          response.data.applicationTenant.map(app =>{
            _.find(apps,{id:app.applicationId}).isActive = app.isActive
            app.modules.map(child =>{
              try{
                _(apps)
                    .thru(function(app) {
                      return _.union(app, _.map(app, 'modules') || []);
                    })
                    .flatten()
                    .find({ id: child.moduleId}).isActive = child.isActive
              }catch (e) {
                console.log(e)
              }
            })
          })
          setApps(apps)
          formik.setValues({
            name: response.data.name,
            description: response.data.description,
            applicationTenant: response.data.applicationTenant
          })
        },
      }
  );



  const handleToggle = (value,status,type) => () => {
    switch (type) {
      case "app":
        _.find(apps,{id:value}).isActive = !status
        break;
      case "module":
        _(apps)
            .thru(function(app) {
              return _.union(app, _.map(app, 'modules') || []);
            })
            .flatten()
            .find({ id: value}).isActive = !status
    }
    setSelectedItem(value+status)
  };


  // Filter the data based on the search term
  const filteredData = React.useMemo(() => {
    if (!data || !data.data || !apps || !apps) return [];
    return (
        !isLoading &&
        !isError &&
        apps.filter((elem) =>
            elem.applicationName.toLowerCase().includes(search.toLowerCase())
        )
    );
  }, [apps, search]);

  const handleChangesQuery = (event) => {
    setSearch(event.target.value);
  };
  return (
      <Box>
        <Box>
          <Paper square={true} sx={{ borderTop: 5 }} elevation={8}>
            <Card mb={6} square={true} sx={{ py: 5, pl: 2 }}>
              <Grid container spacing={12}>
                <Grid item md={12} sx>
                  <Typography
                      variant="h1"
                      gutterBottom
                      display="inline"
                      sx={{ fontSize: "2rem" }}
                  >
                    Tenant Details
                  </Typography>
                  <Typography variant="caption" display="block" gutterBottom>
                    Enter tenant details below
                  </Typography>
                </Grid>
              </Grid>
            </Card>
            <Divider />
          </Paper>
        </Box>

        <form onSubmit={formik.handleSubmit}>
          <Item elevation={3}>
            <Grid container spacing={1} sx={{ padding: "10px", display: "flex" }}>
              <Grid item xs={12} sm={6}>
                <Item elevation={3}>
                  <Grid
                      container
                      spacing={3}
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                  >
                    <Grid
                        item
                        xs={12}
                        sm={12}
                        sx={{ justifyContent: "left", alignItems: "center" }}
                    >
                      <InputLabel
                          sx={{
                            marginRight: "10px",
                            display: "flex",
                            justifyContent: "left",
                            alignItems: "center",
                            fontWeight: 700,
                            width: "10rem",
                            fontSize: "1rem",
                            color: "#000",
                          }}
                      >
                        Name
                      </InputLabel>
                      <TextField
                          required
                          id="name"
                          label="Name"
                          fullWidth
                          value={formik.values.name}
                          error={Boolean(formik.touched.name && formik.errors.name)}
                          helperText={formik.touched.name && formik.errors.name}
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          sx={{
                            "& legend": { display: "none" },
                            "& .MuiInputLabel-shrink": {
                              opacity: 0,
                              transition: "all 0.2s ease-in",
                            },
                            marginTop: 2,
                          }}
                      />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sm={12}
                        sx={{ justifyContent: "left", alignItems: "center" }}
                    >
                      <InputLabel
                          sx={{
                            marginRight: "10px",
                            display: "flex",
                            justifyContent: "left",
                            alignItems: "center",
                            fontWeight: 700,
                            width: "10rem",
                            fontSize: "1rem",
                            color: "#000",
                          }}
                      >
                        Description
                      </InputLabel>
                      <TextField
                          id="description"
                          label="Description"
                          fullWidth
                          multiline={true}
                          rows={5}
                          value={formik.values.description}
                          onChange={formik.handleChange}
                          error={Boolean(
                              formik.touched.description && formik.errors.description
                          )}
                          helperText={
                              formik.touched.description && formik.errors.description
                          }
                          onBlur={formik.handleBlur}
                          sx={{
                            "& legend": { display: "none" },
                            "& .MuiInputLabel-shrink": {
                              opacity: 0,
                              transition: "all 0.2s ease-in",
                            },
                            marginTop: 2,
                          }}
                      />
                    </Grid>
                    <Grid item md={12} sx>
                      <Grid container rowSpacing={2}>
                        <Grid item md={12} sx={{marginTop:3}}>
                          <Typography variant="body2" gutterBottom display="inline" sx={{color: '#000', fontSize: '1rem' }}>
                            Select the apps and modules for this tenant
                          </Typography>
                        </Grid>
                        <Grid item md={12} sx={{ display: 'flex', justifyContent: "center", alignItems: 'center' }}>
                          <TextField
                              variant="outlined"
                              id="app-search-box"
                              sx={{
                                m: 1, width: '50ch',
                                '& legend': { display: 'none' },
                                '& .MuiInputLabel-shrink': { opacity: 0, transition: "all 0.2s ease-in" }

                              }}

                              placeholder="Search Application"
                              InputProps={{
                                startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                                style: {
                                  borderRadius: "0.75rem",
                                }
                              }}
                              onChange={handleChangesQuery}
                          />
                        </Grid>
                        <Grid item md={12}>
                          <Paper style={{ height: '60vh', border: '1px solid #eaeaea', overflow: 'auto', padding: '5' }} p={5}>
                            <Card sx={{ minHeight: '50vh', p: 1 }}>

                              {!isLoading && !isError
                                  ? filteredData.map((application) => (
                                      <>
                                        <Accordion>
                                          <Grid
                                              container
                                              direction="row"
                                              justifyContent="space-evenly"
                                              alignItems="center"
                                          >
                                            <Grid item xs={11}>
                                              <AccordionSummary
                                                  aria-controls="panel1-content"
                                                  id="panel1-header"
                                              >
                                                <Avatar sx={{ bgcolor: "#185c37" }} variant="square" aria-label="recipe">
                                                  {application.applicationName.charAt(0)}
                                                </Avatar>
                                                <Grid
                                                    container
                                                    direction="column"
                                                    justifyContent="center"
                                                    alignItems="flex-start"
                                                    pl={5}
                                                >
                                                  <Typography variant="h1" gutterBottom display="inline" sx={{ fontSize: '1rem' }}>
                                                    {application.applicationName}
                                                  </Typography>
                                                  <Typography variant="caption" display="block" gutterBottom>
                                                    Click to view app details and enable/disable modules
                                                  </Typography>
                                                </Grid>
                                              </AccordionSummary>
                                            </Grid>
                                            <Grid item xs={1}>
                                              <Switch
                                                  name="isActive"
                                                  value={application.isActive}
                                                  checked={application.isActive}
                                                  onChange={handleToggle(application.id,application.isActive,'app')}

                                                  {...label}
                                              />
                                            </Grid>
                                          </Grid>


                                          <AccordionDetails>
                                            <CardContent>
                                              <Grid container spacing={2}>
                                                <Grid item md={12}>
                                                  <Typography variant="h5" gutterBottom>
                                                    Description
                                                  </Typography>
                                                </Grid>
                                                <Grid item md={12}>
                                                  <Typography variant="body2" gutterBottom sx={{ p:2, color: '#797979', fontSize: '1rem' }}>
                                                    {application.description}
                                                  </Typography>
                                                  <Divider />
                                                </Grid>

                                                <Grid item md={12}>
                                                  <Typography variant="h5" gutterBottom sx={{ p:2}}>
                                                    Version:  {application.version}
                                                  </Typography>
                                                  <Divider />
                                                </Grid>
                                                <Grid item md={12}>
                                                  <Typography variant="h5" gutterBottom sx={{ p:2}}>
                                                    Modules
                                                  </Typography>
                                                </Grid>

                                                <React.Fragment>
                                                  {application.modules.map((module) => (
                                                      <React.Fragment key={module.id}>
                                                        <Grid item md={12}>
                                                          <Divider />
                                                        </Grid>
                                                        <Grid item md={6}>
                                                          <Typography variant="h5" gutterBottom sx={{ color: '#797979', fontSize: '1rem' }}>
                                                            {module.moduleName}
                                                          </Typography>
                                                        </Grid>
                                                        <Grid item md={6}>
                                                          <Box display="flex" justifyContent="flex-end">
                                                            <Switch
                                                                name={module.moduleName}
                                                                value={module.isActive}
                                                                checked={module.isActive}
                                                                onClick={handleToggle(module.id,module.isActive,'module')}

                                                                {...label}
                                                            />
                                                          </Box>
                                                        </Grid>
                                                      </React.Fragment>
                                                  ))}

                                                </React.Fragment>
                                              </Grid>
                                            </CardContent>
                                          </AccordionDetails>
                                        </Accordion>
                                        <Divider />
                                      </>
                                  ))
                                  : ""}


                            </Card>
                          </Paper>
                        </Grid>

                      </Grid>

                    </Grid>
                    <Grid item xl={12} xs={12} md={12}>
                      <Grid container spacing={2} p={6}>
                        <Grid item xs={6} md={6}>
                          <Button
                              variant="contained"
                              sx={{
                                fontSize: "14px",
                                fontWeight: "bolder",
                                backgroundColor: "#333333",
                              }}
                              startIcon={<ReplyIcon />}
                              onClick={() =>navigate(
                                  `/MISAdministration/tenants`
                              )}
                          >
                            Back
                          </Button>
                        </Grid>
                        <Grid
                            item
                            xs={6}
                            md={6}
                            sx={{ display: "flex", justifyContent: "right" }}
                        >
                          <Button
                              variant="contained"
                              sx={{
                                fontSize: "14px",
                                fontWeight: "bolder",
                                backgroundColor: "#333333",
                                "&:hover": {
                                  background: "#E19133",
                                  color: "white",
                                },
                              }}
                              startIcon={<UploadIcon />}
                              type="submit"
                          >
                            Submit
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Item>
              </Grid>

              <Grid item xs={12} sm={6}></Grid>
            </Grid>
          </Item>
        </form>
      </Box>
  );
}

export default Tenant;
