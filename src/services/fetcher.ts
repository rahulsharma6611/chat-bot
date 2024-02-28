import axios, { AxiosRequestConfig } from 'axios';

export const fetcher = async (url: string, axiosConfig?: AxiosRequestConfig) => {
  const response = await axios({
    url,
    ...axiosConfig,
  });
  return response.data;
};
