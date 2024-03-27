import React, { useEffect, useState, useRef } from "react";
import styled from "@emotion/styled";
import {
  Box,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent, CircularProgress,
  Grid, InputLabel,
  Stack,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import MenuItem from "@mui/material/MenuItem";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getProductById, newProduct, updateProduct } from "../../apis/product";
import { toast } from "react-toastify";
import { getCategoryByGroupId } from "../../apis/category";
import { getUnitsByGroup } from "../../apis/unit";
import Paper from "@mui/material/Paper";
import { getFamilies } from "../../apis/product-catalog";
import ImageUpload from '../../../../components/ImageUpload'

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#fff' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px !important"
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
    }
  },
});

const NewProduct = () => {
  const navigate = useNavigate();
  let { id } = useParams();
  const mutation = useMutation({ mutationFn: newProduct });
  const updateMutation = useMutation({ mutationFn: updateProduct });
  const [families, setFamilies] = useState([]);
  const imageUploadRef = useRef(null);


  const {
    isLoadingFamilies,
    isErrorFamilies
  } = useQuery(["getAllRolesList"], getFamilies,
    {
      onSuccess: (response) => {
        setFamilies(response.data._embedded.items)
        console.log(response.data._embedded.items)
      }
    }
  );


  const {
    data,
    isLoading,
    isError,
  } = useQuery(["getProductById", id], getProductById, {
    enabled: !!id,
  });
  const {
    data: ProductCategories,
    isLoading: isLoadingProductCategories,
    isError: isErrorProductCategories,
  } = useQuery(["getCategoryByGroupId", 0], getCategoryByGroupId);





  const {
    data: ProductUnits,
    isLoading: isLoadingProductUnits,
    isError: isErrorProductUnits,
  } = useQuery(["getUnitsByGroup", 0], getUnitsByGroup);

  const formik = useFormik({
    initialValues: {
      name: "",
      productId: "",
      category: "",
      units: "",
      cost: null,
      description: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Required"),
      productId: Yup.string().required("Required"),
      category: Yup.string().required("Required"),
      units: Yup.string().required("Required"),
      cost: Yup.number().required("Required"),
      description: Yup.string().required("Required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        if (id) {
          values.id = id;
          values.createDate = new Date();
          await updateMutation.mutateAsync(values);
        } else {
          await mutation.mutateAsync(values);
        }
        toast("Successfully Created a Product", {
          type: "success",
        });
        navigate("/master-data-registry/products");
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
          productId: data.data.productId,
          category: data.data.category,
          units: data.data.units,
          image: data.data.image.replace('data:image/jpeg;base64,', ''),
          description: data.data.description ? data.data.description : "",
        });
      }
    }
    setCurrentFormValues();
  }, [isLoading, isError, data]);
  const handleImageChange = (base64) => {
    formik.setFieldValue("image", base64.replace('data:image/jpeg;base64,', ''));
  }

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
                      Product
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container spacing={2} mb={2}>
                  <Grid item md={6}>
                    <Item elevation={3} sx={{ height: '30rem' }}>
                      <Grid item md={12} sx={{ display: "flex", justifyContent: "left", alignItems: 'center' }}>
                        <InputLabel
                          sx={{
                            marginRight: '10px',
                            display: "flex",
                            justifyContent: "right",
                            alignItems: 'center',
                            fontWeight: 700,
                            width: '10rem',
                            fontSize: '1rem',
                            color: '#376fd0',
                          }}
                        >
                          Name
                        </InputLabel>
                        <TextField
                          name="name"
                          label="Product Name"
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

                      <Grid item md={12} sx={{ display: "flex", justifyContent: "left", alignItems: 'center' }}>
                        <InputLabel
                          sx={{
                            marginRight: '10px',
                            display: "flex",
                            justifyContent: "right",
                            alignItems: 'center',
                            fontWeight: 700,
                            width: '10rem',
                            fontSize: '1rem',
                            color: '#376fd0',
                          }}
                        >
                          Code
                        </InputLabel>
                        <TextField
                          name="productId"
                          label="Product Code"
                          value={formik.values.productId}
                          error={Boolean(
                            formik.touched.productId && formik.errors.productId
                          )}
                          fullWidth
                          helperText={
                            formik.touched.productId && formik.errors.productId
                          }
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          variant="outlined"
                          my={2}
                        />
                      </Grid>

                      <Grid item md={12} sx={{ display: "flex", justifyContent: "left", alignItems: 'center' }}>
                        <InputLabel
                          sx={{
                            marginRight: '10px',
                            display: "flex",
                            justifyContent: "right",
                            alignItems: 'center',
                            fontWeight: 700,
                            width: '10rem',
                            fontSize: '1rem',
                            color: '#376fd0',
                          }}
                        >
                          Category
                        </InputLabel>
                        <TextField
                          name="category"
                          label="Product Category"
                          select
                          value={formik.values.category}
                          error={Boolean(
                            formik.touched.category && formik.errors.category
                          )}
                          helperText={
                            formik.touched.category && formik.errors.category
                          }
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          variant="outlined"
                          fullWidth
                          my={2}
                        >
                          <MenuItem disabled value="">
                            Select Product Category
                          </MenuItem>
                          {families?.map((option) => (
                            <MenuItem key={option.code} value={option.code}>
                              {option.code}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>

                      <Grid item md={12} sx={{ display: "flex", justifyContent: "left", alignItems: 'center' }}>
                        <InputLabel
                          sx={{
                            marginRight: '10px',
                            display: "flex",
                            justifyContent: "right",
                            alignItems: 'center',
                            fontWeight: 700,
                            width: '10rem',
                            fontSize: '1rem',
                            color: '#376fd0',
                          }}
                        >
                          Unit
                        </InputLabel>
                        <TextField
                          name="units"
                          label="Product Unit"
                          select
                          value={formik.values.units}
                          error={Boolean(
                            formik.touched.units && formik.errors.units
                          )}
                          helperText={
                            formik.touched.units && formik.errors.units
                          }
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          variant="outlined"
                          fullWidth
                          my={2}
                        >
                          <MenuItem disabled value="">
                            Select Product Units
                          </MenuItem>
                          {!isLoadingProductUnits && !isErrorProductUnits
                            ? ProductUnits.data.map((option) => (
                              <MenuItem key={option.id} value={option.name}>
                                {option.name}
                              </MenuItem>
                            ))
                            : []}
                        </TextField>
                      </Grid>

                      <Grid item md={12} sx={{ display: "flex", justifyContent: "left", alignItems: 'center' }}>
                        <InputLabel
                          sx={{
                            marginRight: '10px',
                            display: "flex",
                            justifyContent: "right",
                            alignItems: 'center',
                            fontWeight: 700,
                            width: '10rem',
                            fontSize: '1rem',
                            color: '#376fd0',
                          }}
                        >
                          Unit Cost ($)
                        </InputLabel>
                        <TextField
                          type="number"
                          name="cost"
                          label="Unit Cost"
                          value={formik.values.cost}
                          error={Boolean(
                            formik.touched.cost && formik.errors.cost
                          )}
                          fullWidth
                          helperText={
                            formik.touched.cost && formik.errors.cost
                          }
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          variant="outlined"
                          my={2}
                        />

                      </Grid>


                      <Grid item md={12} sx={{ display: "flex", justifyContent: "left", alignItems: 'center' }}>
                        <InputLabel
                          sx={{
                            marginRight: '10px',
                            display: "flex",
                            justifyContent: "right",
                            alignItems: 'center',
                            fontWeight: 700,
                            width: '10rem',
                            fontSize: '1rem',
                            color: '#376fd0',
                          }}
                        >
                          Description
                        </InputLabel>
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

                    </Item>
                  </Grid>
                  <Grid item md={6}>
                    <Item elevation={3}>
                      <ImageUpload ref={imageUploadRef} imageBase64={handleImageChange} defaultImage={""} height='30rem' />
                    </Item>
                  </Grid>





                </Grid>
                <Stack direction="row" justifyContent="flex-end" alignItems="flex-end" spacing={2}>
                  <ThemeProvider theme={themeCustom}>
                    <Button type="submit" variant="contained" color="custom_black" onClick={() => navigate("/master-data-registry/products")}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="contained" color="custom_green">
                      Save New Product
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
export default NewProduct;
