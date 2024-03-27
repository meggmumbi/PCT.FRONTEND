import { apiRoutes } from "../routes/apiRoutes";
import { getLogMetaData } from "../../../components/auth/getLogMetaData";
import axios from "axios";
import { keycloakInstance } from "../../../authConfig";

export const getAllTemplates = async ({ queryKey }) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = `*`;
  }
  await getLogMetaData(axios);
  let params = "";
  if (queryKey.length > 1) {
    //let pagination = queryKey[1];
    let tenantId = queryKey[1];
    //params = "?pageSize=" + pagination.pageSize + "&pageNumber=" + (pagination.pageIndex + 1) + "&tenantId=" + (tenantId);
    params = "?tenantId=" + tenantId;
  }
  return await axios.get(`${apiRoutes.dataImportEndPoints}template${params}`);
};
export const getTemplate = async ({ queryKey }) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = `*`;
  }
  await getLogMetaData(axios);
  let params = "";
  if (queryKey.length > 1) {
    let id = queryKey[1];
    params = id;
  }
  return await axios.get(`${apiRoutes.dataImportEndPoints}template/${params}`);
};

export const getVersion = async ({ queryKey }) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = `*`;
  }
  await getLogMetaData(axios);
  let params = "";
  if (queryKey.length > 1) {
    let id = queryKey[1];
    params = id;
  }
  return await axios.get(`${apiRoutes.dataImportEndPoints}version/${params}`);
};

export const postTemplate = async (values) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = `*`;
  }
  await getLogMetaData(axios);
  return await axios.post(`${apiRoutes.dataImportEndPoints}template`, values);
};
export const updateTemplate = async (values) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = `*`;
  }
  await getLogMetaData(axios);
  return await axios.put(`${apiRoutes.dataImportEndPoints}template`, values);
};

export const postVersion = async (values) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = `*`;
  }
  await getLogMetaData(axios);
  return await axios.post(`${apiRoutes.dataImportEndPoints}version`, values);
};
export const updateVersion = async (values) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = `*`;
  }
  await getLogMetaData(axios);
  return await axios.put(`${apiRoutes.dataImportEndPoints}version`, values);
};

export const postDataUpload = async (values) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = `*`;
  }
  await getLogMetaData(axios);
  console.log("values--------post", values);
  return await axios.post(`${apiRoutes.dataImportEndPoints}dataUpload`, values);
};

export const getTenantUploads = async ({ queryKey }) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = `*`;
  }
  await getLogMetaData(axios);
  let tenantId = queryKey[1];
  return await axios.get(
    `${apiRoutes.dataImportEndPoints}dataupload/all-by-tenant-id/${tenantId}`
  );
};

export const getUploadData = async ({ queryKey }) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = `*`;
  }
  await getLogMetaData(axios);
  let uploadId = queryKey[1];
  return await axios.get(
    `${apiRoutes.dataImportEndPoints}dataupload/${uploadId}`
  );
};

export const postUploadData = async ({
  queryKey,
  pageNumber = 0,
  pageSize = 0,
  filterOptions = [],
}) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = `*`;
  }
  await getLogMetaData(axios);
  let uploadId = queryKey[1];
  const requestBody = {
    pageNumber: pageNumber,
    pageSize: pageSize,
    filterOptions: filterOptions,
  };
  return await axios.post(
    `${apiRoutes.postDataImportEndPoints}dataupload/${uploadId}`,
    requestBody
  );
};

export const downloadData = async ({
  queryKey,
  pageNumber = 0,
  pageSize = 0,
  filterOptions = [],
}) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = `*`;
  }
  await getLogMetaData(axios);
  let uploadId = queryKey[1];
  const requestBody = filterOptions;
  return await axios.post(
    `${apiRoutes.postDataImportEndPoints}dataupload/download-data/${uploadId}`,
    filterOptions
  );
};
