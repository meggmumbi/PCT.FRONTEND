import { apiRoutes } from "../routes/apiRoutes";
import axios from "axios";
import { keycloakInstance } from "../../../authConfig"

export const getMenus = async ({ queryKey }) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = `*`;
  }
  const [, id] = queryKey;
  return await axios.get(`${apiRoutes.analytics}/api/category/${id}`);
};

export const newMenu = async (values) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = `*`;
  }
  return await axios.post(`${apiRoutes.analytics}/api/category`, values);
};

export const updateMenu = async (values) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = `*`;
  }
  return await axios.post(`${apiRoutes.analytics}/api/category/update`, values);
};

export const getCategoryById = async ({ queryKey }) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = `*`;
  }
  const [, id] = queryKey;
  return await axios.get(
    `${apiRoutes.analytics}/api/category/getCategoryById/${id}`
  );
};

export const deleteCategoryById = async ({ queryKey }) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = `*`;
  }
  const [, id] = queryKey;
  return await axios.delete(
    `${apiRoutes.analytics}/api/category/deleteCategoryById/${id}`
  );
};

export const assignRolePermissions = async (values) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = `*`;
  }
  return await axios.post(`${apiRoutes.analytics}/api/role-permission`, values);
};

export const getRolePermissionsByRoleId = async ({ queryKey }) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = `*`;
  }
  const [, id] = queryKey;
  return await axios.get(
    `${apiRoutes.analytics}/api/role-permission/getRolePermissionsByRoleId/${id}`
  );
};
