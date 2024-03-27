import { apiRoutes } from "../routes/apiRoutes";
import { getLogMetaData } from "../../../components/auth/getLogMetaData";
import axios from "axios";

export const newCMSContentRoles = async (values) => {
  await getLogMetaData(axios);
  return await axios.post(`${apiRoutes.cmscontentroles}`, values);
};

export const getCMSContentRoles = async () => {
  await getLogMetaData(axios);
  return await axios.get(`${apiRoutes.cmscontentroles}`);
};

export const GetCMSContentRolessByID = async (values) => {
    await getLogMetaData(axios);
    if (values.queryKey[0].length <= 0) { 
        return "";
    }
    var result=await axios.get(`${apiRoutes.cmscontentrolesbyid}` + "/" + values.queryKey[0] + "/" + values.queryKey[1]);
    return result;
};
