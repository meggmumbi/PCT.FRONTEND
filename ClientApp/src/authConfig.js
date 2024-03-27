//import {LogLevel} from "@azure/msal-browser";
import Keycloak from "keycloak-js";

const loggerCallback = (logLevel, message) => {
  // console.log(message);
};

export const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_CLIENTID,
    authority: `https://login.microsoftonline.com/${process.env.REACT_APP_TENANTID}`,
    redirectUri: process.env.REACT_APP_REDIRECTURI,
    postLogoutRedirectUri: "/",
  },
  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback,
      /*loggerLevel: LogLevel.Verbose,*/
      piiLoggingEnabled: false,
    }
  }
};

// Add scopes here for ID token to be used at Microsoft identity platform endpoints.
export const loginRequest = {
  scopes: ["User.Read"]
};

// Add the endpoints here for Microsoft Graph API services you'd like to use.
export const graphConfig = {
  graphMeEndpoint: "Enter_the_Graph_Endpoint_Here/v1.0/me"
};

// keycloak instanse:
export const keycloakInstance = new Keycloak({
  url: process.env.REACT_APP_KEYCLOAK_URI,
  realm: process.env.REACT_APP_REALM,
  clientId: process.env.REACT_APP_CLIENTID,
});