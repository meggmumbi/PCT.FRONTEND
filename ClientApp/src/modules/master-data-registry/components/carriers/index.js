import React from "react";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Divider as MuiDivider,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import { NavLink } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import CarriersDataTable from "./CarriersDataTable";

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const Carriers = () => {
  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));

  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <React.Fragment>
      <Helmet title="Master Data Registry: Carriers" />
      <Grid container spacing={2} alignItems="stretch" p={isLgUp ? 5 : 1}>
        <Grid item md={12}>
          <Breadcrumbs aria-label="Breadcrumb" mt={2}>
            <Link component={NavLink} to={"/master-data-registry"}>
              Master Data Registry
            </Link>
            <Typography>Carriers</Typography>
          </Breadcrumbs>
        </Grid>
        <Grid item md={12}>
          <CarriersDataTable />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
export default Carriers;
