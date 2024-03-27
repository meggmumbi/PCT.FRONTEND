import { apiRoutes } from "../routes/apiRoutes";
import { getLogMetaData } from "../../../components/auth/getLogMetaData";
import axios from "axios";
import { keycloakInstance } from "../../../authConfig"

export const newicl_user_role = async (values) => {
    if (keycloakInstance.authenticated) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
    }
    await getLogMetaData(axios);
    return await axios.post(`${apiRoutes.icl_user_role_create}`, values);
};
export const newicl_user_role_batch = async (values) => {
    if (keycloakInstance.authenticated) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
    }
    await getLogMetaData(axios);
    return await axios.post(`${apiRoutes.icl_user_role_create_batch}`, values);
};
export const updateicl_user_role = async (values) => {
    if (keycloakInstance.authenticated) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
    }
    await getLogMetaData(axios);
    return await axios.post(`${apiRoutes.icl_user_role_update}`, values);
};
export const updateicl_user_role_batch = async (values) => {
    if (keycloakInstance.authenticated) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
    }
    await getLogMetaData(axios);
    return await axios.post(`${apiRoutes.icl_user_role_update_batch}`, values);
};
export const deleteicl_user_role = async (values) => {
    if (keycloakInstance.authenticated) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
    }
    await getLogMetaData(axios);
    return await axios.post(`${apiRoutes.icl_user_role_delete}` + "/" + values);
};


export const geticl_user_role = async () => {
    if (keycloakInstance.authenticated) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
    }
    await getLogMetaData(axios);
    return await axios.get(`${apiRoutes.icl_user_role}`);
};
export const geticl_user_role_byid = async (values) => {
    if (keycloakInstance.authenticated) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
    }
    await getLogMetaData(axios);
    return await axios.get(`${apiRoutes.icl_user_role_byid}` + "/" + values);
};
export const geticl_user_role_byuser = async (values) => {
    if (keycloakInstance.authenticated) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
    }
    await getLogMetaData(axios);
    return await axios.get(`${apiRoutes.icl_user_role_byuser}` + "/" + values);
};
export const geticl_user_role_byrole = async (values) => {
    if (keycloakInstance.authenticated) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
    }
    await getLogMetaData(axios);
    return await axios.get(`${apiRoutes.icl_user_role_byrole}` + "/" + values);
};
export const geticl_user_role_bycountry = async (values) => {
    if (keycloakInstance.authenticated) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
    }
    await getLogMetaData(axios);
    return await axios.get(`${apiRoutes.icl_user_role_bycountry}` + "/" + values);
};
