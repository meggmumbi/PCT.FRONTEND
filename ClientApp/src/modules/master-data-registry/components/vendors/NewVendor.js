import React, { useEffect } from "react";
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
  Divider,
} from "@mui/material";
import { spacing } from "@mui/system";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getCategoryByGroupId } from "../../apis/category";
import { getUnitsByGroup } from "../../apis/unit";
import { getVendorById, newVendor, updateVendor } from "../../apis/vendor";
import Paper from "@mui/material/Paper";
import { getLocations } from "../../apis/location";
import { useState } from "react";
import CustomMenuTree from "../../../../components/MenuTree/CustomMenuTree";
import MenuItem from "@mui/material/MenuItem";
import VendorServicesAccordion from "./VendorServicesAccordion";
import _ from 'lodash';

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

const NewVendor = () => {
  const [locations, setLocations] = useState([]);
  const [services, setServices] = useState([]);
  const [expanded, setExpanded] = React.useState(false);
  const navigate = useNavigate();
  let { id } = useParams();

  const {
    data,
    isLoading,
    isError
  } = useQuery(["getVendorById", id], getVendorById, {
    enabled: !!id,
  });
  const {
    data: categories,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
  } = useQuery(["getCategoryByGroupId", 3], getCategoryByGroupId,
    {
      onSuccess: (response) => {
        let temp = [];
        response.data.forEach(i => {
          temp.push({
            id: i.id,
            name: i.name,
            parent_id: null
          });
        })
        setServices(temp);
      }
    }
  );


  const {
    data: units,
    isLoading: isLoadingUnits,
    isError: isErrorUnits,
  } = useQuery(["getUnitsByGroup", 3], getUnitsByGroup);
  const mutation = useMutation({ mutationFn: newVendor });
  const updateMutation = useMutation({ mutationFn: updateVendor });


  const {
    isLoadings,
    isErrors
  } = useQuery(["getLocationsList"], getLocations,
    {
      onSuccess: (response) => {
        let temp = [];
        response.data.forEach(i => {
          temp.push({
            id: i.id,
            name: i.name,
            parent_id: i.parent
          });
        })
        setLocations(temp);
      }
    }
  );


  const formik = useFormik({
    initialValues: {
      vendorName: "",
      vendorCode: "",
      vendorCategory: "",
      vendorAddress: "",
      vendorContact: "",
      vendorServices: [],
      vendorServiceLocations: []
    },
    validationSchema: Yup.object().shape({
      vendorName: Yup.string().required("Required"),
      vendorCode: Yup.string().required("Required"),
      vendorCategory: Yup.string().required("Required"),
      vendorAddress: Yup.string().required("Required"),
      vendorContact: Yup.string().required("Required"),
      vendorServices: Yup.array().required("Required"),
      vendorServiceLocations: Yup.array().required("Required")

    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        if (id) {
          values.id = id;
          await updateMutation.mutateAsync(values);
        } else {
          await mutation.mutateAsync(values);
        }
        toast("Successfully Created a Vendor", {
          type: "success",
        });
        navigate("/master-data-registry/vendors");
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
          vendorName: data.data.vendorName,
          vendorCode: data.data.vendorCode,
          vendorCategory: data.data.vendorCategory,
          vendorAddress: data.data.vendorAddress,
          vendorContact: data.data.vendorContact,
          vendorServices: data.data.vendorServices,
          vendorServiceLocations: data.data.vendorServiceLocations

        });
      }
    }
    setCurrentFormValues();
  }, [isLoading, isError, data]);

  const updateLocations = (serviceId, items) => {
    //Remove to ensure no duplicate services
    _.remove(formik.values.vendorServiceLocations, { service: serviceId });
    formik.values.vendorServiceLocations.push(...items)
    formik.setFieldValue('vendorServiceLocations', formik.values.vendorServiceLocations);
  }

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // const updateServices = (locationId, items) => {
  //   //Remove to ensure no duplicate services
  //   _.remove(formik.values.vendorServices, { location: locationId });
  //   formik.values.vendorServices.push(...items)
  //   formik.setFieldValue('vendorServices', formik.values.vendorServices);
  // }

  const updateServices = (items) => {
    //Remove to ensure no duplicate services
    formik.setFieldValue('vendorServices', items.length === 0 ? [] : items);

    //Remove all services if a loction is unselected
    _.difference(_.uniq(_.map(services, 'id')), items).map(diff => {
      _.remove(formik.values.vendorServiceLocations, { service: diff });
      formik.setFieldValue('vendorServiceLocation', formik.values.vendorServiceLocations);
    })

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
                <Grid container sx={{ marginBottom: '0.3rem' }}>
                  <Grid item md={12}>
                    <Item elevation={3}>
                      <Typography variant="h2" gutterBottom display="inline" sx={{ display: 'flex', color: "#595959" }}>
                        Vendor
                      </Typography>

                    </Item>
                  </Grid>
                </Grid>
                <Grid container spacing={2} mb={2}>
                  <Grid item md={6}>
                    <Item elevation={3} sx={{ minHeight: '40rem' }}>


                      <Grid item md={12} sx={{ display: "flex", justifyContent: "left", alignItems: 'center' }}>
                        <InputLabel sx={{ marginRight: '10px', display: "flex", justifyContent: "right", alignItems: 'center', fontWeight: 700, width: '10rem', fontSize: '1rem', color: '#595959', }} >
                          Name
                        </InputLabel>
                        <TextField name="vendorName" label="Name" value={formik.values.vendorName} error={Boolean(formik.touched.vendorName && formik.errors.vendorName)} fullWidth helperText={formik.touched.vendorName && formik.errors.vendorName} onBlur={formik.handleBlur} onChange={formik.handleChange} variant="outlined" my={2} />
                      </Grid>

                      <Grid item md={12} sx={{ display: "flex", justifyContent: "left", alignItems: 'center' }}>
                        <InputLabel sx={{ marginRight: '10px', display: "flex", justifyContent: "right", alignItems: 'center', fontWeight: 700, width: '10rem', fontSize: '1rem', color: '#595959', }} >
                          Code
                        </InputLabel>
                        <TextField name="vendorCode" label="Code" value={formik.values.vendorCode} error={Boolean(formik.touched.vendorCode && formik.errors.vendorCode)} fullWidth helperText={formik.touched.vendorCode && formik.errors.vendorCode} onBlur={formik.handleBlur} onChange={formik.handleChange} variant="outlined" />
                      </Grid>

                      <Grid item md={12} sx={{ display: "flex", justifyContent: "left", alignItems: 'center' }}>
                        <InputLabel sx={{ marginRight: '10px', display: "flex", justifyContent: "right", alignItems: 'center', fontWeight: 700, width: '10rem', fontSize: '1rem', color: '#595959', }} >
                          Category
                        </InputLabel>
                        <TextField name="vendorCategory" label="Category" select value={formik.values.category} error={Boolean(formik.touched.vendorCategory && formik.errors.vendorCategory)} helperText={formik.touched.vendorCategory && formik.errors.vendorCategory} onBlur={formik.handleBlur} onChange={formik.handleChange} variant="outlined" fullWidth my={2}
                        >
                          <MenuItem disabled value="">
                            Select  Category
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

                      <Grid item md={12} sx={{ display: "flex", justifyContent: "left", alignItems: 'center' }}>
                        <InputLabel sx={{ marginRight: '10px', display: "flex", justifyContent: "right", alignItems: 'center', fontWeight: 700, width: '10rem', fontSize: '1rem', color: '#595959' }} >
                          Address
                        </InputLabel>
                        <TextField name="vendorName" label="Name" value={formik.values.vendorAddress} error={Boolean(formik.touched.vendorAddress && formik.errors.vendorAddress)} fullWidth helperText={formik.touched.vendorAddress && formik.errors.vendorAddress} onBlur={formik.handleBlur} onChange={formik.handleChange} multiline variant="outlined" rows={3} my={2} />
                      </Grid>

                      <Grid item md={12} sx={{ display: "flex", justifyContent: "left", alignItems: 'center' }}>
                        <InputLabel sx={{ textAlign: 'right', whiteSpace: 'normal !important', marginRight: '10px', display: "flex", justifyContent: "right", alignItems: 'center', fontWeight: 700, width: '10rem', fontSize: '1rem', color: '#595959' }} >
                          Contact Information
                        </InputLabel>
                        <TextField name="vendorName" label="Name" value={formik.values.vendorContact} error={Boolean(formik.touched.vendorContact && formik.errors.vendorContact)} fullWidth helperText={formik.touched.vendorContact && formik.errors.vendorContact} onBlur={formik.handleBlur} onChange={formik.handleChange} multiline variant="outlined" rows={3} my={2} />
                      </Grid>

                      <Grid item md={12}>
                        <CustomMenuTree
                          bgColor="#595959"
                          title={"Services"}
                          menuTreeItems={services}
                          orderField={'order_id'}
                          selectedItem={updateServices}
                          selectLevels={[]}
                          defaultSelected={formik.values.vendorServices}
                          numberOfItems={'multi'}
                        />

                        {/* 
                        <CustomMenuTree
                          bgColor="#595959"
                          title={"Locations"}
                          menuTreeItems={locations}
                          orderField={'order_id'}
                          numberOfItems={'multi'}
                          selectedItem={updateLocations}
                          selectLevels={[]}
                          defaultSelected={formik.values.vendorLocations}
                        /> */}
                      </Grid>


                    </Item>
                  </Grid>
                  <Grid item md={6}>
                    <Item elevation={3} sx={{ minHeight: '40rem' }}>

                      {formik.values.vendorServices.map(site => (
                        <VendorServicesAccordion
                          service={_.find(services, { id: site })}
                          expanded={expanded}
                          handleAccordionChange={handleAccordionChange}
                          action={updateServices}
                          values={_.map(_.filter(formik.values.vendorServices, { service: site }), 'service')}
                        />
                      ))}
                    </Item>
                  </Grid>
                </Grid>

                <Stack direction="row" spacing={2}>
                  <ThemeProvider theme={themeCustom}>
                    <Button type="submit" variant="contained" color="custom_black" onClick={() => navigate("/master-data-registry/vendors")}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="contained" color="custom_green">
                      Submit
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
export default NewVendor;
