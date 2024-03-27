import React from "react";

import async from "./../../../components/Async";

import MasterDataRegistryLayout from "../layout/MasterDataRegistryLayout";


const MasterDataRegistry = async(() =>
  import("../components/index")
);
const MasterDataRegistryProducts = async(() =>
  import("../components/products")
);
const NewProduct = async(() =>
  import("../components/products/NewProduct")
);
const Locations = async(() =>
  import("../components/locations/index")
);
const NewLocation = async(() =>
  import("../components/locations/NewLocation")
);
const Vendors = async(() =>
  import("../components/vendors/index")
);
const NewVendor = async(() =>
  import("../components/vendors/NewVendor")
);
const Carriers = async(() =>
  import("../components/carriers/index")
);
const NewCarrier = async(() =>
  import("../components/carriers/NewCarrier")
);
const Warehouses = async(() =>
  import("../components/warehouses/index")
);
const NewWarehouse = async(() =>
  import("../components/warehouses/NewWarehouse")
);
const Unit = async(() => import("../components/unit/index"));
const NewUnit = async(() =>
  import("../components/unit/NewUnit")
);
const Category = async(() =>
  import("../components/category/index")
);
const NewCategory = async(() =>
  import("../components/category/NewCategory")
);



export const masterDataRegistryRoutes = [    
 //Master data registry routes
 {
  path: "master-data-registry",
  permission: [
    "Create Master Data Registry",
    "Update Master Data Registry",
    "Read Master Data Registry",
    "Delete Master Data Registry",
  ],
  element: <MasterDataRegistryLayout />,
  children: [
    {
      path: "",
      element: <MasterDataRegistry />,
    },
    {
      path: "products",
      permission: [
        "Create Master Data Registry",
        "Update Master Data Registry",
        "Read Master Data Registry",
        "Delete Master Data Registry",
      ],
      element: <MasterDataRegistryProducts />,
    },
    {
      path: "products/new-product",
      permission: [
        "Create Master Data Registry",
        "Update Master Data Registry",
        "Read Master Data Registry",
        "Delete Master Data Registry",
      ],
      element: <NewProduct />,
    },
    {
      path: "products/new-product/:id",
      permission: [
        "Create Master Data Registry",
        "Update Master Data Registry",
        "Read Master Data Registry",
        "Delete Master Data Registry",
      ],
      element: <NewProduct />,
    },
    {
      path: "locations",
      permission: [
        "Create Master Data Registry",
        "Update Master Data Registry",
        "Read Master Data Registry",
        "Delete Master Data Registry",
      ],
      element: <Locations />,
    },
    {
      path: "locations/new-location",
      permission: [
        "Create Master Data Registry",
        "Update Master Data Registry",
        "Read Master Data Registry",
        "Delete Master Data Registry",
      ],
      element: <NewLocation />,
    },
    {
      path: "locations/new-location/:id",
      permission: [
        "Create Master Data Registry",
        "Update Master Data Registry",
        "Read Master Data Registry",
        "Delete Master Data Registry",
      ],
      element: <NewLocation />,
    },
    {
      path: "vendors",
      permission: [
        "Create Master Data Registry",
        "Update Master Data Registry",
        "Read Master Data Registry",
        "Delete Master Data Registry",
      ],
      element: <Vendors />,
    },
    {
      path: "vendors/new-vendor",
      permission: [
        "Create Master Data Registry",
        "Update Master Data Registry",
        "Read Master Data Registry",
        "Delete Master Data Registry",
      ],
      element: <NewVendor />,
    },
    {
      path: "vendors/new-vendor/:id",
      permission: [
        "Create Master Data Registry",
        "Update Master Data Registry",
        "Read Master Data Registry",
        "Delete Master Data Registry",
      ],
      element: <NewVendor />,
    },
    {
      path: "warehouses",
      permission: [
        "Create Master Data Registry",
        "Update Master Data Registry",
        "Read Master Data Registry",
        "Delete Master Data Registry",
      ],
      element: <Warehouses />,
    },
    {
      path: "warehouses/new-warehouse",
      permission: [
        "Create Master Data Registry",
        "Update Master Data Registry",
        "Read Master Data Registry",
        "Delete Master Data Registry",
      ],
      element: <NewWarehouse />,
    },
    {
      path: "carriers/new-carrier",
      permission: [
        "Create Master Data Registry",
        "Update Master Data Registry",
        "Read Master Data Registry",
        "Delete Master Data Registry",
      ],
      element: <NewCarrier />,
    },
    {
      path: "carriers",
      permission: [
        "Create Master Data Registry",
        "Update Master Data Registry",
        "Read Master Data Registry",
        "Delete Master Data Registry",
      ],
      element: <Carriers />,
    },
    {
      path: "carriers/new-carrier",
      permission: [
        "Create Master Data Registry",
        "Update Master Data Registry",
        "Read Master Data Registry",
        "Delete Master Data Registry",
      ],
      element: <NewCarrier />,
    },
    {
      path: "carriers/new-carrier/:id",
      permission: [
        "Create Master Data Registry",
        "Update Master Data Registry",
        "Read Master Data Registry",
        "Delete Master Data Registry",
      ],
      element: <NewCarrier />,
    },
    {
      path: "units",
      permission: [
        "Create Master Data Registry",
        "Update Master Data Registry",
        "Read Master Data Registry",
        "Delete Master Data Registry",
      ],
      element: <Unit />,
    },
    {
      path: "units/new-unit",
      permission: [
        "Create Master Data Registry",
        "Update Master Data Registry",
        "Read Master Data Registry",
        "Delete Master Data Registry",
      ],
      element: <NewUnit />,
    },
    {
      path: "units/new-unit/:id",
      permission: [
        "Create Master Data Registry",
        "Update Master Data Registry",
        "Read Master Data Registry",
        "Delete Master Data Registry",
      ],
      element: <NewUnit />,
    },
    {
      path: "categories",
      permission: [
        "Create Master Data Registry",
        "Update Master Data Registry",
        "Read Master Data Registry",
        "Delete Master Data Registry",
      ],
      element: <Category />,
    },
    {
      path: "categories/new-category",
      permission: [
        "Create Master Data Registry",
        "Update Master Data Registry",
        "Read Master Data Registry",
        "Delete Master Data Registry",
      ],
      element: <NewCategory />,
    },
    {
      path: "categories/new-category/:id",
      permission: [
        "Create Master Data Registry",
        "Update Master Data Registry",
        "Read Master Data Registry",
        "Delete Master Data Registry",
      ],
      element: <NewCategory />,
    },
  ],
}

];
