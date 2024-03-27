import { apiRoutes } from "../routes/apiRoutes";
import { getLogMetaData } from "../../../components/auth/getLogMetaData";
import axios from "axios";


export const getDashboardStatistics = async () => {
    await getLogMetaData(axios);
    return await axios.get(`${apiRoutes.dashboard}`);
};
