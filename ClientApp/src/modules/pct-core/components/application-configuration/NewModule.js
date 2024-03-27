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
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { newModule } from "../../apis/mis-administration";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);

const NewModule = () => {
  let { applicationId } = useParams();
  const mutation = useMutation({ mutationFn: newModule });
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      moduleName: "",
      description: "",
      isActive: true,
    },
    validationSchema: Yup.object().shape({
      moduleName: Yup.string().required("Required"),
      description: Yup.string().required("Required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        setSubmitting(true);
        values.applicationId = applicationId;
        await mutation.mutateAsync(values);
        navigate("/MISAdministration/application-details/" + applicationId);
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
                    NEW MODULE
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={12}>
                <Grid item md={12}>
                  <TextField
                    name="moduleName"
                    label="Module Name"
                    value={formik.values.moduleName}
                    error={Boolean(
                      formik.touched.moduleName && formik.errors.moduleName
                    )}
                    fullWidth
                    helperText={
                      formik.touched.moduleName && formik.errors.moduleName
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
export default NewModule;
