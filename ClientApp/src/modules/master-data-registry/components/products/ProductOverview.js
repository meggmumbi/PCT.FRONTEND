import React, {useState} from "react";
import styled from "@emotion/styled";
import {
  Card as MuiCard,
  CardContent as MuiCardContent,
  CardHeader,
  Divider,
  Grid,
  Paper,
  Typography
} from "@mui/material";
import KeyIcon from '@mui/icons-material/Key';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TitleIcon from '@mui/icons-material/Title';
import {spacing} from "@mui/system";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);

const ProductOverview = () => {
  return (
    <React.Fragment>
      <Grid sx={{ flexGrow: 1 }} container spacing={2}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item md={6}>
              <Card mb={6} variant="outlined">
                <CardHeader title="Attributes" />
                <CardContent>
                  <Grid
                    container
                    spacing={12}
                  >
                    <Grid item md={12}>
                      <Typography  display="flex" alignItems="center" justifyContent="space-between">
                        <span>
                          <KeyIcon /> productid
                        </span>
                        <span>
                          <MoreVertIcon />
                        </span>
                      </Typography>
                      <Divider />
                    </Grid>
                    <Grid item md={12}>
                      <Typography  display="flex" alignItems="center" justifyContent="space-between">
                        <span>
                          <TitleIcon /> productname
                        </span>
                        <span>
                          <MoreVertIcon />
                        </span>
                      </Typography>
                      <Divider />
                    </Grid>
                    <Grid item md={12}>
                      <Typography  display="flex" alignItems="center" justifyContent="space-between">
                        <span>
                          <TitleIcon /> productcategory
                        </span>
                        <span>
                          <MoreVertIcon />
                        </span>
                      </Typography>
                      <Divider />
                    </Grid>
                    <Grid item md={12}>
                      <Typography  display="flex" alignItems="center" justifyContent="space-between">
                        <span>
                          <TitleIcon /> productunit
                        </span>
                        <span>
                          <MoreVertIcon />
                        </span>
                      </Typography>
                      <Divider />
                    </Grid>
                    <Grid item md={12}>
                      <Typography  display="flex" alignItems="center" justifyContent="space-between">
                        <span>
                          <TitleIcon /> productdescription
                        </span>
                        <span>
                          <MoreVertIcon />
                        </span>
                      </Typography>
                      <Divider />
                    </Grid>
                    <Grid item md={12}>
                      <Typography  display="flex" alignItems="center" justifyContent="space-between">
                        <span>
                          <TitleIcon /> productstatus
                        </span>
                        <span>
                          <MoreVertIcon />
                        </span>
                      </Typography>
                      <Divider />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item md={6}>
              <Card mb={6} variant="outlined">
                <CardHeader title="Summary" />
                <CardContent></CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
export default ProductOverview;