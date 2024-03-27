import { apiRoutes } from "../routes/apiRoutes";
import { getLogMetaData } from "../../../components/auth/getLogMetaData";
import axios from "axios";

export const newCMSContentImpact = async (values) => {
  await getLogMetaData(axios);
  return await axios.post(`${apiRoutes.cmscontentimpact}`, values);
};

export const getCMSContentImpact = async () => {
  await getLogMetaData(axios);
  return await axios.get(`${apiRoutes.cmscontentimpact}`);
};

export const getCMSContentImpactByRol = async (values) => {
    await getLogMetaData(axios);
    if (values.queryKey[0].length <= 0) {
        return "";
    }
    return await axios.get(`${apiRoutes.cmscontentimpactbyrol}` + "/" + values.queryKey[0]);
};

export const getCMSContentImpactByName = async (values) => {
    await getLogMetaData(axios);
    if (values.queryKey[0].length <= 0) {
        return "";
    }
    return await axios.get(`${apiRoutes.cmscontentimpactbyname}` + "/" + values.queryKey[0]);
};