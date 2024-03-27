import { apiRoutes } from "../routes/apiRoutes";
import { getLogMetaData } from "../../../components/auth/getLogMetaData";
import axios from "axios";

export const newicl_options_route = async (values) => {
  await getLogMetaData(axios);
  return await axios.post(`${apiRoutes.icl_options_route_create}`, values);
};
export const newicl_options_route_batch = async (values) => {
    await getLogMetaData(axios);
    return await axios.post(`${apiRoutes.icl_options_route_create_batch}`, values);
};
export const updateicl_options_route = async (values) => {
    await getLogMetaData(axios);
    return await axios.post(`${apiRoutes.icl_options_route_update}`, values);
};
export const updateicl_options_route_batch = async (values) => {
    await getLogMetaData(axios);
    return await axios.post(`${apiRoutes.icl_options_route_update_batch}`, values);
};
export const deleteicl_options_route = async (values) => {
    await getLogMetaData(axios);
    return await axios.post(`${apiRoutes.icl_options_route_delete}` + "/" + values);
};

export const geticl_options_route = async () => {
    await getLogMetaData(axios);
    return await axios.get(`${apiRoutes.icl_options_route}`);
};
export const geticl_options_route_byid = async (values) => {
    await getLogMetaData(axios);
    return await axios.get(`${apiRoutes.icl_options_route_byid}` + "/" + values);
};
export const geticl_options_route_userid = async (values) => {
    await getLogMetaData(axios);
    return await axios.get(`${apiRoutes.icl_options_route_byuserid}` + "/" + values);
};

