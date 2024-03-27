export const apiRoutes = {  
  //MASTER DATA REGISTRY
  product: `${process.env.REACT_APP_MASTER_DATA_BACKEND}`,
  unit: `${process.env.REACT_APP_MASTER_DATA_BACKEND}/api/Unit`,
  category: `${process.env.REACT_APP_MASTER_DATA_BACKEND}/api/Category`,
  location: `${process.env.REACT_APP_MASTER_DATA_BACKEND}/api/Location`,
  carrier: `${process.env.REACT_APP_MASTER_DATA_BACKEND}/api/Carrier`,
  vendor: `${process.env.REACT_APP_MASTER_DATA_BACKEND}/api/Vendor`,
  dashboard: `${process.env.REACT_APP_MASTER_DATA_BACKEND}/api/Dashboard`,
};