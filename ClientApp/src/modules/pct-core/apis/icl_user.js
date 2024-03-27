import { apiRoutes } from "../routes/apiRoutes";
import { getLogMetaData } from "../../../components/auth/getLogMetaData";
import axios from "axios";
import { keycloakInstance } from "../../../authConfig"

export const newicl_user = async (values) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
  }
  await getLogMetaData(axios);
  return await axios.post(`${apiRoutes.icl_user_create}`, values);
};

export const updateicl_user = async (values) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
  }
  await getLogMetaData(axios);
  return await axios.post(`${apiRoutes.icl_user_update}`, values);
};
export const deleteicl_user = async (values) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
  }
  await getLogMetaData(axios);
  return await axios.post(`${apiRoutes.icl_user_delete}` + "/" + values);
};


export const geticl_user = async () => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
  }
  await getLogMetaData(axios);
  return await axios.get(`${apiRoutes.icl_user}`);
};
export const geticl_user_byid = async (values) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
  }
  await getLogMetaData(axios);
  return await axios.get(`${apiRoutes.icl_user_byid}` + "/" + values);
};
export const geticl_user_byemail = async (values) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
  }
  await getLogMetaData(axios);
  return await axios.get(`${apiRoutes.icl_user_byemail}` + "/" + values);
};

export const newicl_user_keycloak = async (values) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
  }
  const { token, selectedUser } = values;
  try {
    let response = null
    await fetch(`${process.env.REACT_APP_KEYCLOAK_URI}admin/realms/${process.env.REACT_APP_REALM}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        username: selectedUser.email,
        email: selectedUser.email,
        enabled: true,
        firstName: selectedUser.fullName,
      })
    }).then(res => {
      response = res;
    }).catch((error) => {
      response = error;
    })
    return response;
  } catch (error) {
    return error
    //throw new Error(error.response.data);
  }
};

export const sendpassicl_user_keycloak = async (values) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
  }
  const { token, selectedUser } = values;

  try {
    const response = await fetch(`${process.env.REACT_APP_KEYCLOAK_URI}admin/realms/${process.env.REACT_APP_REALM}/users/${selectedUser.id}/reset-password-email`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response;
  } catch (error) {
    //throw new Error(error.response.data);
  }
};

export const keycloak_logout = async (token) => {
  if (keycloakInstance.authenticated) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
  }
  try {
    const logoutUrl = `${process.env.REACT_APP_KEYCLOAK_URI}realms/${process.env.REACT_APP_REALM}/protocol/openid-connect/logout`;
    window.location.href = logoutUrl;

  } catch (error) {
    //throw new Error(error.response.data);
  }
};
