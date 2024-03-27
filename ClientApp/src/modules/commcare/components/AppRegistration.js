import React, { useEffect, useContext, useState } from "react";
import styled from "@emotion/styled";
import {
  Box,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  CircularProgress,
  Grid,
  FormControl,
  FormLabel,
  InputLabel,
  Stack,
  useTheme,
  TextField as MuiTextField,
  Typography,
  Divider,
} from "@mui/material";
import { spacing } from "@mui/system";
import { ToastContainer, toast } from "react-toastify";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import useMediaQuery from "@mui/material/useMediaQuery";
import { SiteContext } from "../../../index";
import {
  postApp, getAppDetails
} from "../apis/commcare";
import Paper from "@mui/material/Paper";
import "react-toastify/dist/ReactToastify.min.css";
import UploadIcon from "@mui/icons-material/Upload";
import ReplyIcon from "@mui/icons-material/Reply";


const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#fff" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  boxShadow:
    "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px !important",
}));

const themeCustom = createTheme({
  palette: {
    custom_black: {
      main: "#000000",
      contrastText: "#FFFFFF",
    },
    custom_green: {
      main: "#23A295",
      contrastText: "#FFFFFF",
    },
  },
});

function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${year}-${month}-${date}`;
}

const AppRegistration = () => {
  const navigate = useNavigate();
  const siteContext = useContext(SiteContext);
  let { id } = useParams();
  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));

  const postMutation = useMutation({ mutationFn: postApp });

  const formik = useFormik({

    initialValues: {
      appName: "",
      description: "",
      baseUrl: "",
      domain: "",
      appId: "",
      username: "",
      password: "",
      appVersion: "",
      tenantId: siteContext.selectedSite.id,
      lastFetchDate: new Date()


    },
    validationSchema: Yup.object().shape({
      appName: Yup.string().required("Required"),
      username: Yup.string().required("Required"),
      password: Yup.string().required("Required"),
      domain: Yup.string().required("Required"),
      baseUrl: Yup.string().required("Required"),
      appId: Yup.string().required("Required"),
    }),

    onSubmit: async (values, { resetForm, setSubmitting }) => {
      console.log(values);
      try {

        if (id) {
          values.id = id;

          await postMutation.mutateAsync(values);

        } else {

          await postMutation.mutateAsync(values);

        }
        toast.success("Successfully saved App", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          onClose: handleToastClose,
        });
      } catch (error) {
        toast.error(error.response.data, {
          position: "top-right",
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    },
  });

  const handleToastClose = () => {
    navigate(-1);
  };

  const { refetch } = useQuery(
    ['getAppDetails', id],
    () => getAppDetails(id),
    {
      enabled: !!id,
      onSuccess: (response) => {
        console.log("app details", response.data);
        //setData(response.data);
        formik.setValues({
          appName: response.data.appName,
          description: response.data.description,
          appId: response.data.appId,
          baseUrl: response.data.baseUrl,
          appVersion: response.data.appVersion,
          username: response.data.username,
          password: response.data.password,
          domain: response.data.domain
        })
      },
    }
  );

  return (
    <React.Fragment>
      <ToastContainer />
      <Grid container spacing={3} alignItems="stretch" >
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
                Commcare
              </Typography>
              <Typography gutterBottom>Add App details below</Typography>
            </Grid>
            <form onSubmit={formik.handleSubmit}>
              <Card mb={12}>
                <CardContent>
                  {formik.isSubmitting ? (
                    <Box display="flex" justifyContent="center" my={6}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <>
                      <Box>
                        <Grid
                          container
                          spacing={5}
                          direction="row"
                          justifyContent="flex-start"
                          alignItems="flex-start"
                        >
                          <Grid item sm={6}>
                            <FormControl
                              sx={{ m: 1, width: "100%", marginBottom: "20px" }}
                              size="medium"
                            >
                              <FormLabel
                                style={{
                                  fontSize: "16px",
                                  color: "#000",
                                  fontWeight: "bold",
                                }}
                              >Domain</FormLabel>
                              <TextField
                                name="domain"
                                label="Domain"
                                value={formik.values.domain}
                                error={Boolean(
                                  formik.touched.domain && formik.errors.domain
                                )}
                                fullWidth
                                helperText={
                                  formik.touched.domain && formik.errors.domain
                                }
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                variant="outlined"
                                disabled={id != undefined}
                                sx={{
                                  marginTop: 2,
                                  '& legend': { display: 'none' },
                                  '& .MuiInputLabel-shrink': { opacity: 0, transition: "all 0.2s ease-in" }

                                }}
                                my={2}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item sm={6}>
                            <FormControl
                              sx={{ m: 1, width: "100%", marginBottom: "20px" }}
                              size="medium"
                            >
                              <FormLabel
                                style={{
                                  fontSize: "16px",
                                  color: "#000",
                                  fontWeight: "bold",
                                }}
                              >
                                Name
                              </FormLabel>
                              <TextField
                                name="appName"
                                label="Name"
                                value={formik.values.appName}
                                error={Boolean(
                                  formik.touched.appName && formik.errors.appName
                                )}
                                fullWidth
                                helperText={
                                  formik.touched.appName && formik.errors.appName
                                }
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                variant="outlined"
                                sx={{
                                  marginTop: 2,
                                  '& legend': { display: 'none' },
                                  '& .MuiInputLabel-shrink': { opacity: 0, transition: "all 0.2s ease-in" }

                                }}
                                my={2}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item sm={6}>
                            <FormControl
                              sx={{ m: 1, width: "100%", marginBottom: "20px" }}
                              size="medium"
                            >
                              <FormLabel
                                style={{
                                  fontSize: "16px",
                                  color: "#000",
                                  fontWeight: "bold",
                                }}
                              >App-ID</FormLabel>
                              <TextField
                                name="appId"
                                label="App ID"
                                value={formik.values.appId}
                                error={Boolean(
                                  formik.touched.appId && formik.errors.appId
                                )}
                                fullWidth
                                helperText={
                                  formik.touched.appId && formik.errors.appId
                                }
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                variant="outlined"
                                disabled={id != undefined}
                                sx={{
                                  marginTop: 2,
                                  '& legend': { display: 'none' },
                                  '& .MuiInputLabel-shrink': { opacity: 0, transition: "all 0.2s ease-in" }

                                }}
                                my={2}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item sm={6}>
                            <FormControl
                              sx={{ m: 1, width: "100%", marginBottom: "20px" }}
                              size="medium"
                            >
                              <FormLabel
                                style={{
                                  fontSize: "16px",
                                  color: "#000",
                                  fontWeight: "bold",
                                }}
                              >username</FormLabel>
                              <TextField
                                name="username"
                                label="Username"
                                value={formik.values.username}
                                error={Boolean(
                                  formik.touched.username &&
                                  formik.errors.username
                                )}
                                fullWidth
                                helperText={
                                  formik.touched.username &&
                                  formik.errors.username
                                }
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                variant="outlined"
                                sx={{
                                  marginTop: 2,
                                  '& legend': { display: 'none' },
                                  '& .MuiInputLabel-shrink': { opacity: 0, transition: "all 0.2s ease-in" }

                                }}
                                my={2}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item sm={6}>
                            <FormControl
                              sx={{ m: 1, width: "100%", marginBottom: "20px" }}
                              size="medium"
                            >
                              <FormLabel
                                style={{
                                  fontSize: "16px",
                                  color: "#000",
                                  fontWeight: "bold",
                                }}
                              >Password</FormLabel>
                              <TextField
                                name="password"
                                label="Password"
                                type="password"
                                value={formik.values.password}
                                error={Boolean(
                                  formik.touched.password &&
                                  formik.errors.password
                                )}
                                fullWidth
                                helperText={
                                  formik.touched.password &&
                                  formik.errors.password
                                }
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                variant="outlined"
                                sx={{
                                  marginTop: 2,
                                  '& legend': { display: 'none' },
                                  '& .MuiInputLabel-shrink': { opacity: 0, transition: "all 0.2s ease-in" }

                                }}
                                my={2}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item sm={6}>
                            <FormControl
                              sx={{ m: 1, width: "100%", marginBottom: "20px" }}
                              size="medium"
                            >
                              <FormLabel
                                style={{
                                  fontSize: "16px",
                                  color: "#000",
                                  fontWeight: "bold",
                                }}
                              >Version</FormLabel>
                              <TextField
                                name="appVersion"
                                label="Version"
                                value={formik.values.appVersion}
                                error={Boolean(
                                  formik.touched.appVersion &&
                                  formik.errors.appVersion
                                )}
                                fullWidth
                                helperText={
                                  formik.touched.appVersion &&
                                  formik.errors.appVersion
                                }
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                variant="outlined"
                                disabled={id != undefined}
                                InputProps={{
                                  style: {
                                    borderRadius: "10px",
                                  },
                                }}
                                my={2}
                              />
                            </FormControl>
                          </Grid>

                          <Grid item sm={6}>
                            <FormControl
                              sx={{ m: 1, width: "100%", marginBottom: "20px" }}
                              size="medium"
                            >
                              <FormLabel
                                style={{
                                  fontSize: "16px",
                                  color: "#000",
                                  fontWeight: "bold",
                                }}
                              >Commcare Server Base URL</FormLabel>
                              <TextField
                                name="baseUrl"
                                label="Base URL"
                                value={formik.values.baseUrl}
                                error={Boolean(
                                  formik.touched.baseUrl &&
                                  formik.errors.baseUrl
                                )}
                                fullWidth
                                helperText={
                                  formik.touched.baseUrl &&
                                  formik.errors.baseUrl
                                }
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                variant="outlined"
                                disabled={id != undefined}
                                sx={{
                                  marginTop: 2,
                                  '& legend': { display: 'none' },
                                  '& .MuiInputLabel-shrink': { opacity: 0, transition: "all 0.2s ease-in" }

                                }}
                                my={2}
                              />
                            </FormControl>
                          </Grid>

                          <Grid item sm={6}>
                            <FormControl
                              sx={{ m: 1, width: "100%", marginBottom: "20px" }}
                              size="medium"
                            >
                              <FormLabel
                                style={{
                                  fontSize: "16px",
                                  color: "#000",
                                  fontWeight: "bold",
                                }}
                              >Description</FormLabel>
                              <TextField
                                name="description"
                                label="Description"
                                value={formik.values.description}
                                error={Boolean(
                                  formik.touched.description &&
                                  formik.errors.description
                                )}
                                fullWidth
                                helperText={
                                  formik.touched.description &&
                                  formik.errors.description
                                }
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                multiline
                                variant="outlined"
                                sx={{
                                  marginTop: 2,
                                  '& legend': { display: 'none' },
                                  '& .MuiInputLabel-shrink': { opacity: 0, transition: "all 0.2s ease-in" }

                                }}
                                rows={5}
                                my={2}
                              />
                            </FormControl>
                          </Grid>
                        </Grid>
                        <Grid item xl={12} xs={12} md={12}>
                          <Grid
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Button
                              variant="contained"
                              sx={{
                                fontSize: '14px',
                                fontWeight: 'bolder',
                                backgroundColor: '#333333',
                              }}
                              startIcon={<ReplyIcon />}
                              onClick={() => navigate(-1)}
                            >
                              Back
                            </Button>
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
                      </Box>
                    </>
                  )}
                </CardContent>
              </Card>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
export default AppRegistration;
