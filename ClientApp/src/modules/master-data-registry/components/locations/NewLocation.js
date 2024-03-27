import React, {useEffect, useState} from "react";
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
import {spacing} from "@mui/system";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {useNavigate, useParams} from "react-router-dom";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useMutation, useQuery} from "@tanstack/react-query";
import { toast } from "react-toastify";
import {getLocationById, getLocations, newLocation, updateLocation} from "../../apis/location";
import MenuItem from "@mui/material/MenuItem";
import {getCategoryByGroupId} from "../../apis/category";
import {getUnitsByGroup} from "../../apis/unit";
import Paper from "@mui/material/Paper";
import CustomMenuTree from "../../../../components/MenuTree/CustomMenuTree";


const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#fff' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  boxShadow:"rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px !important"
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

const NewLocation = () => {
  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();
  let { id } = useParams();

  const {
    isLoadings,
    isErrors
  } = useQuery(["getLocationsList"], getLocations,
      {
        onSuccess: (response) => {
          let temp = [];
          response.data.forEach(i =>{
            temp.push({
              id:i.id,
              name:i.name,
              parent_id:i.parent
            });
          })
          setLocations(temp);
        }
      }
  );


  const {
    data,
    isLoading,
    isError
  } = useQuery(["getLocationById", id], getLocationById, {
    enabled: !!id,
  });
  const {
    data: categories,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
  } = useQuery(["getCategoryByGroupId", 2], getCategoryByGroupId);
  const {
    data: units,
    isLoading: isLoadingUnits,
    isError: isErrorUnits,
  } = useQuery(["getUnitsByGroup", 2], getUnitsByGroup);
  const mutation = useMutation({ mutationFn: newLocation });
  const updateMutation = useMutation({ mutationFn: updateLocation });

  const formik = useFormik({
    initialValues: {
      name: "",
      description:"",
      category: "",
      parent:null
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Required"),
      description: Yup.string().required("Required"),
      category: Yup.string().required("Required")
    }),
    onSubmit: async (values, { resetForm,  setSubmitting }) => {
      try {
        if (id) {
          values.id = id;
          await updateMutation.mutateAsync(values);
        } else {
          await mutation.mutateAsync(values);
        }
        toast("Successfully Created a Location", {
          type: "success",
        });
        navigate("/master-data-registry/locations");
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
          category: data.data.category,
          parent: data.data.parent
        });
      }
    }
    setCurrentFormValues();
  }, [isLoading, isError, data]);


  const updateParentUid = (items) => {

    formik.setValues({
      parent: items.length === 0? null:items[0]
    });
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
                      Location
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container spacing={2} mb={2}>
                  <Grid item md={6}>
                    <Item elevation={3}>
                      <Grid container spacing={2} mb={2}>
                        <Grid item md={12} sx={{display: "flex",justifyContent: "left",alignItems:'center'}}>
                          <InputLabel
                              sx={{
                                marginRight:'10px',
                                display: "flex",
                                justifyContent: "right",
                                alignItems:'center',
                                fontWeight: 700,
                                width:'10rem',
                                fontSize:'1rem',
                                color: '#376fd0',
                              }}
                          >
                            Name
                          </InputLabel>
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

{/*                        <Grid item md={12} sx={{display: "flex",justifyContent: "left",alignItems:'center'}}>
                          <TextField
                              name="country"
                              label="Country"
                              value={formik.values.country}
                              error={Boolean(
                                  formik.touched.country && formik.errors.country
                              )}
                              fullWidth
                              helperText={
                                  formik.touched.country && formik.errors.country
                              }
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              variant="outlined"
                              my={2}
                          />
                        </Grid>*/}

                        <Grid item md={12} sx={{display: "flex",justifyContent: "left",alignItems:'center'}}>
                          <InputLabel
                              sx={{
                                marginRight:'10px',
                                display: "flex",
                                justifyContent: "right",
                                alignItems:'center',
                                fontWeight: 700,
                                width:'10rem',
                                fontSize:'1rem',
                                color: '#376fd0',
                              }}
                          >
                            Category
                          </InputLabel>
                          <TextField
                              name="category"
                              label="Category"
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
                              Select Location Category
                            </MenuItem>
                            {!isLoadingCategories && !isErrorCategories
                                ? categories.data.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
                                      {option.name}
                                    </MenuItem>
                                ))
                                : []}
                          </TextField>
                        </Grid>


                        <Grid item md={12} sx={{display: "flex",justifyContent: "left",alignItems:'center'}}>
                          <InputLabel
                              sx={{
                                marginRight:'10px',
                                display: "flex",
                                justifyContent: "right",
                                alignItems:'center',
                                fontWeight: 700,
                                width:'10rem',
                                fontSize:'1rem',
                                color: '#376fd0',
                              }}
                          >
                          GLN
                          </InputLabel>
                          <TextField
                              name="gln"
                              label="Global Location Number (GLN)"
                              value={formik.values.gln}
                              error={Boolean(
                                  formik.touched.gln && formik.errors.gln
                              )}
                              fullWidth
                              helperText={
                                  formik.touched.gln && formik.errors.gln
                              }
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              variant="outlined"
                              my={2}
                          />
                        </Grid>

                        <Grid item md={12} sx={{display: "flex",justifyContent: "left",alignItems:'center'}}>
                          <InputLabel
                              sx={{
                                marginRight:'10px',
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems:'center',
                                fontWeight: 700,
                                width:'10rem',
                                fontSize:'1rem',
                                color: '#376fd0',
                                whiteSpace:'normal !important',
                                marginLeft:'auto',
                                textAlign:'right'
                              }}
                          >
                          Physical Address
                          </InputLabel>
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
                              multiline
                              variant="outlined"
                              rows={3}
                              my={2}
                          />
                        </Grid>

                        <Grid item md={12} sx={{display: "flex",justifyContent: "left",alignItems:'center'}}>
                          <InputLabel
                              sx={{
                                marginRight:'10px',
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems:'center',
                                fontWeight: 700,
                                width:'10rem',
                                fontSize:'1rem',
                                color: '#376fd0',
                                whiteSpace:'normal !important',
                                textAlign:'right'
                              }}
                          >
                          Geographic Coordinates
                          </InputLabel>
                          <TextField
                              name="geographicCoordinates"
                              label="Geographic Coordinates"
                              value={formik.values.geographicCoordinates}
                              error={Boolean(
                                  formik.touched.geographicCoordinates && formik.errors.geographicCoordinates
                              )}
                              fullWidth
                              helperText={
                                  formik.touched.geographicCoordinates && formik.errors.geographicCoordinates
                              }
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              multiline
                              variant="outlined"
                              rows={3}
                              my={2}
                          />
                        </Grid>



                        <Grid item md={12} sx={{display: "flex",justifyContent: "left",alignItems:'center'}}>
                          <InputLabel
                              sx={{
                                marginRight:'10px',
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems:'center',
                                fontWeight: 700,
                                width:'10rem',
                                fontSize:'1rem',
                                color: '#376fd0',
                                whiteSpace:'normal !important',
                                textAlign:'right'
                              }}
                          >
                          Contact Information
                          </InputLabel>
                          <TextField
                              name="contactInformation"
                              label="Contact Information"
                              value={formik.values.contactInformation}
                              error={Boolean(
                                  formik.touched.contactInformation && formik.errors.contactInformation
                              )}
                              fullWidth
                              helperText={
                                  formik.touched.contactInformation && formik.errors.contactInformation
                              }
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              multiline
                              variant="outlined"
                              rows={3}
                              my={2}
                          />
                        </Grid>


