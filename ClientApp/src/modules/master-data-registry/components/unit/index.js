import React from "react";
import {Helmet} from "react-helmet-async";
import styled from "@emotion/styled";
import {Breadcrumbs as MuiBreadcrumbs, Grid, Link, Typography} from "@mui/material";
import {spacing} from "@mui/system";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {NavLink} from "react-router-dom";
import UnitsDataTable from "./UnitsDataTable";

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const Unit = () => {
  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <React.Fragment>
      <Helmet title="Master Data Registry: Units" />
      <Grid container spacing={2} alignItems="stretch" p={isLgUp ? 5 : 1}>
        <Grid item md={12}>
          <Breadcrumbs aria-label="Breadcrumb" mt={2}>
            <Link component={NavLink} to={"/master-data-registry"}>
              Master Data Registry
            </Link>
            <Typography>Units</Typography>
          </Breadcrumbs>
          <Typography variant="h3" gutterBottom display="inline" sx={{ color: "#23A295;" }}>
            Master Data Registry
          </Typography>
          <Typography variant="body2" gutterBottom>
            Units
          </Typography>
        </Grid>
        <Grid item md={12}>
          <UnitsDataTable />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
export default Unit;
