import axios from "axios";
import { getCurrentUser } from "../helper/storage";

export const hostInstance = axios.create({
  baseURL: process.env.REACT_APP_HOST,
  timeout: 5000,
});

hostInstance.interceptors.request.use(
  async (config) => {
    const token = getCurrentUser();

    if (token) {
      config.headers.Authorization = `${token.tokenType}${token.accessToken}`;
    }

    return config;
  },
  (error) => {
    console.log("요청 직전 오류", error);
    return Promise.reject(error);
  }
);

hostInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // accessToken 만료로 인한 401 에러인 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // const refreshToken = localStorage.getItem("refreshToken");

        // // refresh 요청
        // // const refreshRes = await axios.post(
        // //   "http://localhost:8080/api/auth/refresh",
        // //   {
        // //     refreshToken,
        // //   }
        // // );

        // const refreshRes = apiGetRefreshToken(refreshToken);

        // const { accessToken: newToken, tokenType } = refreshRes.data;

        // // 새로운 토큰 저장
        // localStorage.setItem("accessToken", newToken);
        // localStorage.setItem("tokenType", tokenType || "Bearer ");

        // // 기존 요청에 새 토큰을 붙여서 재요청
        // originalRequest.headers.Authorization = `${tokenType}${newToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        console.error("토큰 재발급 실패:", refreshError);
        localStorage.clear();
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        window.location.href = "/login";
      }
    }

    if (error.response?.data?.status_message) {
      alert(error.response.data.status_message);
    }

    return Promise.reject(error);
  }
);
