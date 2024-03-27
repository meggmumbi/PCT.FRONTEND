import React, { useState, useContext } from "react";
import { FilteredRoutesContext } from "../../../App";
import styled from "@emotion/styled";
import { Outlet } from "react-router-dom";

import { Box, CssBaseline, Paper as MuiPaper } from "@mui/material";
import { spacing } from "@mui/system";

import GlobalStyle from "../../../components/GlobalStyle";
import Navbar from "../../../components/navbar/Navbar";
import dashboardItems from "../../../components/sidebar/dataManagementItems";
import Sidebar from "../../../components/sidebar/Sidebar";
import Footer from "../../../components/Footer";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
// import Settings from "../components/Settings";

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

const DataManagementLayout = ({ children }) => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const theme = useTheme();
    const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));

    const filteredRoutes = useContext(FilteredRoutesContext);

    // Filter the dashboardItems based on the filteredRoutes
    const filteredDashboardItems = dashboardItems.map((dashboardItem) => {
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
            return false;
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
                <Navbar onDrawerToggle={handleDrawerToggle} />
                <MainContent p={isLgUp ? 12 : 5}>
                    {children}
                    <Outlet />
                </MainContent>
                <Footer />
            </AppContent>
            {/*<Settings />*/}
        </Root>
    );
};

export default DataManagementLayout;
