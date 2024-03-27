import React from "react";

import async from "../../../components/Async";

import MISLayout from "../layout/MISLayout";


import OrganizationList from "../components/organization/OrganizationList";
import OrganizationDetails from "../components/organization/OrganizationDetails";
import SiteList from "../components/sites/SiteList";
import Tenant from "../components/sites/Tenant";
import RolesList from "../components/roles/RolesList";
import Role from "../components/roles/Role";
import UsersList from "../components/users/UserList";
import User from "../components/users/User";

import ViewDataDbConfigs from "../../data-export/components/ViewDataDbConfigs";

const MISAdministration = async(() => import("../components"));
const MiddleWareStatus = async(() =>
  import("../components/MiddleWareStatus")
);
const DataExportDbConfigs = async(() =>
  import("../../data-export/components/DataExportDbConfigs")
);
const CMSContentRegistry = async(() =>
  import("../components/CMSContentRegistry")
);
const CMSContentImpactCreate = async(() =>
  import("../components/CMSContentImpact-create")
);
const CMSContentImpactList = async(() =>
  import("../components/CMSContentImpact-list")
);
const CMSContentLeadershipCreate = async(() =>
  import("../components/CMSContentLeadership-create")
);
const CMSContentLeadershipList = async(() =>
  import("../components/CMSContentLeadership-list")
);
const UMUsersList = async(() =>
  import("../components/UMUsers-list")
);
const UMRolesList = async(() =>
  import("../components/UMRoles-list")
);
const UMCountriesList = async(() =>
  import("../components/UMCountries-list")
);
const UMOptionRoutesList = async(() =>
  import("../components/UMOptionRoutes-List")
);
const UMRoleOptionsList = async(() =>
  import("../components/UMRoleOptions-List")
);
const UMUserRolesList = async(() =>
  import("../components/UMUserRoles-List")
);
const LOGRecordsList = async(() =>
  import("../components/LOGRecords-List")
);
const ApplicationConfiguration = async(() =>
  import("../components/application-configuration/index")
);
const ApplicationDetails = async(() =>
  import(
    "../components/application-configuration/ApplicationDetails"
  )
);
const NewApplication = async(() =>
  import("../components/application-configuration/NewApplication")
);
const NewModule = async(() =>
  import("../components/application-configuration/NewModule")
);




