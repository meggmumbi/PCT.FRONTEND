import React, { useState, useContext } from "react";
import { FilteredRoutesContext } from "../../../App";
import styled from "@emotion/styled";
import { Outlet } from "react-router-dom";

import { Box, CssBaseline, Paper as MuiPaper } from "@mui/material";
import { spacing, useTheme } from "@mui/system";

import GlobalStyle from "../../../components/GlobalStyle";
// import Navbar from "../components/navbar/Navbar";
import analyticsItems from "../../../components/sidebar/analyticsItems";
import Sidebar from "../../../components/sidebar/Sidebar";
import Footer from "../../../components/Footer";
import NavbarGlobalFund from "../../../components/navbar/NavbarGlobalFund";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useQuery } from "@tanstack/react-query";
import { getMenus, getRolePermissionsByRoleId } from "../apis/analytics";
import * as MuiIcon from "@mui/icons-material";
import { SiteContext, UserInformation } from "../../../index";
import { getUserByEmail, getUserById } from "../apis/user";

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

const AnalyticsLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const siteContext = useContext(SiteContext);
  const user = useContext(UserInformation);
  const selectedSite = siteContext.selectedSite;
  const oid = user.userInformation.idTokenClaims.oid;

  const { isLoading: isLoadingUserData, data: userData } = useQuery(
    ["getUserByEmail", user.userInformation.username],
    getUserByEmail,
    { enabled: !!oid }
  );
  const roleId = !isLoadingUserData
    ? userData?.data.userRoles.length > 0
      ? userData.data.userRoles.find(
          (obj) => obj.role.tenantId === selectedSite.id
        )?.roleId
      : null
    : null;
  console.log(roleId);
  const {
    isLoading: isLoadingRolePermissions,
    isError: isErrorRolePermissions,
    data: rolePermissions,
  } = useQuery({
    queryKey: ["projects", roleId],
    queryFn: getRolePermissionsByRoleId,
    // The query will not execute until the userId exists
    enabled: !!roleId,
  });
  const { isLoading, isError, data } = useQuery(
    ["getMenus", selectedSite ? selectedSite.id : null],
    getMenus,
    { enabled: !!selectedSite && !!selectedSite.id }
  );
  function findParents(itemId, array) {
    const item = array.find((item) => item.id === itemId);
    if (!item || !item.parent) {
      return [];
    }
    const parent = array.find((parent) => parent.id === item.parent);
    if (!parent) {
      return [];
    }
    return [parent, ...findParents(parent.id, array)];
  }

  let filteredArray = [];

  if (
    !isLoadingRolePermissions &&
    !isErrorRolePermissions &&
    !isLoading &&
    !isError
  ) {
    for (const id of rolePermissions.data) {
      const found = data.data.find((val) => val.id === id);
      if (found) {
        filteredArray.push(found);
        const parents = findParents(id, data.data);
        for (const parent of parents) {
          if (!filteredArray.some((item) => item.id === parent.id)) {
            // Check if parent element is not already in filteredArray
            filteredArray.push(parent);
          }
        }
      }
    }
  }
  const convertToNestedStructure = (items, parentId = null) => {
    const filteredItems = items
      .filter((item) => item.parent === parentId)
      .sort((a, b) => a.menuOrder - b.menuOrder);

    return filteredItems.map((item) => {
      const children = convertToNestedStructure(items, item.id);
      return {
        title: item.name,
        name: item.name.toLowerCase().replace(/ /g, "_"),
        icon: MuiIcon[item.icon],
        backgroundcolor: item.color,
        children: children.length > 0 ? children : undefined,
        href:
          children.length == 0 ? `/analytics/universal-route/${item.id}` : ``,
      };
    });
  };

  const navItemsArray =
    !isLoading && !isError
      ? [{ title: "", pages: convertToNestedStructure(filteredArray) }]
      : [];

  console.log(navItemsArray);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const filteredRoutes = useContext(FilteredRoutesContext);

  // Filter the dashboardItems based on the filteredRoutes
  const filteredDashboardItems = analyticsItems.map((dashboardItem) => {
    const filteredPages = dashboardItem.pages.filter((page) => {
      const itemPath = page.href.replace(/\//g, "");
      const itemInRoutes = filteredRoutes.some(
        (route) => route.path.replace(/\//g, "") === itemPath
      );

      if (itemInRoutes) {
        if (page.children) {
          page.children = page.children.filter((child) => {
            const childPath = child.href.replace(/\//g, "");
            const childPathInRoutes = filteredRoutes.some((route) =>
              route.children.some(
                (childRoute) =>
                  childRoute.path.replace(/\//g, "") === childPath ||
                  `${route.path.replace(/\//g, "")}${childRoute.path.replace(
                    /\//g,
                    ""
                  )}` === childPath
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

  // Merge the arrays
  const mergedItems = [...filteredDashboardItems, ...navItemsArray];

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
            items={mergedItems}
          />
        </Box>
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <Sidebar
            PaperProps={{ style: { width: drawerWidth } }}
            items={mergedItems}
          />
        </Box>
      </Drawer>
      <AppContent>
        <NavbarGlobalFund onDrawerToggle={handleDrawerToggle} />
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
export default AnalyticsLayout;
