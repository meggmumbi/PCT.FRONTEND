import React from "react";
import styled from "@emotion/styled";
import {
  Box,
  Card as MuiCard,
  CardContent as MuiCardContent, CardMedia,
  Divider as MuiDivider,
  Grid, Paper, Typography,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import {spacing} from "@mui/system";
import FirstImg from "../../vendor/illustration-store.png";
import {NavLink} from "react-router-dom";
import { useTranslation } from 'react-i18next';
const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Spacer = styled.div(spacing);

const Store = () => {
  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const { t } = useTranslation();
  return (
    <React.Fragment>
      <Paper square={true} sx={{ width: "100%" }}>
        <CardMedia
          component="img"
          sx={{ height: 220, objectFit: "fill" }}
          image={FirstImg}
        />
      </Paper>
      <Grid container spacing={2} alignItems="stretch" p={isLgUp ? 12 : 5}>
        <Grid item md={4}  xs={4} px={5}>
          <Paper square={true} sx={{ borderTop: 5, borderColor: "#FFB500" }} style={{height:'100%'}} elevation={8}>
            <Card>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {t('Inventory Monitoring')}
                </Typography>
                <Divider />
                <Spacer mb={4} />
                <Box px={4} my={3} sx={{ fontSize: 17, color: "#333333" }}>
                  <Grid container spacing={6}>
                    <Grid item md={12}>
                      <NavLink to={`/store/inventory-analysis`}>
                        {t('Global Inventory')}
                      </NavLink>
                      <Divider />
                    </Grid>
                    <Grid item md={12}>
                      <NavLink to={`/store/inventory-analysis`}>
                        {t('Country Inventory')}
                      </NavLink>
                      <Divider />
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Paper>
        </Grid>
        <Grid item md={4}  xs={4} px={5}>
          <Paper square={true} sx={{ borderTop: 5, borderColor: "#FFB500" }} style={{height:'100%'}} elevation={8}>
            <Card>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {t('Temperature Monitoring')}
                </Typography>
                <Divider />
                <Spacer mb={4} />
                <Box px={4} my={3} sx={{ fontSize: 17, color: "#333333" }}>
                  <Grid container spacing={6}>
                    <Grid item md={12}>
                      <NavLink to={`/store/parsyl`}>
                        {t('Global Temperature Monitoring')}
                      </NavLink>
                      <Divider />
                    </Grid>
                    <Grid item md={12}>
                      <NavLink to={`/store/parsyl`}>
                        {t('Country Temperature Monitoring')}
                      </NavLink>
                      <Divider />
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Paper>
        </Grid>
        <Grid item md={4}  xs={4} px={5}>
          <Paper square={true} sx={{ borderTop: 5, borderColor: "#FFB500" }} style={{height:'100%'}} elevation={8}>
            <Card>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {t('Insurance')}
                </Typography>
                <Divider />
                <Spacer mb={4} />
                <Box px={4} my={3} sx={{ fontSize: 17, color: "#333333" }}>
                  <Grid container spacing={6}>
                    <Grid item md={12}>
                      <NavLink to={`/store/insurance-requirements`}>
                        {t('Insurance Requirements')}
                      </NavLink>
                      <Divider />
                    </Grid>
                    <Grid item md={12}>
                      <NavLink to={`/store/insurance-monitoring`}>
                        {t('Insurance Monitoring and Alerts')}
                      </NavLink>
                      <Divider />
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Paper>
        </Grid>

        <Grid item md={4}  xs={4} px={5} sx={{marginTop:10}}>
          <Paper square={true} sx={{ borderTop: 5, borderColor: "#FFB500" }} style={{height:'100%'}} elevation={8}>
            <Card>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {t('3PL Performance')}
                </Typography>
                <Divider />
                <Spacer mb={4} />
                <Box px={4} my={3} sx={{ fontSize: 17, color: "#333333" }}>
                  <Grid container spacing={6}>
                    <Grid item md={12}>
                      <NavLink to={`/store/vendor-score-card`}>Vendor Score Card</NavLink>
                      <Divider />
                    </Grid>
                    <Grid item md={12}>
                      <a href="#">
                        {t('Corrective Action Reports')}
                      </a>
                      <Divider />
                    </Grid>
                    <Grid item md={12}>
                      <a href="#">
                        {t('Vendor Self Inspection Reports')}
                      </a>
                      <Divider />
                    </Grid>
                    <Grid item md={12}>
                      <a href="#">
                        {t('Annual Site Visit Reports')}
                      </a>
                      <Divider />
                    </Grid>
                    <Grid item md={12}>
                      <a href="#">
                        {t('Quarterly Reviews')}
                      </a>
                      <Divider />
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
export default Store;