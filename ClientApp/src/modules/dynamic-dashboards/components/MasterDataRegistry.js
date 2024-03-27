import React from "react";
import { Box, Card as MuiCard, CardContent, CardMedia, Grid, Paper, Typography } from "@mui/material";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import EastIcon from '@mui/icons-material/East';
import MasterData from "../../../common/vendor/master-data.png";
import { NavLink, useNavigate } from "react-router-dom";

const Card = styled(MuiCard)(spacing);

const StyledNavLink = styled(NavLink)(({ theme }) => ({
    color: 'inherit',
    textDecoration: 'none',
    '&:hover': {
        color: 'white',
    },
    width: '100%'
}));

const MasterDataRegistry = () => {
    const navigate = useNavigate();

    return (

        <React.Fragment>
            <StyledNavLink to={`/master-data-registry`} >
                <Card sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', height: 90, backgroundColor: "#333333" }}>
                    <CardContent>
                        <Typography variant="body2" sx={{ fontSize: 18, textAlign: 'center', color: 'white' }}>
                            Master Data Registry
                        </Typography>
                    </CardContent>
                </Card>
            </StyledNavLink>
        </React.Fragment>

        // <Card sx={{ display: 'flex', border: '1px solid #185c37', width: '80%', height: '100%', cursor: 'pointer' }} onClick={() => navigate(`/master-data-registry`)}>
        //     <CardMedia
        //         component="img"
        //         sx={{ width: 120, color: '#fff', bgcolor: "#185c37", fontSize: '5rem', textAlign: 'center', justifyContent: 'center', alignItems: 'center', display: 'flex' }}
        //         alt={"M".charAt(0)}
        //     />
        //     <Box sx={{ display: 'flex', flexDirection: 'column', p: '1rem' }}>
        //         <CardContent>
        //             <Typography component="div" variant="h4">
        //                 Master Data Registry
        //             </Typography>
        //             <Typography
        //                 variant="subtitle1"
        //                 color="text.secondary"
        //                 component="div"
        //             >
        //                 Version 2.0
        //             </Typography>
        //         </CardContent>
        //     </Box>
        // </Card>


        // {/* <React.Fragment>
        //     <StyledNavLink to={`#`} >
        //         <Card sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', height: 90, backgroundColor: "#333333" }}>
        //             <CardContent>
        //                 <Typography variant="body2" sx={{ fontSize: 18, textAlign: 'center', color: 'white' }}>
        //                     Master Data Registry
        //                 </Typography>
        //             </CardContent>
        //         </Card>
        //     </StyledNavLink>
        // </React.Fragment> */}



        /*<React.Fragment>
            <Box>
                <Paper square={true} sx={{ borderTop: 5, height: '19rem' }} elevation={8}>
                    <Card>
                        <CardContent>
                            <StyledNavLink to={`/master-data-registry/`}>
                                <Grid container alignItems="center" justifyContent="center" spacing={2}>
                                    <Grid item xs={12} align="center" justify="center">
                                        <Paper sx={{ width: "40%" }}>
                                            <CardMedia
                                                component="img"
                                                sx={{ objectFit: "fill" }}
                                                image={MasterData}
                                            />
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} align="center" justify="center">
                                        <Typography variant="h4" component="h4">
                                            Master Data Registry
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
};
export default MasterDataRegistry;


