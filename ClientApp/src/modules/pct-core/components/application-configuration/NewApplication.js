import React from "react";
import styled from "@emotion/styled";
import {
  Box,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  CircularProgress,
  Grid,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { newApplication } from "../../apis/mis-administration";
import { useNavigate } from "react-router-dom";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);

const NewApplicationForm = () => {
  const navigate = useNavigate();
  const mutation = useMutation({ mutationFn: newApplication });
  const formik = useFormik({
    initialValues: {
      applicationName: "",
      description: "",
      version: "",
      size: 0,
      isActive: true,
    },
    validationSchema: Yup.object().shape({
      applicationName: Yup.string().required("Required"),
      description: Yup.string().required("Required"),
      version: Yup.string().required("Required"),
      size: Yup.number().required("Required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        setSubmitting(true);
        await mutation.mutateAsync(values);
        navigate("/MISAdministration/application-configuration");
        resetForm();
      } catch (error) {
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card mb={12}>
        <CardContent>
          {formik.isSubmitting ? (
            <Box display="flex" justifyContent={"center"} my={6}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Grid container spacing={12}>
                <Grid item md={12}>
                  <Typography variant="h3" gutterBottom display="inline">
                    NEW APPLICATION
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={12}>
                <Grid item md={12}>
                  <TextField
                    name="applicationName"
                    label="Application Name"
                    value={formik.values.applicationName}
                    error={Boolean(
                      formik.touched.applicationName &&
                        formik.errors.applicationName
                    )}
                    fullWidth
                    helperText={
                      formik.touched.applicationName &&
                      formik.errors.applicationName
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  />
                </Grid>
              </Grid>

              <TextField
                name="description"
                label="Description"
                value={formik.values.description}
                error={Boolean(
                  formik.touched.description && formik.errors.description
                )}
                fullWidth
                helperText={
                  formik.touched.description && formik.errors.description
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                multiline
                required
                variant="outlined"
                rows={3}
                my={2}
              />

              <Grid container spacing={2}>
                <Grid item md={12}>
                  <TextField
                    name="version"
                    label="Version"
                    value={formik.values.version}
                    error={Boolean(
                      formik.touched.version && formik.errors.version
                    )}
                    fullWidth
                    helperText={formik.touched.version && formik.errors.version}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  />
                </Grid>

                <Grid item md={12}>
                  <TextField
                    name="size"
                    label="Size"
                    value={formik.values.size}
                    error={Boolean(formik.touched.size && formik.errors.size)}
                    fullWidth
                    helperText={formik.touched.size && formik.errors.size}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                    type={"number"}
                  />
                </Grid>
              </Grid>

              <Button type="submit" variant="contained" color="primary" mt={3}>
                Save changes
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </form>
  );
};

const NewApplication = () => {
  return (
    <React.Fragment>
      <Helmet title="New Application" />
      <NewApplicationForm />
    </React.Fragment>
  );
};
export default NewApplication;
