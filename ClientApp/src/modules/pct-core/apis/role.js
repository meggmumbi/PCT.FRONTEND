import { apiRoutes } from "../routes/apiRoutes";
import { getLogMetaData } from "../../../components/auth/getLogMetaData";
import axios from "axios";
import { keycloakInstance } from "../../../authConfig"

export const newRole = async (values) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
  }
  await getLogMetaData(axios);
  return await axios.post(`${apiRoutes.role}`, values);
};

export const getRoles = async () => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
  }
  await getLogMetaData(axios);
  return await axios.get(`${apiRoutes.role}`);
};