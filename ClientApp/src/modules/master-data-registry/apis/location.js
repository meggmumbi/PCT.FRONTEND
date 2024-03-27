import { apiRoutes } from "../routes/apiRoutes";
import { getLogMetaData } from "../../../components/auth/getLogMetaData";
import axios from "axios";


export const newLocation = async (values) => {
  await getLogMetaData(axios);
  return await axios.post(`${apiRoutes.location}`, values);
};

export const getLocations = async () => {
  await getLogMetaData(axios);
  return await axios.get(`${apiRoutes.location}`);
};

export const getLocationById = async ({ queryKey }) => {
  await getLogMetaData(axios);
  const [, id] = queryKey;
  return await axios.get(`${apiRoutes.location}/${id}`);
};

export const updateLocation = async (values) => {
  await getLogMetaData(axios);
  return await axios.put(`${apiRoutes.location}`, values);
};

export const deleteLocationById = async ({ queryKey }) => {
  await getLogMetaData(axios);
  const [, id] = queryKey;
  return await axios.delete(`${apiRoutes.location}/${id}`);
};