import axios from 'axios';
import { QueryOption } from '@/services/common/query';

const requestInstance = axios.create({
  baseURL: process.env.PUBLIC_MQTT_SERVER,
});

export const requestApi: <T = QueryOption, R = any>(api: string, data?: T) => Promise<R> = async (api, data) => {
  const response = await requestInstance.post(api, data);
  return response.data.data;
};
