import { apiRoutes } from "../routes/apiRoutes";
import { getLogMetaData } from "../../../components/auth/getLogMetaData";
import axios from "axios";
import { keycloakInstance } from "../../../authConfig"

export const newUser = async (values) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
  }
  await getLogMetaData(axios);
  return await axios.post(`${apiRoutes.user}`, values);
};

export const getUsers = async () => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
  }
  await getLogMetaData(axios);
  return await axios.get(`${apiRoutes.user}`);
};

export const getUserById = async ({ queryKey }) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
  }
  const [_, id] = queryKey;
  return await axios.get(`${apiRoutes.userManagement}/user-by-id/${id}`);
};

export const getUserByEmail = async ({ queryKey }) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
  }
  const [_, id] = queryKey;
  return await axios.get(`${apiRoutes.userManagement}/user-by-email/${id}`);
};