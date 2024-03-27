import React from "react";
import styled from "@emotion/styled";

import { Typography } from "@mui/material";

import SidebarNavList from "./SidebarNavList";

// const Title = styled(Typography)`
//   color: ${(props) => props.theme.sidebar.color};
//   font-size: ${(props) => props.theme.typography.caption.fontSize};
//   padding: ${(props) => props.theme.spacing(4)}
//     ${(props) => props.theme.spacing(7)} ${(props) => props.theme.spacing(1)};
//   opacity: 0.4;
//   text-transform: uppercase;
//   display: block;
// `;

const SidebarNavSection = (props) => {
  const {
    pages,
    component: Component = "nav",
    ...rest
  } = props;

  return (
    <Component {...rest}>
      <SidebarNavList pages={pages} depth={0} />
    </Component>
  );
};

export default SidebarNavSection;
