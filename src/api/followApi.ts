// src/api/followApi.ts
import axios from "axios";
import { hostInstance } from "./hostInstance";

interface ArtistVO {
  artistExternalId: string;
  artistName: string;
  profileImage: string;
  debutDate?: string;
  artistBio?: string;
  entId?: number;
}

const api = hostInstance;

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const apiFollowArtist = async (
  artistData: ArtistVO
): Promise<string> => {
  try {
    console.log("보내는 아티스트 데이터:", artistData);
    const response = await api.post("/follow/artist", artistData);
    console.log("서버 응답:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "apiFollowArtist 실패:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const apiUnfollowArtist = async (
  artistExternalId: string
): Promise<string> => {
  try {
    const response = await api.delete(`/follow/artist/${artistExternalId}`);
    return response.data;
  } catch (error: any) {
    console.error(
      "apiUnfollowArtist 실패:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const apiCheckFollowStatus = async (
  artistExternalId: string
): Promise<boolean> => {
  try {
    const response = await api.get(`/follow/artist/status/${artistExternalId}`);
    return response.data;
  } catch (error: any) {
    console.error(
      "apiCheckFollowStatus 실패:",
      error.response ? error.response.data : error.message
    );
    return false;
  }
};
