import React from "react";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import styled from "@emotion/styled";
import {spacing} from "@mui/system";
import {NavLink} from "react-router-dom";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import ProductsDataTable from "./ProductsDataTable";
import ProductOverview from "./ProductOverview";
import ProductOccurrence from "./ProductOccurrence";
import ProductDataQuality from "./ProductDataQuality";

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const Products = () => {
  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));

  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <React.Fragment>
      <Helmet title="Master Data Registry: Product" />
      <Grid container spacing={2} alignItems="stretch" p={isLgUp ? 5 : 1}>
        <Grid item md={12}>
          <Breadcrumbs aria-label="Breadcrumb" mt={2}>
            <Link component={NavLink} to={"/master-data-registry"}>
              Master Data Registry
            </Link>
            <Typography>Product</Typography>
          </Breadcrumbs>
        </Grid>
        <Grid item md={12}>
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <ProductsDataTable />
{/*            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                  <Tab label="OVERVIEW" value="1" />
                  <Tab label="DATA STORE" value="2" />
                  <Tab label="OCCURRENCE" value="5" />
                  <Tab label="DATA QUALITY" value="6" />
                  <Tab label="RELATIONSHIPS" value="7" />
                  <Tab label="HISTORY" value="8" />
                  <Tab label="ACCESS" value="9" />
                  <Tab label="SETTINGS" value="10" />
                  <Tab label="ADD PRODUCT DATA" value="11" />
                </TabList>
              </Box>
              <TabPanel value="1">
                <ProductOverview />
              </TabPanel>
              <TabPanel value="2">
                <ProductsDataTable />
              </TabPanel>
              <TabPanel value="5">
                <ProductOccurrence />
              </TabPanel>
              <TabPanel value="6">
                <ProductDataQuality />
              </TabPanel>
              <TabPanel value="7">Item Three</TabPanel>
              <TabPanel value="8">Item Three</TabPanel>
              <TabPanel value="9">Item Three</TabPanel>
              <TabPanel value="10">Item Three</TabPanel>
              <TabPanel value="11">Item Three</TabPanel>
            </TabContext>*/}
          </Box>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
export default Products;
