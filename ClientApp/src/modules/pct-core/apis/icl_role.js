import { apiRoutes } from "../routes/apiRoutes";
import { getLogMetaData } from "../../../components/auth/getLogMetaData";
import axios from "axios";
import { keycloakInstance } from "../../../authConfig"

export const newicl_role = async (values) => {
    if (keycloakInstance.authenticated) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
    }
    await getLogMetaData(axios);
    return await axios.post(`${apiRoutes.icl_role_create}`, values);
};

export const updateicl_role = async (values) => {
    if (keycloakInstance.authenticated) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
    }
    await getLogMetaData(axios);
    return await axios.post(`${apiRoutes.icl_role_update}`, values);
};
export const deleteicl_role = async (values) => {
    if (keycloakInstance.authenticated) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
    }
    await getLogMetaData(axios);
    return await axios.post(`${apiRoutes.icl_role_delete}` + "/" + values);
};


export const geticl_role = async () => {
    if (keycloakInstance.authenticated) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
    }
    await getLogMetaData(axios);
    return await axios.get(`${apiRoutes.icl_role}`);
};
export const geticl_role_byid = async (values) => {
    if (keycloakInstance.authenticated) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
    }
    await getLogMetaData(axios);
    return await axios.get(`${apiRoutes.icl_role_byid}` + "/" + values);
};
export const geticl_role_byname = async (values) => {
    if (keycloakInstance.authenticated) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
    }
    await getLogMetaData(axios);
    return await axios.get(`${apiRoutes.icl_role_byname}` + "/" + values);
};
