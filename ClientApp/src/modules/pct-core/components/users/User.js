import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { Box } from "@mui/system";
import Grid from "@mui/material/Grid";
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  TextField,
  Typography,
  FormLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormGroup,
  label, OutlinedInput
} from "@mui/material";
import ReplyIcon from "@mui/icons-material/Reply";
import MenuItem from "@mui/material/MenuItem";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createTheme, ThemeProvider, useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { getAllSites, getUser, saveRole, saveUser, updateRole } from "../../apis/mis-endpoints";
import BasicAccordion from "./Accordion";
import _ from "lodash";
import { toast } from "react-toastify";
import UploadIcon from "@mui/icons-material/Upload";
import { keycloakInstance } from "../../../../authConfig";
import {
  newicl_user,
  newicl_user_keycloak,
  sendpassicl_user_keycloak,
} from "../../apis/icl_user";
import { useNavigate, useParams } from "react-router-dom";
import { getAllApplicationsWithModules } from "../../apis/mis-administration";
import { getOrganizations } from "../../apis/organization";
import { useFormik } from "formik";
import * as Yup from "yup";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#fff" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,

  boxShadow:
    "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px !important",
}));


function User(props) {
  const navigate = useNavigate();
  const [temp, setTemp] = useState("");
  const [sites, setSites] = useState([]);
  const [selectedSites, setSelectedSites] = useState([]);
  const [selectedSitesRole, setSelectedSitesRole] = useState([]);
  const [expanded, setExpanded] = React.useState(true);
  const [selectedSite, setSelectedSite] = useState(null);
  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));
  let { id: urlId } = useParams();
  const [user, setUser] = useState({
    firstName: null,
    lastName: null,
    otherNames: null,
    organization: null,
    phone: null,
    email: null,
    userRoles: null,
    isAdmin: false
  });

  const { isLoading: orgIsLoading, isError: orgIsError, data: organisations } = useQuery(["getOrganizations"], getOrganizations);
  const { refetch, isLoading: userIsLoading, isError: userIsError } = useQuery(["getUser", urlId], getUser,
    {
      enabled: !!urlId,
      onSuccess: (response) => {
        //Replace to only update values needed
        formik.setValues({
          id: response.data.id,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          otherNames: response.data.otherNames,
          organization: response.data.organization,
          phone: response.data.phone,
          email: response.data.email,
          userRoles: response.data.userRoles.map(r => ({ roleId: r.roleId, tenantId: r.role.tenantId })),
          isAdmin: response.data.isAdmin
        });
      }
    }
  );


  const { isLoading, isError } = useQuery(["getAllSitesList"], getAllSites, {
    onSuccess: (response) => {
      let temp = [];
      response.data.forEach((i) => {
        temp.push({
          id: i.id,
          name: i.name,
          parent_id: null,
        });
      });
      setSites(temp);
    },
  });

  React.useEffect(() => {
    if (!!urlId && !isLoading && !isError && !userIsLoading && sites.length > 0) {
      const sitesItems = formik.values.userRoles.filter((item) =>
        sites.some((site) => site.id === item.tenantId)
      );

      const uniqueSiteItems = sitesItems.reduce((acc, curr) => {
        const found = acc.some(
          (item) =>
            item.tenantId === curr.tenantId && item.roleId === curr.roleId
        );
        if (!found) {
          acc.push({ tenantId: curr.tenantId, roleId: curr.roleId });
        }
        return acc;
      }, []);
      const sitesItemsIds = [
        ...new Set(uniqueSiteItems.map((item) => item.tenantId)),
      ];

      setSelectedSitesRole(uniqueSiteItems);
      updateUserSites(sitesItemsIds);

      let userRoles = [];
      formik.values.userRoles.forEach((itemRole) => {
        let temp = [];
        temp.push({
          roleId: itemRole.roleId,
          tenantId: itemRole.tenantId,
          locationId: itemRole.locationId,
        });
        userRoles.push({
          roleId: itemRole.roleId,
          tenantId: itemRole.tenantId,
          locationId: itemRole.locationId,
        });
        updateUserRoles(temp, itemRole.tenantId);
      });

      setUser({
        id: formik.values.id,
        firstName: formik.values.firstName,
        lastName: formik.values.lastName,
        otherNames: formik.values.otherNames,
        organization: formik.values.organization,
        phone: formik.values.phone,
        email: formik.values.email,
        userRoles: userRoles,
        isAdmin: formik.values.isAdmin
      });
    }
  }, [sites, !isLoading, !isError, !userIsLoading]);

  const handleChange = (e) => {
    e.preventDefault();
    formik.setFieldValue(e.target.name, e.target.value === "" ? null : e.target.value);
  };



  const updateUserSites = (items) => {
    _.difference(_.uniq(_.map(user.userRoles, "tenantId")), items).map(
      (diff) => {
        _.remove(user.userRoles, (role) => role.tenantId === diff);
      }
    );

    setSelectedSites(items.length === 0 ? [] : items);
    setTemp(items.length);
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const mutation = useMutation({
    mutationFn: saveUser,
    onError: (error, variables, context) => {
      // An error happened!
      toast.error("Error occurred while saving user", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    },
    onSuccess: (data, variables, context) => {
      toast.success("User saved successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      props.pageSwitch("list");
    },
  });
  const popError = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 10000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };


  const handleCheckboxChange = (event) => {
    const siteId = event.target.value;
    setSelectedSite(siteId);
    if (selectedSites.includes(siteId)) {
      setSelectedSites(selectedSites.filter((id) => id !== siteId));
    } else {
      setSelectedSites([...selectedSites, siteId]);
    }
  };


  const handleRadioChange = (event) => {
    const roleId = event.target.value;
    const siteId = selectedSite;
    const role = { tenantId: siteId, roleId: roleId };
    setSelectedSitesRole(selectedSitesRole.filter((r) => r.tenantId !== siteId));
    setSelectedSitesRole([...selectedSitesRole, role]);
    updateUserRoles([role], siteId);
  };





  const createUserMutation = useMutation({ mutationFn: saveUser });
  const updateUserMutation = useMutation({ mutationFn: saveUser });
  const formik = useFormik({
    initialValues: {
      firstName: null,
      lastName: null,
      otherNames: null,
      organization: "",
      phone: null,
      email: null,
      userRoles: [],
      isAdmin: false
    },
    validationSchema: Yup.object().shape({
      firstName: Yup.string().required("Required"),
      lastName: Yup.string().required("Required"),
      /*      organization: Yup.string().required("Required"),
            phone: Yup.string().required("Required"),
            email: Yup.string().required("Required")*/
    }),
    onSubmit: async (values) => {
      try {
        if (urlId !== undefined) { //update
          await updateUserMutation.mutateAsync(values);
          navigate("/MISAdministration/users");
        } else {//create
          try {
            const response = await newicl_user_keycloak({
              token: keycloakInstance.token,
              selectedUser: {
                email: values.email,
                fullName:
                  values.firstName + " " + values.otherNames + " " + values.lastName,
              },
            }).then(async (res) => {
              if (res.status === 200) {
                await createUserMutation.mutateAsync(values);
                toast.error(`User created successfully`, {
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                });
                navigate("/MISAdministration/users");
              } else if (res.status === 409) {
                await createUserMutation.mutateAsync(values);
                toast.error(`User exists and was updated successfully`, {
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                });
                navigate("/MISAdministration/users");
              } else {
                toast.error(`Error adding user ${res.statusText}`, {
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                });
              }
            }).catch((e) => {
              toast.error(`Error adding user`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              });
              console.log("error", JSON.stringify(e))
            })
            console.log("response response response ", response)
          } catch (e) {
            console.log("create user error", e)
          }
        }
      } catch (e) {
        console.log(e)
        toast.error("Error adding user", {
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


  const updateUserRoles = (role, tenantId) => {
    let temp = formik.values.userRoles;
    _.remove(temp, (role) => role.tenantId === tenantId);
    role.map(r => temp.push({ roleId: r.roleId, tenantId: r.tenantId }))
    formik.setFieldValue("userRoles", temp);
  };

  const handleSiteCheckboxChange = (event) => {
    const siteId = event.target.value;
    if (!event.target.checked) {
      const updatedSites = selectedSites.filter((id) => id !== siteId);
      setSelectedSites(updatedSites);
      let temp = formik.values.userRoles;
      _.remove(temp, (role) => role.tenantId === event.target.value);
      formik.setFieldValue("userRoles", temp);
    } else {
      if (selectedSites.includes(siteId)) {

        const updatedSites = selectedSites.filter((id) => id !== siteId);
        setSelectedSites(updatedSites);
      } else {

        setSelectedSites([...selectedSites, siteId]);
      }
    }
  };


  return (
    <Grid container alignItems="stretch">
      <form onSubmit={formik.handleSubmit}>
        <Grid item md={12} style={{ display: "flex", width: "100%" }}>
          <Paper
            square={true}
            sx={{
              borderTop: 5,
              borderColor: "#000000",
              width: "100%",
              px: 3,
              py: 5,
            }}
            elevation={8}
          >
            <Grid
              item
              xs={12}
              md={6}
              sm={6}
              sx={{ padding: "10px", textAlign: "left" }}
            >
              <Typography
                gutterBottom
                sx={{ fontSize: "2.5rem", fontWeight: "bold" }}
              >
                {!!urlId ? "Update User" : "Add User"}
              </Typography>
            </Grid>
            <Box>
              <Grid
                container
                spacing={5}
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-start"
              >
                <Grid
                  item
                  sm={6}
                >
                  <FormControl sx={{ m: 1, width: "100%", marginBottom: "20px" }} size="medium">
                    <FormLabel
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
                      First Name *
                    </FormLabel>
                    <TextField
                      required
                      name="firstName"
                      id="firstName"
                      fullWidth
                      value={formik.values.firstName}
                      error={Boolean(formik.touched.firstName && formik.errors.firstName)}
                      helperText={formik.touched.firstName && formik.errors.firstName}
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
                  </FormControl>
                </Grid>
                <Grid
                  item
                  sm={6}
                >
                  <FormControl sx={{ m: 1, width: "100%", marginBottom: "20px" }} size="medium">
                    <FormLabel
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
                      Last Name *
                    </FormLabel>
                    <TextField
                      required
                      name="lastName"
                      id="lastName"
                      fullWidth
                      value={formik.values.lastName}
                      error={Boolean(formik.touched.lastName && formik.errors.lastName)}
                      helperText={formik.touched.lastName && formik.errors.lastName}
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
                  </FormControl>
                </Grid>
                <Grid
                  item
                  sm={6}
                >
                  <FormControl sx={{ m: 1, width: "100%", marginBottom: "20px" }} size="medium">
                    <FormLabel
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
                      Other Name
                    </FormLabel>
                    <TextField
                      name="otherNames"
                      id="otherNames"
                      fullWidth
                      value={formik.values.otherNames}
                      error={Boolean(formik.touched.otherNames && formik.errors.otherNames)}
                      helperText={formik.touched.otherNames && formik.errors.otherNames}
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
                  </FormControl>
                </Grid>
                <Grid
                  item
                  sm={6}
                >
                  <FormControl sx={{ m: 1, width: "100%", marginBottom: "20px" }} size="medium">
                    <FormLabel
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
                      Email *
                    </FormLabel>
                    <TextField
                      required
                      name="email"
                      id="email"
                      fullWidth
                      value={formik.values.email}
                      error={Boolean(formik.touched.email && formik.errors.email)}
                      helperText={formik.touched.email && formik.errors.email}
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
                  </FormControl>
                </Grid>

                <Grid
                  item
                  sm={6}
                >

                  <FormControl sx={{ m: 1, width: "100%", marginBottom: "20px" }} size="medium">
                    <FormLabel
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
                      Organization *
                    </FormLabel>
                    {!orgIsLoading && !orgIsError && (
                      <Select
                        displayEmpty
                        name="organization"
                        labelId="organization-label"
                        id="organization"
                        value={formik.values.organization}
                        onChange={handleChange}
                        sx={{
                          "& legend": { display: "none" },
                          "& .MuiInputLabel-shrink": {
                            opacity: 0,
                            transition: "all 0.2s ease-in",
                          },
                          marginTop: 2,
                        }}

                      >
                        <MenuItem value="">
                          <em>Select Organization</em>
                        </MenuItem>
                        {organisations.data.map(org => (
                          <MenuItem value={org.organizationName} key={org.id}>{org.organizationName}</MenuItem>
                        ))}

                      </Select>
                    )}
                  </FormControl>
                </Grid>
                <Grid item sm={12}>
                  <FormGroup sx={{ m: 1, width: "100%", marginBottom: "20px" }} size="medium">
                    {sites.map((site) => (
                      <div key={site.id}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={_.map(formik.values.userRoles, 'tenantId').includes(site.id)}
                              onChange={handleSiteCheckboxChange}
                              value={site.id}
                            />
                          }
                          label={site.name}
                        />
                        {selectedSites.includes(site.id) && (
                          <BasicAccordion
                            site={site}
                            expanded={expanded}
                            handleAccordionChange={handleAccordionChange(site.id)}
                            userRoles={formik.values.userRoles}
                            updateUserRoles={updateUserRoles}
                            selectedRole={formik.values.userRoles.find((r) => r.tenantId === site.id)?.roleId || null}
                          />

                        )}
                      </div>
                    ))}
                  </FormGroup>
                </Grid>



                <Grid item xl={12} xs={12} md={12}>
                  <Grid container spacing={2} p={6}>
                    <Grid item xs={6} md={6}>
                      <Button
                        variant="contained"
                        sx={{
                          fontSize: "14px",
                          fontWeight: "bolder",
                          backgroundColor: "Black",
                        }}
                        startIcon={<ReplyIcon />}
                        onClick={() => navigate(
                          `/MISAdministration/users`
                        )}
                      >
                        CANCEL
                      </Button>
                    </Grid>
                    <Grid item xs={6} md={6}>
                      <Button
                        variant="contained"
                        sx={{
                          fontSize: "14px",
                          fontWeight: "bolder",
                          backgroundColor: "#E19133",
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


            </Box>
          </Paper>
        </Grid>
      </form>

    </Grid>
  );
}

export default User;
