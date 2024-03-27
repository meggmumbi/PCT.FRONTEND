import React, { useContext, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Paper,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import { MuiColorInput } from "mui-color-input";
import * as MuiIcon from "@mui/icons-material";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getCategoryById,
  getMenus,
  newMenu,
  updateMenu,
} from "../apis/analytics";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { SiteContext } from "../../../index";

// Create an array of all available MUI icons
const allMuiIcons = Object.keys(MuiIcon);

const NewMenuForm = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const [value, setValue] = React.useState("");
  const mutation = useMutation({ mutationFn: newMenu });
  const updateMutation = useMutation({ mutationFn: updateMenu });
  const siteContext = useContext(SiteContext);
  const selectedSite = siteContext.selectedSite;
  const { isLoading, isError, data } = useQuery(
    ["getMenus", selectedSite.id],
    getMenus
  );
  const {
    isLoading: isLoadingMenu,
    isError: isErrorMenu,
    data: MenuData,
  } = useQuery(["getCategoryById", id], getCategoryById, { enabled: !!id });

  const formik = useFormik({
    initialValues: {
      name: "",
      parent: "",
      url: "",
      icon: "",
      order: "",
      color: "",
    },
    onSubmit: async (values) => {
      try {
        const InData = {
          tenantId: selectedSite.id,
          name: values.name,
          parent: values.parent,
          url: values.url,
          icon: values.icon,
          color: values.color,
          order: values.order,
        };
        if (id) {
          values.menuId = id;
          await updateMutation.mutateAsync(values);
        } else {
          await mutation.mutateAsync(InData);
        }
        toast("Successfully Saved Menu", {
          type: "success",
        });
        navigate("/analytics/config");
      } catch (error) {
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });

  function rgbToHex(rgb) {
    const matches = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

    if (!matches) {
      throw new Error("Invalid RGB format");
    }

    const r = parseInt(matches[1]);
    const g = parseInt(matches[2]);
    const b = parseInt(matches[3]);

    const redHex = r.toString(16).padStart(2, "0");
    const greenHex = g.toString(16).padStart(2, "0");
    const blueHex = b.toString(16).padStart(2, "0");

    const hexColor = `#${redHex}${greenHex}${blueHex}`;

    return hexColor;
  }

  const handleChange = (newValue) => {
    formik.setFieldValue("color", rgbToHex(newValue));
    setValue(rgbToHex(newValue));
  };

  useEffect(() => {
    function setCurrentFormValues() {
      if (!isLoadingMenu && !isErrorMenu && MenuData) {
        formik.setValues({
          name: MenuData.data.name,
          parent: MenuData.data.parent,
          url: MenuData.data.url,
          icon: MenuData.data.icon,
          order: MenuData.data.menuOrder,
          color: MenuData.data.color,
        });
        setValue(MenuData.data.color);
      }
    }
    setCurrentFormValues();
  }, [isLoadingMenu, isErrorMenu, MenuData]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card mb={12}>
        <CardContent>
          {formik.isSubmitting ? (
            <Box display="flex" justifyContent="center" my={6}></Box>
          ) : (
            <>
              <Grid container spacing={12}>
                <Grid item md={12}>
                  <Box sx={{ typography: "body1", fontSize: 18 }}>
                    Create Menu
                  </Box>
                </Grid>
              </Grid>
              <Grid container spacing={6}>
                <Grid item md={12}>
                  <TextField
                    name="name"
                    label="Link Name"
                    value={formik.values.name}
                    error={Boolean(formik.touched.name && formik.errors.name)}
                    fullWidth
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  />
                </Grid>
                <Grid item md={12}>
                  <TextField
                    name="parent"
                    label="Parent"
                    select
                    value={formik.values.parent}
                    error={Boolean(
                      formik.touched.parent && formik.errors.parent
                    )}
                    fullWidth
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  >
                    <MenuItem disabled value=""></MenuItem>
                    {!isLoading && !isError
                      ? data.data.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name}
                          </MenuItem>
                        ))
                      : []}
                  </TextField>
                </Grid>
                <Grid item md={12}>
                  <TextField
                    name="url"
                    label="Power BI Url"
                    value={formik.values.url}
                    error={Boolean(formik.touched.url && formik.errors.url)}
                    fullWidth
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  ></TextField>
                </Grid>
                <Grid item md={12}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Icon</InputLabel>
                    <Select
                      name="icon"
                      label="Icon"
                      value={formik.values.icon}
                      error={Boolean(formik.touched.icon && formik.errors.icon)}
                      fullWidth
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      variant="outlined"
                      my={2}
                    >
                      <MenuItem disabled value="">
                        Select Icon
                      </MenuItem>
                      {/* Render MenuItem for each MUI icon */}
                      {allMuiIcons.map((iconName, index) => {
                        const Icon = MuiIcon[iconName];
                        return (
                          <MenuItem key={index} value={iconName}>
                            <Icon /> {iconName}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item md={12}>
                  <TextField
                    name="order"
                    label="Order"
                    value={formik.values.order}
                    error={Boolean(formik.touched.order && formik.errors.order)}
                    fullWidth
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  ></TextField>
                </Grid>
                <Grid item md={12}>
                  <MuiColorInput value={value} onChange={handleChange} />
                </Grid>
                <Grid item md={12}>
                  <Button
                    type="submit"
                    variant="container"
                    color="primary"
                    mt={3}
                  >
                    Save
                  </Button>
                </Grid>
              </Grid>
            </>
          )}
        </CardContent>
      </Card>
    </form>
  );
};
const NewMenu = () => {
  return (
    <React.Fragment>
      <Helmet title="New Menu" />
      <Divider />
      <Box>
        <Paper square={true} sx={{ borderTop: 5 }} elevation={8}>
          <NewMenuForm />
        </Paper>
      </Box>
    </React.Fragment>
  );
};
export default NewMenu;
