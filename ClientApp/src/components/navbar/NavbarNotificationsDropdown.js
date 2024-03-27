import React, { useRef, useState } from "react";
// import { Link } from "react-router-dom";
import styled from "@emotion/styled";

import {
  // Avatar as MuiAvatar,
  Badge, Box,
  // Box,
  // Button as MuiButton,
  Divider,
  Drawer,
  // Divider as MuiDivider,
  Grid,
  IconButton, Link, ListItemButton,
  // List,
  // ListItem,
  // ListItemAvatar,
  // ListItemText,
  // Popover as MuiPopover,
  // SvgIcon,
  Tooltip,
  // Typography as MuiTypography,
} from "@mui/material";
import AppsIcon from '@mui/icons-material/Apps';
import {NavLink, useNavigate} from "react-router-dom";
// import { Bell, Home, UserPlus, Server } from "react-feather";
// import {spacing} from "@mui/system";
// import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
// import AcUnitOutlinedIcon from "@mui/icons-material/AcUnitOutlined";
// import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
// import AirplanemodeActiveOutlinedIcon from "@mui/icons-material/AirplanemodeActiveOutlined";
// import {NavLink} from "react-router-dom";

// const Typography = styled(MuiTypography)(spacing);
// const Divider = styled(MuiDivider)(spacing);
// const Button = styled(MuiButton)(spacing);

// const Centered = styled.div`
//   text-align: center;
// `;
//
// const Popover = styled(MuiPopover)`
//   .MuiPaper-root {
//     width: 300px;
//     ${(props) => props.theme.shadows[1]};
//     border: 1px solid ${(props) => props.theme.palette.divider};
//   }
// `;
import { useTranslation } from 'react-i18next';
const Indicator = styled(Badge)`
  .MuiBadge-badge {
    background: ${(props) => props.theme.header.indicator.background};
    color: ${(props) => props.theme.palette.common.white};
  }
`;

const Wrapper = styled.div`
  width: 386px;
  overflow-x: hidden;
`;

const Heading = styled(ListItemButton)`
  font-size: ${(props) => props.theme.typography.h5.fontSize};
  font-weight: ${(props) => props.theme.typography.fontWeightMedium};
  font-family: ${(props) => props.theme.typography.fontFamily};
  min-height: 56px;

  ${(props) => props.theme.breakpoints.up("sm")} {
    min-height: 64px;
  }
`;

function Demos() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Wrapper>
      <Heading>
        <Box sx={{ fontWeight: 'bold' }}>
          {t('EXECUTION APPS')}
        </Box>
      </Heading>

      <Box px={4} my={3} sx={{ fontSize: 17, color: "#333333" }}>
        <Grid container spacing={6}>
          <Grid item md={12}>
            <NavLink to={`/MISAdministration`}>
              {t('MIS Administration')}
            </NavLink>


            <Divider />
          </Grid>

          <Grid item md={12}>
            <a href={process.env.REACT_APP_SCM_URL} target="_blank" rel="noopener noreferrer">
            {t('Warehousing & Distribution')}
            </a>
            <Divider />
          </Grid>
          <Grid item md={12}>
            <a target="_blank" rel="noopener noreferrer" href="https://eur03.safelinks.protection.outlook.com/?url=https%3A%2F%2Fs2c.mercell.com%2Fsso%2Fthepalladiumgroup.com&data=05%7C01%7CBVlietstra%40iplussolutions.org%7C3f396fa500444fc779d908daf49500da%7C6029b554b35744bb9f9e3036df46c4a0%7C0%7C0%7C638091218051078146%7CUnknown%7CTWFpbGZsb3d8eyJWIjoiMC4wLjAwMDAiLCJQIjoiV2luMzIiLCJBTiI6Ik1haWwiLCJXVCI6Mn0%3D%7C3000%7C%7C%7C&sdata=RwpDIGG3FojyhqnYZv5dkkSyXPH5APwFgonJplg3zDI%3D&reserved=0">
            {t('Sourcing')}
            </a>
            <Divider />
          </Grid>
          <Grid item md={12}>
            <a target="_blank" rel="noopener noreferrer" href="https://shiny.scims.online/NextGen_ICL/">
              {t('Planning')}
            </a>
            <Divider />
          </Grid>
          <Grid item md={12}>
            <a target="_blank" rel="noopener noreferrer" href="https://www.commcarehq.org">
              {t('Third Party Monitoring')}
            </a>
            <Divider />
          </Grid>
        </Grid>
      </Box>

      <Heading>
        <Box sx={{ fontWeight: 'bold' }}>
          {t('ANALYTICS APPS')}
        </Box>
      </Heading>

      <Box px={4} my={3} sx={{ fontSize: 17, color: "#333333" }}>
        <Grid container spacing={6}>
          <Grid item md={12}>
            <a href="https://palladium.kb.eastus2.azure.elastic-cloud.com:9243" target="_blank" rel="noopener noreferrer">{t('Risk Management')}</a>
            <Divider />
          </Grid>
          <Grid item md={12}>
            <a href="https://thepalladiumgroup.atlassian.net/servicedesk/customer/portal/26" target="_blank" rel="noopener noreferrer">{t('Quality Management')}</a>
            <Divider />
          </Grid>
          <Grid item md={12}>
            <NavLink to={`/enable/green-house-gas-monitoring`}>
              {t('Greenhouse Gas Monitoring')}
            </NavLink>
            <Divider />
          </Grid>
          <Grid item md={12}>
            <a href="https://app.parsyl.com/report/assets?dataWindow=7&dataType=humidity&weeklyRate=false" target="_blank" rel="noopener noreferrer">{t('Temperature Monitoring')}</a>
            <Divider />
          </Grid>
          <Grid item md={12}>
            <a href="https://pscm.kpmgarwin.com/" target="_blank" rel="noopener noreferrer">{t('Digital Twin')}</a>
            <Divider />
          </Grid>
          <Grid item md={12}>
            <NavLink to={`/freight-bill-audit`}>
              {t('Freight Bill Audit')}
            </NavLink>
            <Divider />
          </Grid>
          <Grid item md={12}>
            <a href="#">
              {t('Cost Analytics')}
            </a>
            <Divider />
          </Grid>
          <Grid item md={12}>
            <a href="http://52.186.176.46:8088/" target="_blank" rel="noopener noreferrer">{t('Custom Reporting')}</a>
            <Divider />
          </Grid>
        </Grid>
      </Box>
    </Wrapper>
  );
}

function NavbarNotificationsDropdown() {
  const ref = useRef(null);
  const [isOpen, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Tooltip title="Apps">
        <IconButton color="inherit" ref={ref} onClick={handleOpen} size="large">
          <Indicator>
            <AppsIcon />
          </Indicator>
        </IconButton>
      </Tooltip>
      <Drawer anchor="right" open={isOpen} onClose={handleClose}>
        <Demos />
      </Drawer>
    </React.Fragment>
  );
}

export default NavbarNotificationsDropdown;
