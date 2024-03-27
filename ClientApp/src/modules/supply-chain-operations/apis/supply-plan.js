import { apiRoutes } from "../routes/apiRoutes";
import { getLogMetaData } from "../../../components/auth/getLogMetaData";
import axios from "axios";
import { keycloakInstance } from "../../../authConfig"

export const getSupplyPlanList = async ({ queryKey }) => {
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
    params +=
      "?pageSize=" +
      pagination.pageSize +
      "&pageNumber=" +
      (pagination.pageIndex + 1) +
      "&tenantId=" +
      tenantId;
  }
  return await axios.get(`${apiRoutes.supplyPlanList}` + params);
};

export const saveSupplyPlan = async (values) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = `*`;
  }
  await getLogMetaData(axios);
  return axios.post(`${apiRoutes.supplyPlanUpload}/`, values);
};

export const getSupplyPlan = async ({ queryKey }) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = `*`;
  }
  await getLogMetaData(axios);
  const [_, identifier] = queryKey;
  return await axios.get(
    `${apiRoutes.supplyPlanList}/SupplyPlanById/${identifier}`
  );
};

export const postSupplyPlanApproveStatus = async (values) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common["Access-Control-Allow-Origin"] = `*`;
  }
  await getLogMetaData(axios);
  var url = new URL(`${apiRoutes.supplyPlanApproval}`);
  url.search = new URLSearchParams(values);
  return await axios.put(url);
};

export const getSupplyPlanSummary = async ({ queryKey }) => {
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

  return await axios.get(`${apiRoutes.supplyPlanListSummary}${params}`);
};
