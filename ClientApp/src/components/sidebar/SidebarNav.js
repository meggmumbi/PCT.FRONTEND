import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import ReactPerfectScrollbar from "react-perfect-scrollbar";
import { List } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useLocation } from 'react-router-dom';
import SidebarNavSection from "./SidebarNavSection";

import "../../common/vendor/perfect-scrollbar.css";


const baseScrollbar = (props) => css`
  background-color: ${props.theme.sidebar.background};
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  flex-grow: 1;
`;

const Scrollbar = styled.div`
  ${baseScrollbar}
`;

const PerfectScrollbar = styled(ReactPerfectScrollbar)`
  ${baseScrollbar}
`;

const Items = styled.div`
  padding-top: ${(props) => props.theme.spacing(2.5)};
  padding-bottom: ${(props) => props.theme.spacing(2.5)};
`;

const SidebarNav = ({ items }) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));
  const ScrollbarComponent = matches ? PerfectScrollbar : Scrollbar;

  let currentPath;
  try {
     const location = useLocation();
     currentPath = location.pathname.replace(/\//g, "", "");
  } catch (error) {
     console.error("An error occurred:", error);
  }

  let itemsFiltered = []; 
  if (items && items.length > 0) { 
      itemsFiltered = items.map((item, index) => ({ 
                        ...item,
                        title: item.title || index
                      })); 
  }
    
  return (
    <ScrollbarComponent>
      <List disablePadding>
        <Items>
          {itemsFiltered &&
            itemsFiltered.map((item) => (
              <SidebarNavSection
                component="div"
                key={item.title}
                pages={item.pages}
                title={item.title}
                backgroundcolor={item.backgroundcolor}
                color={item.color}
              />
            ))}
        </Items>
      </List>
      {currentPath && <p id="user-location-sidebarnav" style={{ display: "none" }}>{currentPath}</p>}
    </ScrollbarComponent>
  );
};

export default SidebarNav;
