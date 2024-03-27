import React from "react";

import async from "../../../components/Async";

import PSALayout from "../layout/PSALayout";
// Guards
import AuthGuard from "../../../components/guards/AuthGuard";

import SupplyPlanRequisition from "../components/supply-plan/SupplyPlanRequisition";
import RequisitionsOrderCart from "../components/order-management/requisitions/RequisitionsOrderCart";
import ApprovalsDetails from "../components/order-management/approvals/ApprovalsDetails";
import RequisitionSelectPage from "../components/order-management/requisitions/RequisitionSelectPage";
import RequisitionUploadPage from "../components/order-management/requisitions/RequisitionUploadPage";
import RequisitionProductsList from "../components/order-management/requisitions/RequisitionProductsList";
import SupplyPlanUploadPage from "../components/supply-plan/SupplyPlanUploadPage";
import SupplyPlanDetailPage from "../components/supply-plan/SupplyPlanDetailPage";
import RequisitionDetailPage from "../components/order-management/requisitions/RequisitionDetailPage";
import SalesQuote from "../components/order-management/salesquotes/SalesQuote";

const PSA = async(() => import("../components/index"));
const PSAHOME = async(() => import("../components/order-management/Home"));
const CreateNewOrder = async(() =>
  import("../components/order-management/CreateNewOrder")
);
const HistoricalOrder = async(() =>
  import("../components/order-management/HistoricalOrder")
);
const ProductDetailPage = async(() =>
  import("../components/order-management/ProductDetailPage")
);
const RequisitionProductDetailPage = async(() =>
  import(
    "../components/order-management/requisitions/RequisitionProductDetailPage"
  )
);
const ProductDetails = async(() =>
  import("../components/order-management/ProductDetails")
);
const RequisitionOrderForm = async(() =>
  import("../components/order-management/RequisitionOrderForm")
);
const RequisitionOrderList = async(() =>
  import("../components/order-management/requisitions/index")
);
const StockPlan = async(() =>
  import("../components/order-management/stockplan/index")
);
const ApprovalsList = async(() =>
  import("../components/order-management/approvals/index")
);
const SalesQuotesList = async(() =>
  import("../components/order-management/salesquotes/index")
);
const Simulations = async(() =>
  import("../components/order-management/simulations")
);
const RequisitionOrderGeneralDetails = async(() =>
  import(
    "../components/order-management/requisitions/RequisitionOrderGeneralDetails"
  )
);

const ProductsList = async(() =>
  import("../components/order-management/ProductsList")
);
const OrderTracking = async(() =>
  import("../components/order-management/OrderTracking")
);
const OrderTrackingList = async(() =>
  import("../components/order-management/OrderTrackingList")
);
const ShippingDetails = async(() =>
  import("../components/order-management/shipping/ShippingDetails")
);
const ShippingList = async(() =>
  import("../components/order-management/shipping/ShippingList")
);
const ShippingTracking = async(() =>
  import("../components/order-management/shipping/ShippingTracking")
);
const PurchaseOrder = async(() =>
  import("../components/order-management/purchase-order/index")
);
const PurchaseOrderApproval = async(() =>
  import("../components/order-management/purchase-order/PurchaseOrder")
);


