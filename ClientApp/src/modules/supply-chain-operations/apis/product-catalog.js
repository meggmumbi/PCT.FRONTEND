import { apiRoutes } from "../routes/apiRoutes";
import { getLogMetaData } from "../../../components/auth/getLogMetaData";
import axios from "axios";
import { keycloakInstance } from "../../../authConfig"

export const getAllProducts = async ({ queryKey }) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = `*`;
  }
  await getLogMetaData(axios);
  const [_, familyCode, searchText] = queryKey;
  return await axios.get(
    `${apiRoutes.productcatalog}/api/Pcmt/GetProducts?family=${
      familyCode == 0 ? "" : familyCode
    }&searchText=${searchText == undefined ? "" : searchText}`
  );
};

export const getFamilies = async ({ queryKey }) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = `*`;
  }
  await getLogMetaData(axios);
  return await axios.get(`${apiRoutes.productcatalog}/api/Pcmt/GetFamilies`);
};

export const getFamilyProducts = async ({ queryKey }) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = `*`;
  }
  await getLogMetaData(axios);
  const [_, familyCode, searchText] = queryKey;
  return await axios.get(
    `${apiRoutes.productcatalog}/api/Pcmt/GetFamilyProducts?searchText=${familyCode}`
  );
};

export const getOrders = async ({ queryKey }) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = `*`;
  }
  await getLogMetaData(axios);
  const [_, email] = queryKey;
  return await axios.get(
    `${apiRoutes.productcatalog}/api/Pcmt/GetOrders?email=${email}`
  );
};

export const getProductImage = async ({ queryKey }) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = `*`;
  }
  await getLogMetaData(axios);
  const [_, familyCode] = queryKey;
  return await axios.get(`${apiRoutes.productcatalog}/api/Pcmt/GetImage`);
};

export const getHistoricalOrders = async ({ queryKey }) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = `*`;
  }
  await getLogMetaData(axios);
  return await axios.get(
    `${apiRoutes.productcatalog}/api/Pcmt/GetHistoricalOrders`
  );
};

export const getProductSelected = async ({ queryKey }) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = `*`;
  }
  await getLogMetaData(axios);
  const [_, identifier] = queryKey;
  return await axios.get(
    `${apiRoutes.productcatalog}/api/Pcmt/GetProductSelected?identifier=${identifier}`
  );
};

export const getRequisitionsListSummary = async ({ queryKey }) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = `*`;
  }
  await getLogMetaData(axios);
  let params = "?tenantId=" + queryKey[1];

  const startDate = queryKey[2];
  const endDate = queryKey[3];

  if (startDate && endDate) {
    params += `&startDate=${startDate}&endDate=${endDate}`;
  }

  let url = `${apiRoutes.requisitionsListSummary}${params}`;
  return await axios.get(url);
};

export const getRequisitionsList = async ({ queryKey }) => {
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
  let url = `${apiRoutes.requisitionsList}${params}`;
  return await axios.get(url);
};

export const getRequisitionsProducts = async ({ queryKey }) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = `*`;
  }
  await getLogMetaData(axios);
  const [_, identifier] = queryKey;
  return await axios.get(
    `${apiRoutes.requisitionsList}/requisition-products/${identifier}`
  );
};
