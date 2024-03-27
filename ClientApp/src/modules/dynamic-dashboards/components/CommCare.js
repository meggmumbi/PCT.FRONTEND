import React from "react";
import { Box, Card as MuiCard, CardContent, CardMedia, Grid, Paper, Typography } from "@mui/material";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import EastIcon from '@mui/icons-material/East';
import CommCareImage from "../../../common/vendor/commcare.png";
import { NavLink } from "react-router-dom";

const Card = styled(MuiCard)(spacing);

const StyledNavLink = styled(NavLink)(({ theme }) => ({
    color: 'inherit',
    textDecoration: 'none',
    '&:hover': {
        color: 'blue',
    },
}));

function CommCare(props) {
    return (
        <React.Fragment>
            <Box>
                <Paper square={true} sx={{ borderTop: 5, height: '19rem' }} elevation={8}>
                    <Card>
                        <CardContent>
                            <StyledNavLink to={`/commcare/`}>
                                <Grid container alignItems="center" justifyContent="center" spacing={2}>
                                    <Grid item xs={12} align="center" justify="center">
                                        <Paper sx={{ width: "40%" }}>
                                            <CardMedia
                                                component="img"
                                                sx={{ objectFit: "fill" }}
                                                image={CommCareImage}
                                            />
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} align="center" justify="center">
                                        <Typography variant="h4" component="h4">
                                            CommCare
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
        </React.Fragment>
    );
}

export default CommCare;
