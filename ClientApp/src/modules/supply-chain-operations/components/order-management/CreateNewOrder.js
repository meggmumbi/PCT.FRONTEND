import React from "react";
import {Helmet} from "react-helmet-async";
import {Box, Breadcrumbs, Card, CardContent, Divider, Link, Paper, Typography} from "@mui/material";
import {NavLink} from "react-router-dom";
import ProductsTileTable from "./ProductsTileTable";

const CreateNewOrder = () => {
  return (
      <React.Fragment>
          <Helmet title="Create New Order" />
          <Breadcrumbs aria-label="Breadcrumb" mt={2} gutterBottom>
              <Link component={NavLink} to="/">
                  PCT
              </Link>
              <Link component={NavLink} to="/">
                  Supply Chain Operations
              </Link>
              <Link component={NavLink} to="/">
                  Home
              </Link>
              <Typography>Create New Order</Typography>
          </Breadcrumbs>
          <Box mt={4}>
              <Paper square={true} sx={{ borderTop: 5 }} elevation={8}>
                  <Card>
                      <CardContent>
                          <Typography gutterBottom variant="h5" component="div">
                              Create New Orders
                          </Typography>
                          <Divider />
                      </CardContent>
                  </Card>
              </Paper>
          </Box>
          <ProductsTileTable />
      </React.Fragment>
  );
};
export default CreateNewOrder;
