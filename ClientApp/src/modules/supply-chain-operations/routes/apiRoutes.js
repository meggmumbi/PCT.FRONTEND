export const apiRoutes = {  
    psa_orderFullfilment: `${process.env.REACT_APP_SUPPLY_OPERATION_BACKEND}/api`,
    requisitionsList: `${process.env.REACT_APP_SUPPLY_OPERATION_BACKEND}/api/RequisitionOrder`,
    requisitionsListSummary: `${process.env.REACT_APP_SUPPLY_OPERATION_BACKEND}/api/RequisitionOrder/requisition-summary`,
    requisitionApprovalStatus: `${process.env.REACT_APP_SUPPLY_OPERATION_BACKEND}/api/RequisitionApproval/approvals-by-requisitionid`,
    requisitionApproval: `${process.env.REACT_APP_SUPPLY_OPERATION_BACKEND}/api/RequisitionApproval`,
    requisitionProducts: `${process.env.REACT_APP_SUPPLY_OPERATION_BACKEND}/api/RequisitionOrder/requisition-by-code`,
    // Sales Quote
    salesQuote: `${process.env.REACT_APP_SUPPLY_OPERATION_BACKEND}/api/sales-quote`,
    salesQuoteApproval: `${process.env.REACT_APP_SUPPLY_OPERATION_BACKEND}/api/sales-quote/approve-sales-quote`,
    salesQuoteSummary: `${process.env.REACT_APP_SUPPLY_OPERATION_BACKEND}/api/sales-quote/summary`,
    // PO
    iclPurchaseOrder: `${process.env.REACT_APP_SUPPLY_OPERATION_BACKEND}/api/PurchaseOrder`,
    customerOrder: `${process.env.REACT_APP_SUPPLY_OPERATION_BACKEND}/api/PurchaseOrder/outbound`,
    purchaseOrder: `${process.env.REACT_APP_SUPPLY_OPERATION_BACKEND}/api/purchase-order`,
    purchaseOrderSummary: `${process.env.REACT_APP_SUPPLY_OPERATION_BACKEND}/api/purchase-order/summary`,
  
    // shipment
    shipment: `${process.env.REACT_APP_SUPPLY_OPERATION_BACKEND}/api/shipment`,
    shipmentSummary: `${process.env.REACT_APP_SUPPLY_OPERATION_BACKEND}/api/shipment/summary`,
  
    // Supply plan
    supplyPlanList: `${process.env.REACT_APP_SUPPLY_OPERATION_BACKEND}/api/SupplyPlan`,
    supplyPlanListSummary: `${process.env.REACT_APP_SUPPLY_OPERATION_BACKEND}/api/SupplyPlan/supply-plan-summary`,
    supplyPlanUpload: `${process.env.REACT_APP_SUPPLY_OPERATION_BACKEND}/api/SupplyPlan`,
    supplyPlanApproval: `${process.env.REACT_APP_SUPPLY_OPERATION_BACKEND}/api/SupplyPlan/change-status`,
    supplyPlanSummary: `${process.env.REACT_APP_SUPPLY_OPERATION_BACKEND}/api/SupplyPlan/tenant/`,
  
};