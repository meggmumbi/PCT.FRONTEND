import { apiRoutes } from "../routes/apiRoutes";
import { getLogMetaData } from "../../../components/auth/getLogMetaData";
import axios from "axios";
import { keycloakInstance } from "../../../authConfig"

export const addToShoppingCart = async (values) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = `*`;
  }
  await getLogMetaData(axios);
  return axios.post(
    `${apiRoutes.psa_orderFullfilment}/PostShoppingCartItem`,
    values
  );
};

export const saveOrderRequisition = async (values) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = `*`;
  }
  await getLogMetaData(axios);
  return axios.post(
    `${apiRoutes.psa_orderFullfilment}/PostRequisitionOrderItem`,
    values
  );
};

export const saveRequisition = async (values) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = `*`;
  }
  await getLogMetaData(axios);
  return axios.post(
    `${apiRoutes.psa_orderFullfilment}/RequisitionOrder`,
    values
  );
};

export const getRequisitionApprovalStatus = async (values) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = `*`;
  }
  await getLogMetaData(axios);
  if (values.queryKey && values.queryKey.length > 0) {
    return await axios.get(
      `${apiRoutes.requisitionApprovalStatus}` + "/" + values.queryKey[0]
    );
  }
};

export const postRequisitionApproveStatus = async (values) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = `*`;
  }
  await getLogMetaData(axios);
  return await axios.post(`${apiRoutes.requisitionApproval}`, values);
};

export const postDocument = async (values) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = `*`;
  }
  await getLogMetaData(axios);
  return await axios.post(`${apiRoutes.document}`, values);
};

export const postCategory = async (values) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = `*`;
  }
  await getLogMetaData(axios);
  return await axios.post(`${apiRoutes.documentCategory}`, values);
};

export const postSalesQuoteApproveStatus = async (values) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = `*`;
  }
  await getLogMetaData(axios);
  return await axios.get(
    `${apiRoutes.salesQuoteApproval}` +
      "?" +
      new URLSearchParams(values).toString()
  );
};

export const getPurchaseOrderList = async ({ queryKey }) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = `*`;
  }
  await getLogMetaData(axios);
  let params = "";
  if (queryKey.length > 1) {
    let pagination = queryKey[1];
    let tenantId = queryKey[2];
    params =
      "?pageSize=" +
      pagination.pageSize +
      "&pageNumber=" +
      (pagination.pageIndex + 1) +
      "&tenantId=" +
      tenantId;
  }
  return await axios.get(`${apiRoutes.purchaseOrder}${params}`);
};

export const getPurchaseOrderSummary = async ({ queryKey }) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = `*`;
  }
  await getLogMetaData(axios);
  let params;
  if (queryKey.length > 1) {
    let tenantId = queryKey[1];
    params = "?tenantId=" + tenantId;
  }
  return await axios.get(`${apiRoutes.purchaseOrderSummary}${params}`);
};

export const getCategories = async ({ queryKey }) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = `*`;
  }
  await getLogMetaData(axios);
  let params;
  params = "?tenantId=" + queryKey[1];
  return await axios.get(`${apiRoutes.documentCategories}${params}`);
};

export const getCategoryDetails = async (id) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = `*`;
  }
  await getLogMetaData(axios);
  let url = `${apiRoutes.documentCategoryDetails}?id=${id}`;
  console.log("url", url);
  return await axios.get(url);
};

export const getAllCategories = async ({ queryKey }) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = `*`;
  }
  await getLogMetaData(axios);
  let params = "";
  if (queryKey.length > 1) {
    let pagination = queryKey[1];
    params =
      "?pageSize=" +
      pagination.pageSize +
      "&pageNumber=" +
      (pagination.pageIndex + 1) +
      "&tenantId=" +
      queryKey[2];
  }
  let url = `${apiRoutes.documentCategoriesPaginated}${params}`;
  return await axios.get(url);
};

export const getDocuments = async ({ queryKey }) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = `*`;
  }
  await getLogMetaData(axios);
  let params = "";
  if (queryKey.length > 1) {
    let pagination = queryKey[1];
    params =
      "?pageSize=" +
      pagination.pageSize +
      "&pageNumber=" +
      (pagination.pageIndex + 1) +
      "&tenantId=" +
      queryKey[2] +
      "&categoryId=" +
      queryKey[3];
  }
  let url = `${apiRoutes.alldocuments}${params}`;
  return await axios.get(url);
};

export const getDocumentsByCategoryId = async (id) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = `*`;
  }
  await getLogMetaData(axios);
  let url = `${apiRoutes.documentsByCategoryId}/${id}`;
  return await axios.get(url);
};

export const deleteCategoryById = async ({ queryKey }) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = `*`;
  }
  await getLogMetaData(axios);
  const [, id] = queryKey;
  let params = "";
  params = "?Id=" + id;
  return await axios.delete(`${apiRoutes.category_delete}${params}`);
};

export const deleteDocumentById = async (id) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = `*`;
  }
  console.log(id);
  await getLogMetaData(axios);
  return await axios.delete(`${apiRoutes.document_delete}/${id}`);
};

export const getDocumentSelected = async (id) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = `*`;
  }
  console.log(id);
  await getLogMetaData(axios);
  return await axios.get(`${apiRoutes.documentById}/${id}`);
};

export const getRequisitionProducts = async ({ queryKey }) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = `*`;
  }
  await getLogMetaData(axios);
  const [_, requisitionCode] = queryKey;
  return await axios.get(
    `${apiRoutes.requisitionProducts}` + "?code=" + requisitionCode
  );
};
