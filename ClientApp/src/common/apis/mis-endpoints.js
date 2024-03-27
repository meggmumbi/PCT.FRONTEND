import { apiRoutes } from "../routes/apiRoutes";
import { getLogMetaData } from "../../components/auth/getLogMetaData";
import axios from "axios";
import { keycloakInstance } from "../../authConfig"

export const getPermissions = async ({ queryKey }) => {
    if (keycloakInstance.authenticated) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
    }
    return await axios.get(`${apiRoutes.misendpoints}/api/pct-core/user-management/Permission`);
}
export const checkPermission = async ({ queryKey }) => {
    if (keycloakInstance.authenticated) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
    }
    return await axios.get(`${apiRoutes.misendpoints}/api/pct-core/user-management/Permission/by-code-user-tenant/${queryKey[1]}/${queryKey[2]}/${queryKey[3]}`);
}
export const checkPermissionByName = async ({ queryKey }) => {
    if (keycloakInstance.authenticated) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
    }
    return await axios.get(`${apiRoutes.misendpoints}/api/pct-core/user-management/Permission/by-name-user-tenant/${queryKey[1]}/${queryKey[2]}/${queryKey[3]}`);
}
export const checkPermissionRoutes = async ({ queryKey }) => {
    if (keycloakInstance.authenticated) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
    }
    return await axios.get(`${apiRoutes.misendpoints}/api/pct-core/user-management/Permission/routes-by-user-tenant/${queryKey[1]}/${queryKey[2]}`);
}
export const newPermission_batch = async (values) => {
    if (keycloakInstance.authenticated) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
    }
    return await axios.post(`${apiRoutes.misendpoints}/api/pct-core/user-management/Permission/permission-create-batch`, values);
};
export const getPermissionByUser = async ({ queryKey }) => {
    if (keycloakInstance.authenticated) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
    }
    return await axios.get(`${apiRoutes.misendpoints}/api/pct-core/user-management/Permission/permissions-by-user-tenant/${queryKey[1]}/${queryKey[2]}`);
}
export const deleteRoleById = async ({ queryKey }) => {
    if (keycloakInstance.authenticated) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
    }
    return await axios.post(`${apiRoutes.misendpoints}/api/pct-core/Role/role-delete/${queryKey[1]}`);
}

export const getAllSites = async ({ queryKey }) => {
    if (keycloakInstance.authenticated) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
    }
    return await axios.get(`${apiRoutes.misendpoints}/api/pct-core/tenant`);
};

export const getUserSites = async ({ queryKey }) => {
    if (keycloakInstance.authenticated) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
    }
    const [, id] = queryKey; return await axios.get(`${apiRoutes.misendpoints}/api/pct-core/tenant/tenants-by-user?email=${queryKey[1]}`);
};

export const getSite = async ({ queryKey }) => {
    if (keycloakInstance.authenticated) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
    }
    return await axios.get(`${apiRoutes.misendpoints}/api/pct-core/tenant/${queryKey[1]}`);
};


export const getTenantPermissions = async ({ queryKey }) => {
    if (keycloakInstance.authenticated) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
    }
    let tenant = queryKey[1]
    return await axios.get(`${apiRoutes.misendpoints}/api/pct-core/user-management/Permission/GetPermissionByTenant?tenantId=${tenant.id}`);
};

export const getAllRoles = async ({ queryKey }) => {
    if (keycloakInstance.authenticated) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
    }
    return await axios.get(`${apiRoutes.misendpoints}/api/pct-core/Role/role-all`);
};
export const getRole = async ({ queryKey }) => {
    if (keycloakInstance.authenticated) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
    }
    const [, id] = queryKey;
    return await axios.get(`${apiRoutes.misendpoints}/api/pct-core/Role/role-by-id/${id}`);
};


export const getAllUsers = async ({ queryKey }) => {
    if (keycloakInstance.authenticated) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
    }
    return await axios.get(`${apiRoutes.misendpoints}/api/pct-core/user-management/User/user-all`);
};

export const getUser = async ({ queryKey }) => {
    if (keycloakInstance.authenticated) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
    }
    return await axios.get(`${apiRoutes.misendpoints}/api/pct-core/user-management/User/user-by-id/${queryKey[1]}`);
};

export const saveSite = async (values) => {
    if (keycloakInstance.authenticated) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
    }
    await getLogMetaData(axios);
    return axios.post(`${apiRoutes.misendpoints}/api/pct-core/tenant`, values);
};


export const saveRole = async (values) => {
    if (keycloakInstance.authenticated) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
    }
    await getLogMetaData(axios);
    return axios.post(`${apiRoutes.misendpoints}/api/pct-core/Role/role-create`, values);
};

export const updateRole = async (values) => {
    if (keycloakInstance.authenticated) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
    }
    await getLogMetaData(axios);
    return axios.put(`${apiRoutes.misendpoints}/api/pct-core/Role/role-create`, values);
};

export const saveUser = async (values) => {
    if (keycloakInstance.authenticated) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${keycloakInstance.token}`;
    }
    await getLogMetaData(axios);
    return axios.post(`${apiRoutes.misendpoints}/api/pct-core/user-management/User/user-create`, values);
};
