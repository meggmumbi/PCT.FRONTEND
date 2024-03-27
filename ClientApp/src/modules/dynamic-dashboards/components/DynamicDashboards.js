import React from "react";
import {
  Box,
  Card as MuiCard,
  CardContent,
  CardMedia,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import EastIcon from "@mui/icons-material/East";
import SupplyChainAnalytics from "../../../common/vendor/supply-chain-analytics.png";
import { NavLink, useNavigate } from "react-router-dom";

const Card = styled(MuiCard)(spacing);

const StyledNavLink = styled(NavLink)(({ theme }) => ({
  color: "inherit",
  textDecoration: "none",
  "&:hover": {
    color: "white",
  },
  width: "100%",
}));

const DynamicDashboards = () => {
  const navigate = useNavigate();

  return (

    <React.Fragment>
      <StyledNavLink to={`/analytics`} >
        <Card sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', height: 90, backgroundColor: "#333333" }}>
          <CardContent>
            <Typography variant="body2" sx={{ fontSize: 18, textAlign: 'center', color: 'white' }}>
              Supply Chain Analytics
            </Typography>
          </CardContent>
        </Card>
      </StyledNavLink>
    </React.Fragment>


    // <Card sx={{ display: 'flex', border: '1px solid #185c37', width: '80%', height: '100%', cursor: 'pointer' }} onClick={() => navigate(`/analytics`)}>
    //   <CardMedia
    //     component="img"
    //     sx={{ width: 120, color: '#fff', bgcolor: "#185c37", fontSize: '5rem', textAlign: 'center', justifyContent: 'center', alignItems: 'center', display: 'flex' }}
    //     alt={"D".charAt(0)}
    //   />
    //   <Box sx={{ display: 'flex', flexDirection: 'column', p: '1rem' }}>
    //     <CardContent>
    //       <Typography component="div" variant="h4">
    //         Supply Chain Analytics
    //       </Typography>
    //       <Typography
    //         variant="subtitle1"
    //         color="text.secondary"
    //         component="div"
    //       >
    //         Version 2.0
    //       </Typography>
    //     </CardContent>
    //   </Box>
    // </Card>
  );
};
export default DynamicDashboards;
