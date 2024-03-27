import React, { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import { SiteContext } from "../../../index";
import CardContent from "@mui/material/CardContent";
import { useFormik } from "formik";
import {
  Button,
  CircularProgress,
  Collapse,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  assignRolePermissions,
  getMenus,
  getRolePermissionsByRoleId,
} from "../apis/analytics";
import Checkbox from "@mui/material/Checkbox";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { getTenant } from "../apis/mis-administration";
import * as yup from "yup";

const RolePermissions = () => {
  const siteContext = useContext(SiteContext);
  const selectedSite = siteContext.selectedSite;
  const [openMap, setOpenMap] = useState({});
  const [appRoleId, setAppRoleId] = useState();

  const handleClick = (id) => {
    setOpenMap({
      ...openMap,
      [id]: !openMap[id],
    });
  };

  const mutation = useMutation({ mutationFn: assignRolePermissions });
  const {
    isLoading: isLoadingTenant,
    isError: isErrorTenant,
    data: tenantData,
  } = useQuery(["getTenant", selectedSite.id], getTenant, {
    enabled: !!selectedSite.id,
  });

  const {
    isLoading: isLoadingRolePermissions,
    isError: isErrorRolePermissions,
    data: rolePermissions,
  } = useQuery(
    ["getRolePermissionsByRoleId", appRoleId],
    getRolePermissionsByRoleId,
    {
      enabled: !!appRoleId,
    }
  );
  const { isLoading, isError, data } = useQuery(
    ["getMenus", selectedSite.id],
    getMenus,
    {
      enabled: !!selectedSite.id,
    }
  );

  const topLevelCategories =
    !isLoading && !isError
      ? data.data.filter((category) => !category.parent)
      : [];
  const formik = useFormik({
    initialValues: {
      appRoleId: "",
      permissions: {},
    },
    validationSchema: yup.object().shape({
      appRoleId: yup.string().required("Required"),
      permissions: yup
        .object()
        .required("Please select at least one permission."),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);
        // Extract the permissions object from values
        const permissions = values.permissions;
        // Get an array of keys with true values from the permissions object
        const trueKeys = Object.keys(permissions).filter(
          (key) => permissions[key] === true
        );
        const Indata = {
          appRoleId: appRoleId,
          assignedRoutes: trueKeys,
        };
        await mutation.mutateAsync(Indata);
        setSubmitting(false);
      } catch (error) {
        console.log(error);
      }
    },
  });

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    formik.setFieldValue(`permissions.${name}`, checked);
  };

  useEffect(() => {
    function setCurrentFormValues() {
      if (rolePermissions) {
        formik.setFieldValue("permissions", {});
        rolePermissions.data.map((perm) => {
          formik.setFieldValue(`permissions.${perm}`, true);
        });
      }
    }
    setCurrentFormValues();
  }, [isLoadingRolePermissions, isErrorRolePermissions, rolePermissions]);

  const renderCategory = (category, level = 0) => {
    const isOpen = openMap[category.id];
    const hasChildren = data.data.some((c) => c.parent === category.id);

    return (
      <React.Fragment key={category.id}>
        <ListItem
          button
          onClick={() => handleClick(category.id)}
          style={{ paddingLeft: `${level * 2}rem` }}
        >
          {!hasChildren && (
            <Checkbox
              name={category.id}
              checked={formik.values.permissions[category.id] || false}
              onChange={handleCheckboxChange}
              edge="start"
              tabIndex={-1}
              disableRipple
            />
          )}
          <ListItemText primary={category.name} />
          {hasChild(category.id) && (isOpen ? <ExpandLess /> : <ExpandMore />)}
        </ListItem>
        {hasChild(category.id) && (
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {data.data
                .filter((c) => c.parent === category.id)
                .map((child) => renderCategory(child, level + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  const hasChild = (id) => {
    return data.data.some((c) => c.parent === id);
  };

  const handleRoleChange = (val) => {
    setAppRoleId(val);
  };

  return (
    <Box>
      <Paper square={true} sx={{ borderTop: 5 }} elevation={8}>
        <Card mb={6} square={true}>
          <CardContent>
            <form onSubmit={formik.handleSubmit}>
              {formik.isSubmitting ? (
                <Box display="flex" justifyContent="center" my={6}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  <Grid container spacing={12}>
                    <Grid item md={12}>
                      <Typography variant="h3" gutterBottom display="inline">
                        ROLE ADMINISTRATION
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container spacing={6}>
                    <Grid item md={6}>
                      <TextField
                        label="Tenant Roles"
                        name="appRoleId"
                        select
                        fullWidth
                        variant="outlined"
                        value={formik.values.appRoleId}
                        error={Boolean(
                          formik.touched.appRoleId && formik.errors.appRoleId
                        )}
                        helperText={
                          formik.touched.appRoleId && formik.errors.appRoleId
                        }
                        onBlur={formik.handleBlur}
                        onChange={(e) => {
                          // formik.handleChange(e);
                          formik.setFieldValue("appRoleId", e.target.value);
                          handleRoleChange(e.target.value);
                        }}
                        my={2}
                      >
                        <MenuItem disabled value="">
                          Select Tenant Role
                        </MenuItem>
                        {!isLoadingTenant && !isErrorTenant
                          ? tenantData.data.roles.map((option) => (
                              <MenuItem key={option.id} value={option.id}>
                                {option.name}
                              </MenuItem>
                            ))
                          : []}
                      </TextField>
                    </Grid>
                  </Grid>
                  <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                    <List>
                      {topLevelCategories.map((category) =>
                        renderCategory(category)
                      )}
                    </List>
                  </Box>
                  <Grid container spacing={2} mt={5}>
                    <Grid item md={3}>
                      <Button variant="contained" type="submit">
                        Submit
                      </Button>
                    </Grid>
                  </Grid>
                </>
              )}
            </form>
          </CardContent>
        </Card>
      </Paper>
    </Box>
  );
};
export default RolePermissions;
