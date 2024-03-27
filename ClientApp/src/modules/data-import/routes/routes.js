import React from "react";

import async from "../../../components/Async";

import DataManagementLayout from "../layout/DataManagementLayout";
import DataUploadsList from "../components/data-upload/DataUploadsList";
import DataUploadPage from "../components/data-upload/DataUploadPage";
import TemplatesList from "../components/upload-templates/TemplatesList";
import TemplatePage from "../components/upload-templates/TemplatePage";
import TemplateVersion from "../components/upload-templates/TemplateVersion";
import DataUploadView from "../components/data-upload/DataUploadView";

import ViewDataDbConfigs from "../../data-export/components/ViewDataDbConfigs";


const CommcareAppsList = async(() => import("../../commcare/components/AppsList"));
const NewCommcareApp = async(() => import("../../commcare/components/AppRegistration"));
const CommcareAppData = async(() => import("../../commcare/components/AppData"));

const DataExportDbConfigs = async(() =>
  import("../../data-export/components/DataExportDbConfigs")
);


export const dataManagementRoutes = [    
  {
    path: "data-management",
    permission: [
      "Add CommCare App Details",
      "Edit CommCare App Details",
      "Delete CommCare App Details",
      "View Form List",
      "View Form Data",
      "Export Form Data",
      "Upload Data",
      "Delete Uploaded Data",
      "Edit Uploaded Data",
      "View Uploaded Data",
      "View Data",
      "Export Data",
    ],

    element: <DataManagementLayout />,
    children: [
      {
        path: "commcare",
        permission: [
          "Add CommCare App Details",
          "Edit CommCare App Details",
          "Delete CommCare App Details",
          "View Form List",
          "View Form Data",
          "Export Form Data",
        ],
        children: [
          {
            path: "",
            permission: [
              "Add CommCare App Details",
              "Edit CommCare App Details",
              "Delete CommCare App Details",
              "View Form List",
              "View Form Data",
              "Export Form Data",
            ],
            element: <CommcareAppsList />,
          },
          {
            path: "apps",
            permission: [
              "Add CommCare App Details",
              "Edit CommCare App Details",
              "Delete CommCare App Details",
              "View Form List",
              "View Form Data",
              "Export Form Data",
            ],
            element: <CommcareAppsList />,
          },
          {
            path: "apps/new-app",
            permission: [
              "Add CommCare App Details",
              "Edit CommCare App Details",
              "Delete CommCare App Details",
            ],
            element: <NewCommcareApp />,
          },
          {
            path: "apps/new-app/:id",
            permission: [
              "Add CommCare App Details",
              "Edit CommCare App Details",
              "Delete CommCare App Details",
            ],
            element: <NewCommcareApp />,
          },
          {
            path: "apps/data/:id",
            permission: [
              "View Form List",
              "View Form Data",
              "Export Form Data",
            ],
            element: <CommcareAppData />,
          },
        ],
      },
      {
        path: "data-import",
        permission: [
          "Upload Data",
          "Delete Uploaded Data",
          "Edit Uploaded Data",
          "View Uploaded Data",
        ],
        children: [
          {
            path: "",
            permission: [
              "Upload Data",
              "Delete Uploaded Data",
              "Edit Uploaded Data",
              "View Uploaded Data",
            ],
            element: <DataUploadsList />,
          },
          {
            path: "uploads",
            permission: [
              "Upload Data",
              "Delete Uploaded Data",
              "Edit Uploaded Data",
              "View Uploaded Data",
            ],
            element: <DataUploadsList />,
          },
          {
            path: "upload",
            permission: [
              "Upload Data",
              "Delete Uploaded Data",
              "Edit Uploaded Data",
              "View Uploaded Data",
            ],
            element: <DataUploadPage />,
          },
          {
            path: "upload/:id",
            permission: [
              "Upload Data",
              "Delete Uploaded Data",
              "Edit Uploaded Data",
              "View Uploaded Data",
            ],
            element: <DataUploadView />,
          },
          {
            path: "templates",
            permission: [
              "Create Template",
              "Edit Template",
              "Delete Template",
              "View Templates",
              "Create Template Version",
              "Edit Template Version",
              "Delete Template Version",
              "View Template Versions",
            ],
            children: [
              {
                path: "",
                permission: [
                  "Create Template",
                  "Edit Template",
                  "Delete Template",
                  "View Templates",
                  "Create Template Version",
                  "Edit Template Version",
                  "Delete Template Version",
                  "View Template Versions",
                ],
                element: <TemplatesList />,
              },
              {
                path: "template",
                permission: [
                  "Create Template",
                  "Edit Template",
                  "Delete Template",
                  "View Templates",
                  "Create Template Version",
                  "Edit Template Version",
                  "Delete Template Version",
                  "View Template Versions",
                ],
                element: <TemplatePage />,
              },
              {
                path: "template/:id",
                permission: [
                  "Create Template",
                  "Edit Template",
                  "Delete Template",
                  "View Templates",
                  "Create Template Version",
                  "Edit Template Version",
                  "Delete Template Version",
                  "View Template Versions",
                ],
                element: <TemplatePage />,
              },
              {
                path: "template/version",
                permission: [
                  "Create Template",
                  "Edit Template",
                  "Delete Template",
                  "View Templates",
                  "Create Template Version",
                  "Edit Template Version",
                  "Delete Template Version",
                  "View Template Versions",
                ],
                element: <TemplateVersion />,
              },
              {
                path: "template/version/:template/:id",
                permission: [
                  "Create Template",
                  "Edit Template",
                  "Delete Template",
                  "View Templates",
                  "Create Template Version",
                  "Edit Template Version",
                  "Delete Template Version",
                  "View Template Versions",
                ],
                element: <TemplateVersion />,
              },
            ],
          },
        ],
      },
      {
        path: "data-export",
        permission: ["View Data", "Export Data"],
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
    ],
  },

];
