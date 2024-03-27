import React, { createContext, useState, useEffect, useContext } from "react";
import {
    BrowserRouter,
    Route,
    Routes,
    useRoutes,
    useNavigate,
} from 'react-router-dom'
import { userUpdateInfo, checkRoutesPermissionV2 } from "./modules/pct-core/components/auth/userUpdateInfo.js";
import { routesUpdateInfo } from "./modules/pct-core/components/auth/routesUpdateInfo.js";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { CacheProvider } from "@emotion/react";

import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import createTheme from "./common/theme";
import routes from "./common/routes/routes.js";

import useTheme from "./common/hooks/useTheme.js";
import createEmotionCache from "./common/utils/createEmotionCache";
import { UserInformation, SiteContext } from "./index.js";
import { getAllSites, getPermissionByUser } from "./common/apis/mis-endpoints.js";
import _ from 'lodash';

export const FilteredRoutesContext = createContext([]);


const clientSideEmotionCache = createEmotionCache();
let i = 1;

function App({ emotionCache = clientSideEmotionCache }) {
    const [filteredRoutesContext, setFilteredRoutes] = useState([]);
    const userInfo = useContext(UserInformation);
    const user = userInfo.userInformation;
    const selectedSite = useContext(SiteContext).selectedSite;


    //Get permissions
    React.useEffect(() => {
        const updateInformationDB = async () => {
            await routesUpdateInfo(routes);
            await userUpdateInfo(user);
            const securedRoutes = await checkRoutesPermissionV2(routes, user, selectedSite);
            setFilteredRoutes(securedRoutes);// to enable security on routes
            if (selectedSite === null) {
                const response = await getAllSites({ queryKey: ['getAllSitesList'] });
                let siteId = response.data && response.data.length >= 1 ? response.data[0].id : '00000000-0000-0000-0000-000000000000';
                getPermissionByUser({ queryKey: ['getPermissions', user.username, siteId] }).then(data => {
                    user.permissions = _.map(data.data, 'name');
                    userInfo.setUserInformation(user)
                })
            } else {
                getPermissionByUser({ queryKey: ['getPermissions', user.username, selectedSite.id] }).then(data => {
                    user.permissions = _.map(data.data, 'name');
                    userInfo.setUserInformation(user)
                })

            }
            //setFilteredRoutes(routes); // to disable security on routes
        };
        updateInformationDB();
    }, [user, selectedSite]);

    const content = useRoutes(filteredRoutesContext);

    const navigate = useNavigate();
    const { theme } = useTheme();

    useEffect(() => {
        if (!content && user && filteredRoutesContext?.length > 0) {
            navigate('/');
        }
    }, [content, user, filteredRoutesContext, navigate]);

    return (
        <FilteredRoutesContext.Provider value={filteredRoutesContext}>
            <CacheProvider value={emotionCache}>
                <HelmetProvider>
                    <Helmet
                        titleTemplate="%s | LIT"
                        defaultTitle="LIT - Home"
                    />
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <MuiThemeProvider theme={createTheme(theme)}>
                            {content}
                        </MuiThemeProvider>
                    </LocalizationProvider>
                </HelmetProvider>
            </CacheProvider>
        </FilteredRoutesContext.Provider>
    );
}

export default App;
