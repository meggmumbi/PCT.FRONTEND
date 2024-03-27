import React, { useEffect, useState } from "react";
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
import {
  postOrganization, getOrganizationDetails
  } from "../../apis/organization";
import Paper from "@mui/material/Paper";
import "react-toastify/dist/ReactToastify.min.css";

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

const OrganizationDetails = (props) => {
  const navigate = useNavigate();
  let { id } = useParams();
  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));

  const postMutation = useMutation({ mutationFn: postOrganization });

  const formik = useFormik({
    
    initialValues: {
      organizationName: "",
      organizationType: "",
      physicalAddress: "",
      emailAddress:"",
      description:"",
      phone:"",
      status:"Enabled"
    },
    validationSchema: Yup.object().shape({
      organizationName: Yup.string().required("Required"),
      organizationType: Yup.string().required("Required"),
    }),
    
    onSubmit: async (values, { resetForm, setSubmitting }) => {
        console.log("here:", values);
      try {
        
        if (id) {
          values.id = id;         

          await postMutation.mutateAsync(values);
          
        } else {
          
            await postMutation.mutateAsync(values);
         
        }
        toast.success("Successfully added organization", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          onClose: handleToastClose,
        });
       
        
      } catch (error) {
        toast.error(error.response.error, {
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
    navigate("/MISAdministration/organization/")
  };

  const [orgDetails, setData] = useState([]);

  const { refetch } = useQuery(
    ['getOrganizationDetails', id],
    () => getOrganizationDetails(id), 
    {
      onSuccess: (response) => {
        console.log("org details", response.data);
        //setData(response.data);
        formik.setValues({
          organizationName: response.data.organizationName,
          organizationType: response.data.organizationType,
          physicalAddress: response.data.physicalAddress,
          emailAddress: response.data.emailAddress,
          description: response.data.description,
          phone: response.data.phone,
          status: response.data.status
        })
      },
    }
  );

  // useEffect(() => {
  //   function setCurrentFormValues() {
  //       formik.setValues({
  //         organizationName: data.data.organizationName,
  //         organizationType: data.data.organizationType,
  //         physicalAddress: data.data.physicalAddress,
  //         emailAddress: data.data.emailAddress,
  //         phone: data.data.phone,
  //         status: data.data.status,
  //       });
  //   }
  //   setCurrentFormValues();
  // });

  return (
    <React.Fragment>
      <ToastContainer />
      <Grid container alignItems="stretch">
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
                Add New Organization
              </Typography>
              <Typography gutterBottom>Enter new organization details below</Typography>
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
                              >Organization Name</FormLabel>

                              <TextField
                                name="organizationName"
                                label="Organization Name"
                                value={formik.values.organizationName}
                                error={Boolean(
                                  formik.touched.organizationName && formik.errors.organizationName
                                )}
                                fullWidth
                                helperText={
                                  formik.touched.organizationName && formik.errors.organizationName
                                }
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                variant="outlined"
                                inputProps={{ 'aria-label': 'Without label' }}
                                sx={{
                                  marginTop: 2,
                                  '& legend': { display: 'none' },
                                  '& .MuiInputLabel-shrink': { opacity: 0, transition: "all 0.2s ease-in" },
                                  width:'100%'
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
                                Organization Type
                              </FormLabel>
                              <TextField
                                name="organizationType"
                                label="Organization Type"
                                value={formik.values.organizationType}
                                error={Boolean(
                                  formik.touched.organizationType && formik.errors.organizationType
                                )}
                                fullWidth
                                helperText={
                                  formik.touched.organizationType && formik.errors.organizationType
                                }
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                variant="outlined"
                                inputProps={{ 'aria-label': 'Without label' }}
                                sx={{
                                  marginTop: 2,
                                  '& legend': { display: 'none' },
                                  '& .MuiInputLabel-shrink': { opacity: 0, transition: "all 0.2s ease-in" },
                                  width:'100%'
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
                              >Physical Address</FormLabel>

                              <TextField
                                name="physicalAddress"
                                label="Physical Address"
                                value={formik.values.physicalAddress}
                                error={Boolean(
                                  formik.touched.physicalAddress && formik.errors.physicalAddress
                                )}
                                fullWidth
                                helperText={
                                  formik.touched.physicalAddress && formik.errors.physicalAddress
                                }
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                variant="outlined"
                                inputProps={{ 'aria-label': 'Without label' }}
                                sx={{
                                  marginTop: 2,
                                  '& legend': { display: 'none' },
                                  '& .MuiInputLabel-shrink': { opacity: 0, transition: "all 0.2s ease-in" },
                                  width:'100%'
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
                              >Email Address</FormLabel>
                              <TextField
                                name="emailAddress"
                                label="Email Address"
                                value={formik.values.emailAddress}
                                error={Boolean(
                                  formik.touched.emailAddress &&
                                    formik.errors.emailAddress
                                )}
                                fullWidth
                                helperText={
                                  formik.touched.emailAddress &&
                                  formik.errors.emailAddress
                                }
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                variant="outlined"
                                inputProps={{ 'aria-label': 'Without label' }}
                                sx={{
                                  marginTop: 2,
                                  '& legend': { display: 'none' },
                                  '& .MuiInputLabel-shrink': { opacity: 0, transition: "all 0.2s ease-in" },
                                  width:'100%'
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
                              >Telephone Number</FormLabel>
                              <TextField
                                name="phone"
                                label="Telephone Number"
                                value={formik.values.phone}
                                error={Boolean(
                                  formik.touched.phone &&
                                    formik.errors.phone
                                )}
                                fullWidth
                                helperText={
                                  formik.touched.phone &&
                                  formik.errors.phone
                                }
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                variant="outlined"
                                inputProps={{ 'aria-label': 'Without label' }}
                                sx={{
                                  marginTop: 2,
                                  '& legend': { display: 'none' },
                                  '& .MuiInputLabel-shrink': { opacity: 0, transition: "all 0.2s ease-in" },
                                  width:'100%'
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
                                inputProps={{ 'aria-label': 'Without label' }}
                                sx={{
                                  marginTop: 2,
                                  '& legend': { display: 'none' },
                                  '& .MuiInputLabel-shrink': { opacity: 0, transition: "all 0.2s ease-in" },
                                  width:'100%'
                                }}
                                rows={5}
                                my={2}
                              />
                            </FormControl>
                          </Grid>
                        </Grid>
                        <Stack direction="row" spacing={2}>
                          <ThemeProvider theme={themeCustom}>
                            <Button
                              type="cancel"
                              variant="contained"
                              color="custom_black"
                              onClick={() => 
                                navigate("/MISAdministration/organization/")
                              }
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              variant="contained"
                              color="custom_green"
                            >
                              Save
                            </Button>
                          </ThemeProvider>
                        </Stack>
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
export default OrganizationDetails;
