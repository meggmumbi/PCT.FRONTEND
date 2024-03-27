import { apiRoutes } from "../routes/apiRoutes";
import { getLogMetaData } from "../../../components/auth/getLogMetaData";
import axios from "axios";


export const getPurchaseOrders = async () => {
    await getLogMetaData(axios);
    return await axios.get(`${apiRoutes.iclPurchaseOrder}`);
};

export const getCustomerOrders = async ({ queryKey }) => {
    await getLogMetaData(axios);
    const [, validated] = queryKey;
    return await axios.get(`${apiRoutes.customerOrder}/${validated}`);
};

export const getPurchaseOrderWithParam = async ({ queryKey }) => {
    await getLogMetaData(axios);
    const [, path, validated] = queryKey;
    return await axios.get(`${apiRoutes.iclPurchaseOrder}/${path}/${validated}`);
};

