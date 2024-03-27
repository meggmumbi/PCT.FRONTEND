import React, { useEffect } from "react";
import styled from "@emotion/styled";
import {
    AppBar as MuiAppBar,
    Avatar as MuiAvatar, Box,
    Card as MuiCard, CardHeader,
    CardContent as MuiCardContent, CardMedia,
    Divider as MuiDivider, Grid, IconButton as MuiIconButton, Paper, Toolbar, Typography
} from "@mui/material";
import { useContext } from "react";
import { spacing } from "@mui/system";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Helmet } from "react-helmet-async";
import DynamicDashboards from "./DynamicDashboards.js";
import SupplyChainOperations from "./SupplyChainOperations";
import MasterDataRegistry from "./MasterDataRegistry";
import { useQuery } from "@tanstack/react-query";
import { getCMSContentLeadershipByName } from "../apis/cmscontent-leadership";
import AddContentLeadership from "./AddContentLeadership";
import AddContentImpact from "./AddContentImpact";
import { getCMSContentImpactByName } from "../apis/cmscontent-impact";
import PalladiumSupplyChain from "../../../common/vendor/palladium-supply-chain-homepage.png";
import { Menu as MenuIcon } from "@mui/icons-material";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import Fade from "@mui/material/Fade";
import MenuItem from "@mui/material/MenuItem";
import NavbarNotificationsDropdown from "../../../components/navbar/NavbarNotificationsDropdown";
import NavbarLanguagesDropdown from "../../../components/navbar/NavbarLanguagesDropdown";
import NavbarConfigurationDropdown from "../../../components/navbar/NavbarConfigurationDropdown";
import NavbarUserDropdown from "../../../components/navbar/NavbarUserDropdown";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SitesSelect from "./SitesSelect";
import { SiteContext, UserInformation } from "../../../index.js";
import PalladiumLogo from '../../../common/vendor/palladium-logo.png';
import _ from 'lodash';
import DataManagement from "./DataManagement.js";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Spacer = styled.div(spacing);

const Avatar = styled(MuiAvatar)`
  display: inline-block;
  height: 80px;
  width: 80px;
`;



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


const LandingPage = () => {


    const siteContext = useContext(SiteContext);
    const selectedSite = siteContext.selectedSite;

    const userInfo = useContext(UserInformation);
    const user = userInfo.userInformation;


    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const { t } = useTranslation();




    const theme = useTheme();
    const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));

    const [rolID, setrolID] = React.useState('Guest');
    const { data: dataLeadershipByRol, isLoading: isLoadingLeadershipByRol, isError: isErrorLeadershipByRol } =
        useQuery([rolID, "getCMSContentLeadershipByName"], getCMSContentLeadershipByName, { refetchOnWindowFocus: false, enabled: true }
        );
    const { data: dataImpactByRol, isLoading: isLoadingImpactByRol, isError: isErrorImpactByRol } =
        useQuery([rolID, "getCMSContentImpactByName"], getCMSContentImpactByName, { refetchOnWindowFocus: false, enabled: true });

    return (
        <React.Fragment>
            <Helmet title="Home" />
            <AppBar position="sticky" elevation={0}>
                <Toolbar>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid>
                            <CardMedia
                                component="img"
                                sx={{ objectFit: "fill", width: '10rem', height: '4rem', marginTop: '5px' }}
                                image={PalladiumLogo}
                            />
                        </Grid>
                        <Grid item xs />

                        <Grid item>
                            {<Typography sx={{ fontWeight: 'bold', fontSize: '16px', color: '#575757' }}>{selectedSite ? selectedSite.name : ''}</Typography>}
                        </Grid>
                        <Grid item>

                            <SitesSelect />
                            <NavbarNotificationsDropdown />
                            {<NavbarLanguagesDropdown />}
                            {<NavbarConfigurationDropdown />}
                            <NavbarUserDropdown />
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <Paper square={true} sx={{ width: "100%" }}>
                <CardMedia
                    component="img"
                    // sx={{ objectFit: "fill", height: '10rem' }}
                    sx={{ height: '20rem', objectFit: "fill" }}
                    image={PalladiumSupplyChain}
                />
            </Paper>
            <Paper square={true} sx={{ width: "100%", display: 'flex', alignItems: 'center', justifyContent: 'left', height: '70px' }}>
                <Typography variant="h2" component="h2" color={'#000'} sx={{ marginLeft: "3rem" }}>
                    {siteContext.selectedSite ? siteContext.selectedSite.name : "Create Tenant"}
                </Typography>
            </Paper>

            <Paper square={true} sx={{ width: "100%", display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
                <Grid container spacing={1} p={isLgUp ? 5 : 5} sx={{ borderTop: 5, borderBottom: 5, width: '95%', display: 'flex' }}>

                    {/* Order Management */}
                    {_.intersection(user.permissions, ["Create Supply Plan", "Create Requisition", "Approve Requisition", "Create Sales Quote", "Create Purchase Order", "View Shipments", "View Simulation"],).length > 0 && (
                        <Grid item xs={3} p={2} sx={{ height: "10rem", justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                            <SupplyChainOperations />
                        </Grid>
                    )}

                    {_.intersection(user.permissions, ["Create Dashboard", "Update Dashboard", "Read Dashboard", "Delete Dashboard"]).length > 0 && (
                        <Grid item xs={3} p={2} sx={{ height: "10rem", justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                            <DynamicDashboards />
                        </Grid>
                    )}

                    {_.intersection(user.permissions, ["Create Master Data Registry", "Update Master Data Registry", "Read Master Data Registry", "Delete Master Data Registry"]).length > 0 && (
                        <Grid item xs={3} p={2} sx={{ height: "10rem", justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                            <MasterDataRegistry />
                        </Grid>
                    )}


                    {_.intersection(user.permissions, [
                        "Add CommCare App Details", "Edit CommCare App Details", "Delete CommCare App Details", "View Form List", "View Form Data", "Export Form Data",
                        "Upload Data", "Delete Uploaded Data", "Edit Uploaded Data", "View Uploaded Data",
                        "View Data", "Export Data"
                    ]).length > 0 && (
                            <Grid item xs={3} p={2} sx={{ height: "10rem", justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                                <DataManagement />
                            </Grid>
                        )}

                </Grid>
            </Paper>
        </React.Fragment>
    );
};
export default LandingPage;