export const psaRoutes = [    
  
   //PSA Routes
   {
    path: "psa",
    permission: [
      "Create Supply Plan",
      "Create Requisition",
      "Approve Requisition",
      "Create Sales Quote",
      "Create Purchase Order",
      "View Shipments",
      "View Simulation",
    ],
    element: (
      <AuthGuard>
        <PSALayout />
      </AuthGuard>
    ),
    children: [
      {
        path: "",
        permission: [
          "Create Supply Plan",
          "Create Requisition",
          "Approve Requisition",
          "Create Sales Quote",
          "Create Purchase Order",
          "View Shipments",
          "View Simulation",
        ],
        element: <PSAHOME />,
      },
      {
        path: "requisition-order-list",
        permission: ["Create Requisition"],
        element: <RequisitionOrderList />,
      },
      {
        path: "approve-purchase-order",
        permission: ["Create Purchase Order"],
        element: <PurchaseOrderApproval />,
      },
      {
        path: "approvals",
        permission: ["Approve Requisition"],
        element: <ApprovalsList />,
      },
      {
        path: "approve-approvals",
        permission: ["Approve Requisition"],
        element: <ApprovalsDetails />,
      },
      {
        path: "sales-quotes",
        permission: ["Create Sales Quote"],
        element: <SalesQuotesList />,
      },
      {
        path: "sales-quotes-details",
        permission: ["Create Sales Quote"],
        element: <SalesQuote />,
      },
      {
        path: "simulations",
        permission: ["View Simulation"],
        element: <Simulations />,
      },
      {
        path: "create-new-order",
        permission: ["Create Requisition"],
        element: <CreateNewOrder />,
      },
      {
        path: "requisition-order-general-details",
        permission: ["Create Requisition"],
        element: <RequisitionOrderGeneralDetails />,
      },
      {
        path: "supply-plan-requisition",
        permission: ["Create Supply Plan"],
        element: <SupplyPlanRequisition />,
      },

      {
        path: "requisition-product-list",
        permission: ["Create Requisition"],
        element: <RequisitionProductsList />,
      },
      {
        path: "requisition-upload",
        permission: ["Create Requisition"],
        element: <RequisitionUploadPage />,
      },
      {
        path: "supply-plan-upload",
        permission: ["Create Supply Plan"],
        element: <SupplyPlanUploadPage />,
      },
      {
        path: "supply-plan-detail-page",
        permission: ["Create Supply Plan"],
        element: <SupplyPlanDetailPage />,
      },
      {
        path: "requisition-detail-page",
        permission: ["Create Requisition"],
        element: <RequisitionDetailPage />,
      },
      {
        path: "requisition-by-stock-plan",
        permission: ["Create Requisition"],
        element: <RequisitionSelectPage />,
      },
      {
        path: "requisition-order-cart",
        permission: ["Create Requisition"],
        element: <RequisitionsOrderCart />,
      },
      {
        path: "purchase-orders",
        permission: ["Create Purchase Order"],
        element: <PurchaseOrder />,
      },
      {
        path: "historical-orders",
        permission: ["Create Purchase Order"],
        element: <HistoricalOrder />,
      },
      {
        path: "product-details/:identifier",
        permission: ["Create Purchase Order"],
        element: <ProductDetails />,
      },
      {
        path: "product-details-page/:product_code",
        permission: ["Create Purchase Order"],
        element: <ProductDetailPage />,
      },
      {
        path: "requisition-product-details-page/:product_code",
        permission: ["Create Requisition"],
        element: <RequisitionProductDetailPage />,
      },
      {
        path: "requisition-order-form",
        permission: ["Create Requisition"],
        element: <RequisitionOrderForm />,
      },

      {
        path: "products-list/:family_code",
        permission: ["Create Requisition"],
        element: <ProductsList />,
      },
      {
        path: "order-tracking/:orderId",
        permission: ["Create Purchase Order"],
        element: <OrderTracking />,
      },
      {
        path: "order-tracking-list",
        permission: ["Create Purchase Order"],
        element: <OrderTrackingList />,
      },
      {
        path: "shipping-details",
        permission: ["View Shipments"],
        element: <ShippingDetails />,
      },
      {
        path: "shipping-list",
        permission: ["View Shipments"],
        element: <ShippingList />,
      },
      {
        path: "shipping-tracking",
        permission: ["View Shipments"],
        element: <ShippingTracking />,
      },
      {
        path: "purchase-orders",
        permission: ["Create Purchase Order"],
        element: <PurchaseOrder />,
      },
    ],
  }
  

];


