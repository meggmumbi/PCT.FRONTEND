import React from "react";
import { Helmet } from "react-helmet-async";
import {
  Breadcrumbs as MuiBreadcrumbs,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import styled from "@emotion/styled";
import {spacing} from "@mui/system";
import {NavLink} from "react-router-dom";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import VendorsDataTable from "./VendorsDataTable";

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const Vendors = () => {
  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));

  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <React.Fragment>
      <Helmet title="Master Data Registry: Vendors" />
      <Grid container spacing={2} alignItems="stretch" p={isLgUp ? 5 : 1}>
        <Grid item md={12}>
          <Breadcrumbs aria-label="Breadcrumb" mt={2}>
            <Link component={NavLink} to={"/master-data-registry"}>
              Master Data Registry
            </Link>
            <Typography>Vendors</Typography>
          </Breadcrumbs>
        </Grid>
        <Grid item md={12}>
          <VendorsDataTable />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
export default Vendors;