{/*                        <Grid item md={12}>
                          <TextField
                              name="unit"
                              label="Unit"
                              select
                              value={formik.values.unit}
                              error={Boolean(
                                  formik.touched.unit && formik.errors.unit
                              )}
                              helperText={
                                  formik.touched.unit && formik.errors.unit
                              }
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              variant="outlined"
                              fullWidth
                              my={2}
                          >
                            <MenuItem disabled value="">
                              Select Location Unit
                            </MenuItem>
                            {!isLoadingUnits && !isErrorUnits
                                ? units.data.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
                                      {option.name}
                                    </MenuItem>
                                ))
                                : []}
                          </TextField>
                        </Grid>
                        */}

                        <Grid item md={12} sx={{display: "flex",justifyContent: "left",alignItems:'center'}}>
                          <InputLabel
                              sx={{
                                marginRight:'10px',
                                display: "flex",
                                justifyContent: "right",
                                alignItems:'center',
                                fontWeight: 700,
                                width:'10rem',
                                fontSize:'1rem',
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
                      </Grid>
                    </Item>
                  </Grid>
                  <Grid item md={6}>
                    <Item elevation={3}>
                      <CustomMenuTree title={"Locations"}  menuTreeItems={locations} orderField={'order_id'} numberOfItems={'single'} selectedItem={updateParentUid} selectLevels={[]} defaultSelected={[formik.values.parent]}  />
                    </Item>
                  </Grid>

                </Grid>
                <Stack direction="row" spacing={2}>
                  <ThemeProvider theme={themeCustom}>
                    <Button type="submit" variant="contained" color="custom_black" onClick={() => navigate("/master-data-registry/locations")}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="contained" color="custom_green">
                      Save
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
export default NewLocation;
