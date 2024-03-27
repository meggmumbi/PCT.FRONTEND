import React from "react";
import styled from "@emotion/styled";
import { Power } from "react-feather";
import {keycloakInstance} from "../../authConfig";

// import { useNavigate } from "react-router-dom";

import {
  Tooltip,
  Menu,
  MenuItem,
  IconButton as MuiIconButton,
} from "@mui/material";
//import {useMsal} from "@azure/msal-react";
import { useTranslation } from 'react-i18next';
// import useAuth from "../../hooks/useAuth";

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;

function NavbarUserDropdown() {
  const [anchorMenu, setAnchorMenu] = React.useState(null);
  // const navigate = useNavigate();
  // const { signOut } = useAuth();
  // const { instance, accounts } = useMsal();

  const toggleMenu = (event) => {
    setAnchorMenu(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorMenu(null);
  };

  const handleSignOut = async () => {    
    //await keycloak_logout(keycloakInstance.token);
    keycloakInstance.logout();

    //await instance.logoutRedirect({
    //  postLogoutRedirectUri: "/",
    //});
    // await signOut();
    // navigate("/auth/sign-in");
  };
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <Tooltip title="Account">
        <IconButton
          aria-owns={Boolean(anchorMenu) ? "menu-appbar" : undefined}
          aria-haspopup="true"
          onClick={toggleMenu}
          color="inherit"
          size="large"
        >
          <Power />
        </IconButton>
      </Tooltip>
      <Menu
        id="menu-appbar"
        anchorEl={anchorMenu}
        open={Boolean(anchorMenu)}
        onClose={closeMenu}
      >
        {/*<MenuItem onClick={closeMenu}>Profile</MenuItem>*/}
        <MenuItem onClick={handleSignOut}>{t('Sign out')}</MenuItem>
      </Menu>
    </React.Fragment>
  );
}

export default NavbarUserDropdown;
