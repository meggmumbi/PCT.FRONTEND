import { apiRoutes } from "../routes/apiRoutes";
import { getLogMetaData } from "../../../components/auth/getLogMetaData";
import axios from "axios";
import { keycloakInstance } from "../../../authConfig"

export const postOrganization = async (values) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
  }
  await getLogMetaData(axios);
  return await axios.post(`${apiRoutes.newOrganization}`, values);
};

export const getOrganizationDetails = async (id) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
  }
  await getLogMetaData(axios);
  let url = `${apiRoutes.organizationDetails}/${id}`;
  console.log('url', url);
  return await axios.get(url);
};

export const getOrganizations = async (values) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
  }
  await getLogMetaData(axios);
  return await axios.get(`${apiRoutes.allOrganizations}`, values);
};

export const deleteOrganization = async (id) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
  }
  await getLogMetaData(axios);
  let url = `${apiRoutes.organizationDetails}/${id}`;
  console.log('Delete URL', url);

  try {
    const response = await axios.delete(url);
    console.log('Delete success', response.data);
    return response.data;
  } catch (error) {
    console.error('Delete error', error);
    throw error;
  }
};