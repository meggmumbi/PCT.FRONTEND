import React from "react";
import { Box, Card as MuiCard, CardContent, CardMedia, Grid, Paper, Typography } from "@mui/material";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import EastIcon from '@mui/icons-material/East';
import ICLImage from "../../../common/vendor/Global-Fund-Spot-Check.png";
import SupplyChainAnalytics from "../../../common/vendor/supply-chain-analytics.png";

import { NavLink } from "react-router-dom";

const Card = styled(MuiCard)(spacing);

const StyledNavLink = styled(NavLink)(({ theme }) => ({
    color: 'inherit',
    textDecoration: 'none',
    '&:hover': {
        color: 'white',
    },
    width: '100%'
}));

function InCountryLogistics(props) {
    return (
        <React.Fragment>
            <StyledNavLink to={`/global-spot-check/about`} >
                <Card sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', height: 90, backgroundColor: "#333333" }}>
                    <CardContent>
                        <Typography variant="body2" sx={{ fontSize: 18, textAlign: 'center', color: 'white' }}>
                            Spot Check
                        </Typography>
                    </CardContent>
                </Card>
            </StyledNavLink>
        </React.Fragment>
        /*<React.Fragment>
            <Box>
                <Paper square={true} sx={{ borderTop: 5, height: '19rem' }} elevation={8}>
                    <Card>
                        <CardContent>
                            <StyledNavLink to={`/global-spot-check`}>
                                <Grid container alignItems="center" justifyContent="center" spacing={2}>
                                    <Grid item xs={12} align="center" justify="center">
                                        <Paper sx={{ width: "40%" }}>
                                            <CardMedia
                                                component="img"
                                                sx={{ objectFit: "fill" }}
                                                image={SupplyChainAnalytics}
                                            />
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} align="center" justify="center">
                                        <Typography variant="h4" component="h4">
                                            Spot Check
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} align="right" justify="right">
                                        <EastIcon />
                                    </Grid>
                                </Grid>
                            </StyledNavLink>
                        </CardContent>
                    </Card>
                </Paper>
            </Box>
        </React.Fragment>*/
    );
}

export default InCountryLogistics;
