import React from "react";

import async from "../../../components/Async";

import MISLayout from "../../pct-core/layout/MISLayout";

const DocumentsList = async(() =>
  import("../components/DocumentList")
);
const NewDocument = async(() =>
  import("../components/AddDocument")
);
const FolderList = async(() =>
  import("../components/FolderList")
);
const DocumentDetails = async(() =>
  import("../components/DocumentDetails")
);
const NewDocumentCategory = async(() =>
  import("../components/Categories")
);


export const docMngtRoutes = [
      //Document management routes
  {
    path: "MISAdministration/document-management",
    permission: [
      "Add Documents",
      "Edit Documents",
      "Delete Documents",
      "View Documents",
      "Add Folders",
      "Edit Folders",
      "Delete Folders",
      "View Folders",
    ],
    element: <MISLayout />,
    children: [
      {
        path: "",
        permission: [
          "Add Documents",
          "Edit Documents",
          "Delete Documents",
          "View Documents",
        ],
        element: <DocumentsList />,
      },
      {
        path: "list",
        permission: [
          "Add Documents",
          "Edit Documents",
          "Delete Documents",
          "View Documents",
        ],
        element: <DocumentsList />,
      },
      {
        path: "document",
        permission: [
          "Add Documents",
          "Edit Documents",
          "Delete Documents",
          "View Documents",
        ],
        element: <NewDocument />,
      },
      {
        path: "folderList",
        permission: [
          "Add Folders",
          "Edit Folders",
          "Delete Folders",
          "View Folders",
        ],
        element: <FolderList />,
      },
      {
        path: "document/:id",
        permission: [
          "Add Documents",
          "Edit Documents",
          "Delete Documents",
          "View Documents",
        ],
        element: <NewDocument />,
      },
      {
        path: "category",
        permission: [
          "Add Folders",
          "Edit Folders",
          "Delete Folders",
          "View Folders",
        ],
        element: <NewDocumentCategory />,
      },
      {
        path: "category/:id",
        permission: [
          "Add Folders",
          "Edit Folders",
          "Delete Folders",
          "View Folders",
        ],
        element: <NewDocumentCategory />,
      },
      {
        path: "documentdetails/:id",
        permission: [
          "Add Documents",
          "Edit Documents",
          "Delete Documents",
          "View Documents",
        ],
        element: <DocumentDetails />,
      },
    ],
  },
]