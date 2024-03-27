import React from "react";
import {Helmet} from "react-helmet-async";
import styled from "@emotion/styled";
import {Breadcrumbs as MuiBreadcrumbs, Grid, Link, Typography} from "@mui/material";
import {spacing} from "@mui/system";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {NavLink} from "react-router-dom";
import LocationsDataTable from "./LocationsDataTable";

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const Locations = () => {
  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <React.Fragment>
      <Helmet title="Master Data Registry: Locations" />
      <Grid container spacing={2} alignItems="stretch" p={isLgUp ? 5 : 1}>
        <Grid item md={12}>
          <Breadcrumbs aria-label="Breadcrumb" mt={2}>
            <Link component={NavLink} to={"/master-data-registry"}>
              Master Data Registry
            </Link>
            <Typography>Location</Typography>
          </Breadcrumbs>
        </Grid>
        <Grid item md={12}>
          <LocationsDataTable />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
export default Locations;
