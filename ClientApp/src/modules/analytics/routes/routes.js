import React from "react";

import async from "../../../components/Async";

import AnalyticsLayout from "../layout/AnalyticsLayout";
import RolePermissions from "../components/RolePermissions";

const MenusList = async(() => import("../components/MenusList"));
const NewMenu = async(() => import("../components/NewMenu"));
const UniversalComponent = async(() =>
  import("../components/UniversalComponent")
);



export const analyticsRoutes = [    
  
    //Dynamic dashboards Routes
    {
      path: "analytics",
      permission: [
        "Create Dashboard",
        "Update Dashboard",
        "Read Dashboard",
        "Delete Dashboard",
      ],
      element: <AnalyticsLayout />,
      children: [
        {
          path: "",
          permission: [
            "Create Dashboard",
            "Update Dashboard",
            "Read Dashboard",
            "Delete Dashboard",
          ],
          element: <></>,
        },
        {
          path: "config",
          permission: [
            "Create Dashboard",
            "Update Dashboard",
            "Read Dashboard",
            "Delete Dashboard",
          ],
          element: <MenusList />,
        },
        {
          path: "new-menu",
          permission: [
            "Create Dashboard",
            "Update Dashboard",
            "Read Dashboard",
            "Delete Dashboard",
          ],
          element: <NewMenu />,
        },
        {
          path: "new-menu/:id",
          permission: [
            "Create Dashboard",
            "Update Dashboard",
            "Read Dashboard",
            "Delete Dashboard",
          ],
          element: <NewMenu />,
        },
        {
          path: "universal-route/:id",
          permission: [
            "Create Dashboard",
            "Update Dashboard",
            "Read Dashboard",
            "Delete Dashboard",
          ],
          element: <UniversalComponent />,
        },
        {
          path: "role_permissions",
          permission: ["Assign Role Permissions"],
          element: <RolePermissions />,
        },
      ],
    },
  

];


