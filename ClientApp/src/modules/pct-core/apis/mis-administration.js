import { apiRoutes } from "../routes/apiRoutes";
import axios from "axios";
import { keycloakInstance } from "../../../authConfig"

export const getApplications = async () => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
  }
  return await axios.get(`${apiRoutes.application}/GetAllApplications`);
};

export const getAllApplicationsWithModules = async () => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
  }
  return await axios.get(
    `${apiRoutes.application}/GetAllApplicationsWithModules?isActive=true`
  );
};

export const newApplication = async (values) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
  }
  return await axios.post(`${apiRoutes.application}`, values);
};

export const newModule = async (values) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
  }
  return await axios.post(`${apiRoutes.module}`, values);
};

export const newTenant = async (values) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
  }
  return await axios.post(`${apiRoutes.tenant}`, values);
};
export const updateTenant = async (values) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
  }
  return await axios.put(`${apiRoutes.tenant}`, values);
};

export const getTenant = async ({ queryKey }) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
  }
  return await axios.get(`${apiRoutes.tenant}/${queryKey[1]}`);
};

export const getApplication = async ({ queryKey }) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
  }
  const [, id] = queryKey;
  return await axios.get(`${apiRoutes.application}/application/${id}`);
};

export const changeStatus = async ({ id, status }) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
  }
  return await axios.put(
    `${apiRoutes.application}/change-status?Id=${id}&status=${status}`
  );
};

export const getApplicationModules = async ({ queryKey }) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
  }
  const [, applicationId] = queryKey;
  return await axios.get(`${apiRoutes.module}/application/${applicationId}`);
};

export const changeModuleStatus = async ({ moduleId, status }) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
  }
  return await axios.put(
    `${apiRoutes.module}/change-status?Id=${moduleId}&status=${status}`
  );
};

