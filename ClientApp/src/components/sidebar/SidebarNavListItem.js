import React, { forwardRef } from "react";
import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";
import { rgba } from "polished";

import { Chip, Collapse, ListItemButton, ListItemText } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

const CustomRouterLink = forwardRef((props, ref) => (
  <div ref={ref}>
    <NavLink {...props} />
  </div>
));

const Item = styled(ListItemButton)`
  padding-top: ${(props) =>
    props.theme.spacing(props.depth && props.depth > 0 ? 2 : 3)};
  padding-bottom: ${(props) =>
    props.theme.spacing(props.depth && props.depth > 0 ? 2 : 3)};
  padding-left: ${(props) =>
    props.theme.spacing(props.depth && props.depth > 0 ? 14 : 8)};
  padding-right: ${(props) =>
    props.theme.spacing(props.depth && props.depth > 0 ? 4 : 7)};
  font-weight: ${(props) => props.theme.typography.fontWeightRegular};
  svg {
    color: ${(props) => props.theme.sidebar.color};
    font-size: 20px;
    width: 20px;
    height: 20px;
    opacity: 0.5;
  }
  &:hover {
    background: rgba(0, 0, 0, 0.08);
    color: ${(props) => props.theme.sidebar.color};
  }
  &.${(props) => props.activeclassname} {
    background-color: ${(props) =>
      props.backgroundcolor ? props.backgroundcolor : ""};
    span {
      color: ${(props) => props.theme.sidebar.color};
    }
  }
`;

const Title = styled(ListItemText)`
  margin: 0;
  span {
    color: ${(props) =>
      rgba(
        props.theme.sidebar.color,
        props.depth && props.depth > 0 ? 0.7 : 1
      )};
    font-size: ${(props) => props.theme.typography.body1.fontSize}px;
    padding: 0 ${(props) => props.theme.spacing(4)};
  }
`;

const Badge = styled(Chip)`
  font-weight: ${(props) => props.theme.typography.fontWeightBold};
  height: 20px;
  position: absolute;
  right: 26px;
  top: 12px;
  background: ${(props) => props.theme.sidebar.badge.background};
  z-index: 1;
  span.MuiChip-label,
  span.MuiChip-label:hover {
    font-size: 11px;
    cursor: pointer;
    color: ${(props) => props.theme.sidebar.badge.color};
    padding-left: ${(props) => props.theme.spacing(2)};
    padding-right: ${(props) => props.theme.spacing(2)};
  }
`;

const ExpandLessIcon = styled(ExpandLess)`
  color: ${(props) => rgba(props.theme.sidebar.color, 0.5)};
`;

const ExpandMoreIcon = styled(ExpandMore)`
  color: ${(props) => rgba(props.theme.sidebar.color, 0.5)};
`;

const SidebarNavListItem = (props) => {
  const {
    title,
    href,
    backgroundcolor,
    color,
    depth = 0,
    children,
    icon: Icon,
    badge,
    open: openProp = false,
  } = props;

  const [open, setOpen] = React.useState(openProp);
  const handleToggle = () => {
    setOpen((state) => !state);
  };

  if (children) {
    return (
      <React.Fragment>
        <Item
          depth={depth}
          onClick={handleToggle}
          sx={{ backgroundColor: open ? backgroundcolor : "inherit" }}
        >
          {Icon && <Icon />}
          <Title depth={depth}>
            {title}
            {badge && <Badge label={badge} />}
          </Title>
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Item>
        <Collapse in={open}>{children}</Collapse>
      </React.Fragment>
    );
  }

  const iconStyle = {
    marginRight: depth === 2 ? "10px" : "0px",
  };

  return (
    <React.Fragment>
      <Item
        depth={depth}
        component={CustomRouterLink}
        to={href}
        activeclassname="active"
        backgroundcolor={backgroundcolor}
        color={color}
        sx={{ backgroundColor: backgroundcolor }}
      >
        {Icon && <Icon style={iconStyle} />}
        <Title depth={depth}>
          {depth === 2 ? (
            <span style={{ marginRight: "10px" }}>{title}</span>
          ) : (
            <strong>{title}</strong>
          )}
          {badge && <Badge label={badge} />}
        </Title>
      </Item>
    </React.Fragment>
  );
};

export default SidebarNavListItem;
