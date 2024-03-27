import { apiRoutes } from "../routes/apiRoutes";
import { getLogMetaData } from "../../../components/auth/getLogMetaData";
import axios from "axios";
import { keycloakInstance } from "../../../authConfig"

export const getShipmentList = async ({ queryKey }) => {
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
  return await axios.get(`${apiRoutes.shipment}${params}`);
};

export const getShipmentListSummary = async ({ queryKey }) => {
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
  return await axios.get(`${apiRoutes.shipmentSummary}${params}`);
};
