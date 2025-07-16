import axios from "axios";

export const Axios = axios.create({
    baseURL: "http://ec2-98-81-241-56.compute-1.amazonaws.com:8080/api/v1/admin/",
})

Axios.interceptors.request.use(async config => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
}, error => {
    return Promise.reject(error);
})

Axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
