import { apiRoutes } from "../routes/apiRoutes";
import { getLogMetaData } from "../../../components/auth/getLogMetaData";
import axios from "axios";
import { keycloakInstance } from "../../../authConfig";

export const getAllDataExportDbConfigs = async ({ queryKey }) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = `*`;
  }
  await getLogMetaData(axios);
  const [, tenant_id] = queryKey;
  return await axios.get(
    `${apiRoutes.dataExportDbConfigs}/Configs/${tenant_id}`
  );
};

export const getAllData = async ({ queryKey }) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = `*`;
  }
  await getLogMetaData(axios);
  const [, tenant_id, id] = queryKey;

  return await axios.get(
    `${apiRoutes.dataExportDbConfigs}/Configs/data/${tenant_id}/${id}`
  );
};

export const postExportData = async ({
  queryKey,
  pageNumber = 1,
  pageSize = 10,
  searchOptions = [],
}) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = `*`;
  }
  await getLogMetaData(axios);
  const [, tenant_id, config_id] = queryKey;
  var id = config_id;

  const requestBody = {
    pageNumber: pageNumber + 1,
    pageSize: pageSize,
    filterOptions: searchOptions,
  };

  return await axios.post(
    `${apiRoutes.dataExportDbConfigs}/Configs/${id}`,
    requestBody
  );
};

export const downloadData = async ({
  queryKey,
  pageNumber = 1,
  pageSize = 10,
  searchOptions = [],
}) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = `*`;
  }
  await getLogMetaData(axios);
  const [, tenant_id, config_id] = queryKey;

  const requestBody = {
    pageNumber: pageNumber + 1,
    pageSize: pageSize,
    searchOptions: searchOptions,
  };
  return await axios.post(
    `${apiRoutes.dataExportDbConfigs}/Configs/download-data/${config_id}`,
    searchOptions
  );
};

export const getAllDataExportDbConfigColumns = async ({ queryKey }) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = `*`;
  }
  await getLogMetaData(axios);
  return await axios.get(
    `${apiRoutes.dataExportDbConfigs}/DataExportDbConfigColumns`
  );
};

export const newDataExportDb = async (values) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = `*`;
  }
  await getLogMetaData(axios);
  return await axios.post(
    `${apiRoutes.dataExportDbConfigs}/DataExportDbConfigs`,
    values
  );
};
