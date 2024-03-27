import "react-app-polyfill/stable";

import React, { createContext, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "chart.js/auto";

import App from "./App";
import reportWebVitals from "./common/utils/reportWebVitals";
import { ThemeProvider } from "./common/contexts/ThemeContext";
import { keycloakInstance } from "./authConfig";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import GenericStore from "./common/contexts/GenericContext";

const container = document.getElementById("root");
const root = createRoot(container);
const queryClient = new QueryClient();
export const LanguageContext = createContext();
export const SiteContext = createContext();
export const DateTimeFormatContext = createContext();
export const UserInformation = createContext();

const AppWrapper = () => {
  const [userInformation, setUserInformation] = useState(null);
  const language = navigator.language.split(/[-_]/)[0] || "en";
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  //const [selectedSite, setSelectedSite] = useState(null);
  const [selectedSite, setSelectedSite] = useState(() => {
    const storedSite = localStorage.getItem("selectedSitePCT");
    return storedSite ? JSON.parse(storedSite) : null;
  });
  const [keycloak, setKeycloak] = useState(null);
  React.useEffect(() => {
    localStorage.setItem("selectedSitePCT", JSON.stringify(selectedSite));
  }, [selectedSite]);

  React.useEffect(() => {
    i18n.changeLanguage(selectedLanguage);
  }, [selectedLanguage]);

  const [dateFormat, setDateFormat] = useState(i18n.options.format.date);
  const [timeFormat, setTimeFormat] = useState(i18n.options.format.time);
  const [timeZoneFormat, setTimeZoneFormat] = useState(
    i18n.options.format.timeZone
  );

  React.useEffect(() => {
    i18n.options.format.date = dateFormat;
  }, [dateFormat]);
  React.useEffect(() => {
    i18n.options.format.time = timeFormat;
  }, [timeFormat]);
  React.useEffect(() => {
    i18n.options.format.timeZone = timeZoneFormat;
  }, [timeZoneFormat]);

  React.useEffect(() => {
    keycloakInstance
      .init({ onLoad: "login-required", checkLoginIframe: false })
      .then((authenticated) => {
        if (authenticated) {
          try {
            setKeycloak(keycloakInstance);
            const tokenContent = keycloakInstance.tokenParsed;
            const autenticatedUser = {
              idTokenClaims: {
                oid: tokenContent.sub,
                roles: tokenContent.realm_access.roles,
              },
              name: tokenContent.name,
              username: tokenContent.preferred_username,
              localAccountId: 0,
            };
            setUserInformation(autenticatedUser);
          } catch (error) {
            console.error("Error fetching users:", error);
            setUserInformation(null);
          }
        } else {
          console.log("Authentication failed");
          setUserInformation(null);
        }
      });
    keycloakInstance.onTokenExpired = () => {
      keycloakInstance.updateToken(30);
    };
  }, []);

  React.useEffect(() => {
    if (keycloak && keycloak.tokenParsed) {
      const tokenExpiration = new Date(keycloak.tokenParsed.exp * 1000);
      const now = new Date();
      const expiresIn = tokenExpiration - now;

      // If token is expired or about to expire within 5 seconds
      if (expiresIn <= 5000) {
        // Optionally, you can force a token refresh here
        keycloak
          .updateToken(5)
          .then((refreshed) => {
            if (refreshed) {
              console.log("Token refreshed");
            } else {
              console.log("Token not refreshed, valid for more than 5 seconds");
            }
          })
          .catch(() => {
            console.error("Failed to refresh token");
          });

        // Handle token expiration, for example, force logout or redirect to login
        console.log("Token expired or about to expire");
      }
    }
  }, [keycloak]);

  return (
    <BrowserRouter>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <UserInformation.Provider
            value={{ userInformation, setUserInformation }}
          >
            <LanguageContext.Provider
              value={{ selectedLanguage, setSelectedLanguage }}
            >
              <SiteContext.Provider value={{ selectedSite, setSelectedSite }}>
                <DateTimeFormatContext.Provider
                  value={{
                    dateFormat,
                    setDateFormat,
                    timeFormat,
                    setTimeFormat,
                    timeZoneFormat,
                    setTimeZoneFormat,
                  }}
                >
                  <I18nextProvider i18n={i18n}>
                    <GenericStore>
                      {userInformation !== null && <App />}
                    </GenericStore>
                  </I18nextProvider>
                </DateTimeFormatContext.Provider>
              </SiteContext.Provider>
            </LanguageContext.Provider>
          </UserInformation.Provider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

root.render(<AppWrapper />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
