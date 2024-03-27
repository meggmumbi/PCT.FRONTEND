import React from "react";

import async from "../../components/Async";

import AuthLayout from "../layout/Auth";
import PresentationLayout from "../layout/Presentation";

import AuthGuard from "../../components/guards/AuthGuard";


// Auth components
import SignIn from "../auth/SignIn";
import SignUp from "../auth/SignUp";
import ResetPassword from "../auth/ResetPassword";
import Page404 from "../auth/Page404";
import Page500 from "../auth/Page500";

import {analyticsRoutes} from "../../modules/analytics/routes/routes";
import {dataManagementRoutes} from "../../modules/data-import/routes/routes";
import {masterDataRegistryRoutes} from "../../modules/master-data-registry/routes/routes";
import {pctCoreRoutes} from "../../modules/pct-core/routes/routes";
import {docMngtRoutes} from "../../modules/document-management/routes/routes";

import {psaRoutes} from "../../modules/supply-chain-operations/routes/routes.js";

const LandingPage = async(() => import("../../modules/dynamic-dashboards/components/LandingPage"));


const routes = [    
  {
    path: "/",
    element: (
      <AuthGuard>
        <PresentationLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: "",
        element: <LandingPage />,
      },
    ],
  },  
    {
    path: "auth",
    element: <AuthLayout />,
    children: [
      {
        path: "sign-in",
        element: <SignIn />,
      },
      {
        path: "sign-up",
        element: <SignUp />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "404",
        element: <Page404 />,
      },
      {
        path: "500",
        element: <Page500 />,
      },
    ],
  },
  {
    path: "*",
    element: <AuthLayout />,
    children: [
      {
        path: "*",
        element: <Page404 />,
      },
    ],
  },  

...psaRoutes,
...pctCoreRoutes,
...docMngtRoutes,
...analyticsRoutes,
...dataManagementRoutes,
...masterDataRegistryRoutes,

];

export default routes;
