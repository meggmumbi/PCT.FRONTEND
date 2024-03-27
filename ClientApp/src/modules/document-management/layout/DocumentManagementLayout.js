import React, { useState, useContext } from "react";
import { FilteredRoutesContext } from "../App";
import styled from "@emotion/styled";
import { Outlet } from "react-router-dom";

import { Box, CssBaseline, Paper as MuiPaper } from "@mui/material";
import { spacing } from "@mui/system";

import GlobalStyle from "../components/GlobalStyle";
import Navbar from "../components/navbar/Navbar";
import documentManagementItems from "../components/sidebar/documentManagementItems";
import Sidebar from "../components/sidebar/Sidebar";
import Footer from "../components/Footer";
// import Settings from "../components/Settings";


import {
    Grid,
    AppBar as MuiAppBar,
    IconButton as MuiIconButton,
    Toolbar, Typography,
} from "@mui/material";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
// import Link from '@mui/material/Link';
import Chip from '@mui/material/Chip';
import { Menu as MenuIcon } from "@mui/icons-material";
import { createTheme, ThemeProvider } from '@mui/material/styles';

import NavbarNotificationsDropdown from "../components/navbar/NavbarNotificationsDropdown";
import NavbarLanguagesDropdown from "../components/navbar/NavbarLanguagesDropdown";
import NavbarConfigurationDropdown from "../components/navbar/NavbarConfigurationDropdown";
import NavbarUserDropdown from "../components/navbar/NavbarUserDropdown";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';



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


const drawerWidth = 258;

const Root = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Drawer = styled.div`
  ${(props) => props.theme.breakpoints.up("md")} {
    width: ${drawerWidth}px;
    flex-shrink: 0;
  }
`;

const AppContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 100%;
`;

const Paper = styled(MuiPaper)(spacing);

const MainContent = styled(Paper)`
  flex: 1;
  background: ${(props) => props.theme.palette.background.default};

  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    flex: none;
  }

  .MuiPaper-root .MuiPaper-root {
    box-shadow: none;
  }
`;

const DocumentManagementLayout = ({ children }) => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const filteredRoutes = useContext(FilteredRoutesContext);

    // Filter the dashboardItems based on the filteredRoutes
    const filteredDashboardItems = documentManagementItems.map((dashboardItem) => {
        const filteredPages = dashboardItem.pages.filter((page) => {
            const itemPath = page.href.replace(/\//g, "");
            const itemInRoutes = filteredRoutes.some(
                (route) => route.path.replace(/\//g, "") === itemPath
            );

            if (itemInRoutes) {
                if (page.children) {
                    page.children = page.children.filter((child) => {
                        const childPath = child.href.replace(/\//g, "");
                        const childPathInRoutes = filteredRoutes.some(
                            (route) =>
                                route.children.some(
                                    (childRoute) =>
                                        childRoute.path.replace(/\//g, "") === childPath ||
                                        `${route.path.replace(/\//g, "")}${childRoute.path.replace(/\//g, "")}` === childPath
                                )
                        );
                        return childPathInRoutes;
                    });
                }
                return true;
            }
            return true;
        });

        return { pages: filteredPages };
    });


    return (
        <Root>
            <CssBaseline />
            <GlobalStyle />
            <Drawer>
                <Box sx={{ display: { xs: "block", lg: "none" } }}>
                    <Sidebar
                        PaperProps={{ style: { width: drawerWidth } }}
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        items={filteredDashboardItems}
                    />
                </Box>
                <Box sx={{ display: { xs: "none", md: "block" } }}>
                    <Sidebar
                        PaperProps={{ style: { width: drawerWidth } }}
                        items={filteredDashboardItems}
                    />
                </Box>
            </Drawer>
            <AppContent>
                <AppBar position="sticky" elevation={0}>
                    <Toolbar>
                        <Grid container alignItems="center" spacing={6}>
                            <Grid item xs />
                            <Grid item>
                                {/*<NavbarMessagesDropdown />*/}
                                <NavbarNotificationsDropdown />
                                {/*<NavbarUSAIDIcon />*/}
                                {<NavbarLanguagesDropdown />}
                                {<NavbarConfigurationDropdown />}
                                <NavbarUserDropdown />
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>

                <MainContent>
                    {children}
                    <Outlet />
                </MainContent>
                <Footer />
            </AppContent>
            {/*<Settings />*/}
        </Root>
    );
};

export default DocumentManagementLayout;
