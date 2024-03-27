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
import styled from "@emotion/styled";
import {spacing} from "@mui/system";
import {NavLink} from "react-router-dom";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import LineChart from "../../../common/charts/Chartjs/LineChart";
import {useQuery} from "@tanstack/react-query";
import {getDashboardStatistics} from "../apis/dashboard";

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);

const MasterDataRegistry = () => {
  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));

  const {
    data,
    isLoading,
    isError,
  } = useQuery(["getDashboardStatistics"], getDashboardStatistics);

  if (isLoading) {
    return `...loading`;
  }

  if (isError) {
    return `...error`;
  }

  return (
    <React.Fragment>
      <Helmet title="Master Data Registry: Home" />
      <Grid container spacing={2} alignItems="stretch" p={isLgUp ? 5 : 1}>
        <Grid item md={12}>
          <Breadcrumbs aria-label="Breadcrumb" mt={2}>
            <Link component={NavLink} to={""}>
              Master Data Registry mew
            </Link>
            <Typography>Home</Typography>
          </Breadcrumbs>
        </Grid>
        <Grid item sx={{ marginTop: 10 }} md={12}>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} alignItems="stretch">
              <Grid item xs>
                <Card sx={{ height:90 }}>
                  <CardContent>
                    <Typography variant="body2" sx={{ fontSize: 18, textAlign: 'center' }}>
                      NUMBER OF RECORDS
                    </Typography>
                    <Typography variant="h5" component="div" sx={{ fontSize: 18, textAlign: 'center' }}>
                      {data.data.allRecords}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs>
                <Card sx={{ height:90 }} style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
                  <CardContent>
                    <Typography sx={{ fontSize: 18, textAlign: 'center' }}>
                      NUMBER OF CATALOGUES
                    </Typography>
                    <Typography variant="h5" component="div" sx={{ fontSize: 18, textAlign: 'center' }}>
                      {data.data.approved}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs>
                <Card sx={{ height:90, backgroundColor: "#23A295" }} style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
                  <CardContent>
                    <Typography sx={{ fontSize: 18, textAlign: 'center', color:'white' }}>
                      PENDING APPROVAL
                    </Typography>
                    <Typography variant="h5" component="div" sx={{ fontSize: 18, textAlign: 'center', color:'white' }}>
                      {data.data.pending}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs>
                <Card sx={{ height:90, backgroundColor: "#8D6E97" }} style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div" sx={{ fontSize: 18, textAlign: 'center', color:'white' }}>
                      REJECTED
                    </Typography>
                    <Typography variant="h5" component="div" sx={{ fontSize: 18, textAlign: 'center', color:'white' }}>
                      {data.data.rejected}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item md={12}>
          <Card>
            <LineChart />
          </Card>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
export default MasterDataRegistry;
