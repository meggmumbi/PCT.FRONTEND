import React from "react";
import { Box, Card as MuiCard, CardContent, CardMedia, Grid, Paper, Typography } from "@mui/material";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import EastIcon from '@mui/icons-material/East';
import FinanceAdministration from "../../../common/vendor/finance-administration.png";
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
const FinanceAndAdministration = () => {
    return (
        <React.Fragment>
            <StyledNavLink to={`#`} >
                <Card sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', height: 90, backgroundColor: "#333333" }}>
                    <CardContent>
                        <Typography variant="body2" sx={{ fontSize: 18, textAlign: 'center', color: 'white' }}>
                            Management & Administration
                        </Typography>
                    </CardContent>
                </Card>
            </StyledNavLink>
        </React.Fragment>
    );
};
export default FinanceAndAdministration;

