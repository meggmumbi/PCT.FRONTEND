import { apiRoutes } from "../routes/apiRoutes";
import { getLogMetaData } from "../../../components/auth/getLogMetaData";
import axios from "axios";

export const newicl_country = async (values) => {
  await getLogMetaData(axios);
  return await axios.post(`${apiRoutes.icl_country_create}`, values);
};

export const updateicl_country = async (values) => {
    await getLogMetaData(axios);
    return await axios.post(`${apiRoutes.icl_country_update}`, values);
};
export const deleteicl_country = async (values) => {
    await getLogMetaData(axios);
    return await axios.post(`${apiRoutes.icl_country_delete}` + "/" + values);
};


export const geticl_country = async () => {
    await getLogMetaData(axios);
    return await axios.get(`${apiRoutes.icl_country}`);
};
export const geticl_country_byid = async (values) => {
    await getLogMetaData(axios);
    return await axios.get(`${apiRoutes.icl_country_byid}` + "/" + values);
};
export const geticl_country_byname = async (values) => {
    await getLogMetaData(axios);
    return await axios.get(`${apiRoutes.icl_country_byname}` + "/" + values);
};
