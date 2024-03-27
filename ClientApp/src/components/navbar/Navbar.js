import React, { useContext } from "react";
import styled from "@emotion/styled";
import { withTheme } from "@emotion/react";
import {
  Grid,
  AppBar as MuiAppBar,
  IconButton as MuiIconButton,
  Toolbar, Typography,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import NavbarUserDropdown from "./NavbarUserDropdown";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import SitesSelect from "../../modules/pct-core/components/SitesSelect";
import { SiteContext } from "../../index";

const AppBar = styled(MuiAppBar)`
  background: ${(props) => props.theme.header.background};
  color: ${(props) => props.theme.header.color};
`;

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;

const Navbar = ({ onDrawerToggle }) => {
  const siteContext = useContext(SiteContext);
  const selectedSite = siteContext.selectedSite;
  const location = useLocation();

  const RouteSpecificBreadCrumbs = (props) => {
    const { currentPath } = props;
    let requisitionSteps = [
      '/psa/requisition-order-list',
      '/psa/requisition-order-general-details',
      '/psa/requisition-product-list',
      '/psa/requisition-order-cart',
      '/psa/requisition-product-detail-page'
    ];

    return (
      requisitionSteps.includes(currentPath) &&
      (<>
        <Grid item>
          <Link to={'/psa/requisition-order-general-details'} variant="button" display="block" gutterBottom>General Details </Link>
        </Grid>
        <Grid item>
          <Link to={'/psa/requisition-product-list'} variant="button" display="block" gutterBottom>Products List</Link>
        </Grid>
        <Grid item>
          <Link to={'/psa/requisition-order-cart'} variant="button" display="block" gutterBottom>Cart Details</Link>
        </Grid>
      </>)
    )
  }

  return (
    <React.Fragment>
      <AppBar position="sticky" elevation={0}>
        <Toolbar>
          <Grid container alignItems="center" spacing={6}>
            <Grid item sx={{ display: { xs: "block", md: "none" } }}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={onDrawerToggle}
                size="large"
              >
                <MenuIcon />
              </IconButton>
            </Grid>
            <RouteSpecificBreadCrumbs currentPath={location.pathname} />
            <Grid item xs />
            <Grid item>
              {<Typography sx={{ fontWeight: 'bold', fontSize: '16px', color: '#575757' }}>{selectedSite ? selectedSite.name : ''}</Typography>}
            </Grid>
            <Grid item>
              <SitesSelect />
              <NavbarUserDropdown />
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default withTheme(Navbar);
