import { apiRoutes } from "../routes/apiRoutes";
import { getLogMetaData } from "../../../components/auth/getLogMetaData";
import axios from "axios";


export const newUnit = async (values) => {
  await getLogMetaData(axios);
  return await axios.post(`${apiRoutes.unit}`, values);
};

export const getUnits = async () => {
  await getLogMetaData(axios);
  return await axios.get(`${apiRoutes.unit}`);
};

export const updateUnit = async (values) => {
  await getLogMetaData(axios);
  return await axios.put(`${apiRoutes.unit}`, values);
};

export const getUnitById = async ({ queryKey }) => {
  await getLogMetaData(axios);
  const [, id] = queryKey;
  return await axios.get(`${apiRoutes.unit}/${id}`);
};

export const getUnitsByGroup = async ({ queryKey }) => {
  await getLogMetaData(axios);
  const [, group] = queryKey;
  return await axios.get(`${apiRoutes.unit}/units-by-group/${group}`);
};