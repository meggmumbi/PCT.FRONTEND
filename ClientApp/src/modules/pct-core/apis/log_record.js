import { apiRoutes } from "../routes/apiRoutes";
import { getLogMetaData } from "../../../components/auth/getLogMetaData";
import axios from "axios";


export const getlog_record = async () => {
    await getLogMetaData(axios);
    return await axios.get(`${apiRoutes.log_record}`);
};

export const getlog_record_users = async () => {
    await getLogMetaData(axios);
    return await axios.get(`${apiRoutes.log_record_users}`);
};
export const getlog_record_structures = async () => {
    await getLogMetaData(axios);
    return await axios.get(`${apiRoutes.log_record_structures}`);
};

export const getlog_record_byuser = async (values) => {
    await getLogMetaData(axios);
    if (values.queryKey && values.queryKey.length > 0) { 
        return await axios.get(`${apiRoutes.log_record_byuser}` + "/" + values.queryKey[0]);
    }
};
export const getlog_record_bystructure = async (values) => {
    await getLogMetaData(axios);
    if (values.queryKey && values.queryKey.length > 0) { 
        return await axios.get(`${apiRoutes.log_record_bystructure}` + "/" + values.queryKey[0]);
    }
};
