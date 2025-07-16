import axios from "axios";
import { get, remove } from "../Storage/secureStorage";
import { router } from "expo-router";

export const Axios = axios.create({
    // baseURL: "http://192.168.155.83:8080/api/v1/",
    baseURL: "http://ec2-98-81-241-56.compute-1.amazonaws.com:8080/api/v1/",
})

Axios.interceptors.request.use(async config => {
    const token = await get('token');

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
}, error => {
    return Promise.reject(error);
})

Axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response && error.response.status === 401) {
      await remove("token");
      router.replace("/Authentication/login")
    }
    return Promise.reject(error);
  }
);