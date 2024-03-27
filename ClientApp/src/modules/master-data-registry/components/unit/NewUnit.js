import React, {useEffect} from "react";
import styled from "@emotion/styled";
import {
  Box,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent, CircularProgress,
  Grid,
  Stack,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import {spacing} from "@mui/system";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {useNavigate, useParams} from "react-router-dom";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useMutation, useQuery} from "@tanstack/react-query";
import { toast } from "react-toastify";
import {getUnitById, newUnit, updateUnit} from "../../apis/unit";
import MenuItem from "@mui/material/MenuItem";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);

const themeCustom = createTheme({
  palette: {
    custom_black: {
      main: "#000000",
      contrastText: "#FFFFFF",
    },
    custom_green: {
      main: "#23A295",
      contrastText: "#FFFFFF",
    }
  },
});

const NewUnit = () => {
  const navigate = useNavigate();
  let { id } = useParams();

  const {
    data,
    isLoading,
    isError
  } = useQuery(["getUnitById", id], getUnitById, {
    enabled: !!id,
  });
  const mutation = useMutation({ mutationFn: newUnit });
  const updateMutation = useMutation({ mutationFn: updateUnit });

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      group: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Required"),
      description: Yup.string().required("Required"),
      group: Yup.number().required("Required"),
    }),
    onSubmit: async (values, { resetForm,  setSubmitting }) => {
      try {
        if (id) {
          values.id = id;
          await updateMutation.mutateAsync(values);
        } else {
          await mutation.mutateAsync(values);
        }
        toast("Successfully Created an Unit", {
          type: "success",
        });
        navigate("/master-data-registry/units");
      } catch (error) {
        toast(error.response.data, {
          type: "error",
        });
      }
    }
  });

  useEffect(() => {
    function setCurrentFormValues() {
      if (!isLoading && !isError) {
        formik.setValues({
          name: data.data.name,
          description: data.data.description ? data.data.description : "",
          group: data.data.group,
        });
      }
    }
    setCurrentFormValues();
  }, [isLoading, isError, data]);

  return (
    <React.Fragment>
      <form onSubmit={formik.handleSubmit}>
        <Card mb={12}>
          <CardContent>
            {formik.isSubmitting ? (
              <Box display="flex" justifyContent="center" my={6}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <Grid container spacing={12}>
                  <Grid item md={12}>
                    <Typography variant="h3" gutterBottom display="inline" sx={{ color: "#23A295;" }}>
                      Master Data Registry
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      New Unit
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container spacing={2} mb={2}>
                  <Grid item md={6}>
                    <TextField
                      name="name"
                      label="Name"
                      value={formik.values.name}
                      error={Boolean(
                        formik.touched.name && formik.errors.name
                      )}
                      fullWidth
                      helperText={
                        formik.touched.name && formik.errors.name
                      }
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      variant="outlined"
                      my={2}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2} mb={2}>
                  <Grid item md={6}>
                    <TextField
                      name="group"
                      label="Group"
                      select
                      value={formik.values.group}
                      error={Boolean(
                        formik.touched.group && formik.errors.group
                      )}
                      fullWidth
                      helperText={
                        formik.touched.group && formik.errors.group
                      }
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      variant="outlined"
                      my={2}
                    >
                      <MenuItem disabled value="">
                        Select Group
                      </MenuItem>
                      <MenuItem key={0} value={0}>
                        Product
                      </MenuItem>
                      <MenuItem key={1} value={1}>
                        Carrier
                      </MenuItem>
                      <MenuItem key={2} value={2}>
                        Location
                      </MenuItem>
                      <MenuItem key={3} value={3}>
                        Vendor
                      </MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
                <Grid container spacing={2} mb={2}>
                  <Grid item md={6}>
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
                      variant="outlined"
                      rows={3}
                      my={2}
                    />
                  </Grid>
                </Grid>
                <Stack direction="row" spacing={2}>
                  <ThemeProvider theme={themeCustom}>
                    <Button type="submit" variant="contained" color="custom_black" onClick={() => navigate("/master-data-registry/units")}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="contained" color="custom_green">
                      Save New Unit
                    </Button>
                  </ThemeProvider>
                </Stack>
              </>
            )}
          </CardContent>
        </Card>
      </form>
    </React.Fragment>
  );
};
export default NewUnit;