export const pctCoreRoutes = [
 //data export db config routes
 {
  path: "data-export/data-export-db-configs",
  permission: ["View Data", "Export Data"],
  element: <MISLayout />,
  children: [
    {
      path: "",
      permission: ["View Data", "Export Data"],
      element: <DataExportDbConfigs />,
    },
    {
      path: "view-data/:table_name/:config_id",
      permission: ["View Data", "Export Data"],
      element: <ViewDataDbConfigs />,
    },
  ],
},
//data import routes
{
    path: "MISAdministration/roles",
    permission: ["Edit Roles", "Delete Roles", "View Roles", "Add Roles"],
    element: <MISLayout />,
    children: [
      {
        path: "",
        permission: ["Edit Roles", "Delete Roles", "View Roles", "Add Roles"],
        element: <RolesList />,
      },
      {
        path: "role/:id",
        permission: ["Edit Roles", "Delete Roles", "View Roles", "Add Roles"],
        element: <Role />,
      },
      {
        path: "role",
        permission: ["Edit Roles", "Delete Roles", "View Roles", "Add Roles"],
        element: <Role />,
      },
    ],
  },
  {
    path: "MISAdministration/tenants",
    permission: ["Add Tenant", "Edit Tenant", "View Tenant", "Delete Tenant"],
    element: <MISLayout />,
    children: [
      {
        path: "",
        permission: [
          "Add Tenant",
          "Edit Tenant",
          "View Tenant",
          "Delete Tenant",
        ],
        element: <SiteList />,
      },
      {
        path: "tenant/:id",
        permission: [
          "Add Tenant",
          "Edit Tenant",
          "View Tenant",
          "Delete Tenant",
        ],
        element: <Tenant />,
      },
      {
        path: "tenant",
        permission: [
          "Add Tenant",
          "Edit Tenant",
          "View Tenant",
          "Delete Tenant",
        ],
        element: <Tenant />,
      },
    ],
  },
  {
    path: "MISAdministration/users",
    permission: [
      "Edit User Management",
      "View User Management",
      "Delete User Management",
      "Add User Management",
    ],
    element: <MISLayout />,
    children: [
      {
        path: "",
        permission: [
          "Edit User Management",
          "View User Management",
          "Delete User Management",
          "Add User Management",
        ],
        element: <UsersList />,
      },
      {
        path: "user/:id",
        permission: [
          "Edit User Management",
          "View User Management",
          "Delete User Management",
          "Add User Management",
        ],
        element: <User />,
      },
      {
        path: "user",
        permission: [
          "Edit User Management",
          "View User Management",
          "Delete User Management",
          "Add User Management",
        ],
        element: <User />,
      },
    ],
  },
  {
    path: "MISAdministration/application-configuration",
    permission: [
      "Edit Application Configuration",
      "View Application Configuration",
    ],
    element: <MISLayout />,
    children: [
      {
        path: "",
        permission: [
          "Edit Application Configuration",
          "View Application Configuration",
        ],
        element: <ApplicationConfiguration />,
      },
      {
        path: "new-application",
        permission: [
          "Edit Application Configuration",
          "View Application Configuration",
        ],
        element: <NewApplication />,
      },
      {
        path: "new-module/:applicationId",
        permission: [
          "Edit Application Configuration",
          "View Application Configuration",
        ],
        element: <NewModule />,
      },
    ],
  },
  {
    path: "MISAdministration/application-details/:id",
    permission: [
      "Edit Application Configuration",
      "View Application Configuration",
    ],
    element: <MISLayout />,
    children: [
      {
        path: "",
        element: <ApplicationDetails />,
      },
    ],
  },
  {
    path: "MISAdministration",
    permission: [
      "View Organization",
      "Edit Organization",
      "Add Tenant",
      "Edit Roles",
      "Edit User Management",
      "View User Management",
      "Delete Organization",
      "Delete Roles",
      "Delete User Management",
      "Edit Tenant",
      "View Roles",
      "Add Organization",
      "Edit Application Configuration",
      "Add User Management",
      "Add Roles",
      "View Application Configuration",
      "View Tenant",
      "Delete Tenant",
      "Add Documents",
      "Edit Documents",
      "Delete Documents",
      "View Documents",
      "Add Folders",
      "Edit Folders",
      "Delete Folders",
      "View Folders",
      "Create Template",
      "Edit Template",
      "Delete Template",
      "View Templates",
      "Create Template Version",
      "Edit Template Version",
      "Delete Template Version",
      "View Template Versions",
      "Upload Data",
      "Delete Uploaded Data",
      "Edit Uploaded Data",
      "View Uploaded Data",
      "Add CommCare App Details",
      "Edit CommCare App Details",
      "Delete CommCare App Details",
      "View Form List",
      "View Form Data",
      "Export Form Data",
    ],
    /*element: <DashboardLayout />,*/
    element: <MISLayout />,
    
    children: [
      {
        path: "",
        element: <MISAdministration />,
      },
     {
        path: "middle-ware-status",
        permission: ["View all options", "View middle ware status"],
        element: <MiddleWareStatus />,
      },     
      {
        path: "content-registry",
        element: <CMSContentRegistry />,
      },
      {
        path: "content-impact-create",
        element: <CMSContentImpactCreate />,
      },
      {
        path: "content-impact-list",
        element: <CMSContentImpactList />,
      },
      {
        path: "content-leadership-create",
        element: <CMSContentLeadershipCreate />,
      },
      {
        path: "content-leadership-list",
        element: <CMSContentLeadershipList />,
      },
      {
        path: "users-list",
        element: <UMUsersList />,
      },
      {
        path: "roles-list",
        element: <UMRolesList />,
      },
      {
        path: "countries-list",
        element: <UMCountriesList />,
      },
      {
        path: "optionroutes-List",
        element: <UMOptionRoutesList />,
      },
      {
        path: "roleoptions-List",
        element: <UMRoleOptionsList />,
      },
      {
        path: "userroles-list",
        element: <UMUserRolesList />,
      },
      {
        path: "organisations",
        element: <OrganizationList />,
      },
      {
        path: "logrecords-List",
        element: <LOGRecordsList />,
      },
    ],
  },
    //Organization routes
    {
        path: "MISAdministration/organization",
        permission: [
          "View Organization",
          "Edit Organization",
          "Delete Organization",
          "Add Organization",
        ],
        element: <MISLayout />,
        children: [
          {
            path: "",
            permission: [
              "View Organization",
              "Edit Organization",
              "Delete Organization",
              "Add Organization",
            ],
            element: <OrganizationList />,
          },
          {
            path: "list",
            permission: [
              "View Organization",
              "Edit Organization",
              "Delete Organization",
              "Add Organization",
            ],
            element: <OrganizationList />,
          },
          {
            path: "details",
            permission: [
              "View Organization",
              "Edit Organization",
              "Delete Organization",
              "Add Organization",
            ],
            element: <OrganizationDetails />,
          },
          {
            path: "details/:id",
            permission: [
              "View Organization",
              "Edit Organization",
              "Delete Organization",
              "Add Organization",
            ],
            element: <OrganizationDetails />,
          },
        ],
      },
      
  
 
  
];


