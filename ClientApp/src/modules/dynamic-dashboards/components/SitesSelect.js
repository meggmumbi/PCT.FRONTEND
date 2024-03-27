import * as React from "react";
import { useContext } from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { useQuery } from "@tanstack/react-query";
import { SiteContext, UserInformation } from "../../../index.js";
import { getAllSites, getUserSites, getPermissionByUser } from "../apis/mis-endpoints";
import _ from 'lodash';


export default function SitesSelect() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const userInfo = useContext(UserInformation);
    const user = userInfo.userInformation;
    const siteContext = useContext(SiteContext);
    const selectedSite = siteContext.selectedSite;


    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const [data, setData] = React.useState([])
    React.useEffect(() => {

        const fetchData = async () => {
            try {
                if (userInfo.userInformation.username === 'administrator') {
                    const response = await getAllSites({ queryKey: ['getAllSitesList'] });
                    setData(response.data);
                } else {
                    const response = await getUserSites({ queryKey: ['getAllSitesList', userInfo.userInformation.username] });
                    setData(response.data);
                }

            } catch (error) {
                console.error("An error occurred :", error.message, " Name:", error.name, " Code: ", error.code);
            }
        };
        fetchData();
    }, []);

    React.useEffect(() => {
        //validate that the stored tenant exists in the queried data
        if (selectedSite && data.length > 0) {
            const exists = data.some(item => item.id === selectedSite.id);
            if (!exists) {
                siteContext.setSelectedSite(data[0]);
            }            
            getPermissionByUser({ queryKey: ['getPermissions', user.username, selectedSite.id] }).then(data => {
                user.permissions = _.map(data.data, 'name')
                userInfo.setUserInformation(user)
            })
        }

        if (!selectedSite && data.length > 0) {
            siteContext.setSelectedSite(data[0]);
            getPermissionByUser({ queryKey: ['getPermissions', user.username, data[0].id] }).then(data => {
                user.permissions = _.map(data.data, 'name')
                userInfo.setUserInformation(user)
            })


        }
    }, [data, siteContext]);

    const handleSiteChange = async (site) => {

        siteContext.setSelectedSite(site);
        await getPermissionByUser({ queryKey: ['getPermissions', user.username, site.id] }).then(data => {
            user.permissions = _.map(data.data, 'name');
            userInfo.setUserInformation(user)
        })
        handleClose();
    };


    return (
        <React.Fragment>
            <Tooltip title="Account settings">
                <IconButton
                    onClick={handleClick}
                    size="small"
                    aria-controls={open ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                >
                    <Avatar sx={{ width: 30, height: 30 }}>{selectedSite ? selectedSite.name[0] : ''}</Avatar>
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1,
                        "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1
                        },
                    }
                }}
                transformOrigin={{ horizontal: "center", vertical: "top" }}
                anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
            >
                {data.map((site) => (
                    <MenuItem
                        key={site.id}
                        onClick={() => handleSiteChange(site)}
                        style={{ fontWeight: site === selectedSite ? 'bold' : 'normal', fontSize: '16px' }}
                    >
                        <ListItemIcon>
                            <Settings fontSize="small" />
                        </ListItemIcon>
                        {site.name}
                    </MenuItem>
                ))}
            </Menu>
        </React.Fragment>
    );
}
