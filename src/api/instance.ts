import axios from "axios";

const baseURL =
  (process.env.REACT_APP_API_BASE_URL as string | undefined) ??
  "http://localhost:8080";

export const instance = axios.create({
  baseURL,
  timeout: 10_000,
});

instance.interceptors.request.use((config) => config);
instance.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);
