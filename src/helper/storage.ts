import { PlayTrack } from "../types/types";

// 사용자 타입 정의
export interface User {
  tokenType: string;
  username: string;
  email: string;
  password: string;
  name: string;
  roleNum: number;
  accessToken: string;
}

// 사용자 정보 저장
export const setCurrentUser = (user: User | null): void => {
  try {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  } catch (error) {
    console.error("스토리지 저장 오류", error);
  }
};

// 사용자 정보 제거
export const removeCurrentUser = (): void => {
  localStorage.removeItem("user");
};

// 사용자 정보 가져오기
export const getCurrentUser = () => {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? (JSON.parse(storedUser) as User) : null;
  } catch (error) {
    console.error("스토리지 로드 오류", error);
    return null;
  }
};

// 가장 최근 재생한 곡 목록 관련
// 최근 곡 저장
export const setRecentTrack = (track: PlayTrack[]): void => {
  try {
    localStorage.setItem("recentTrack", JSON.stringify(track));
  } catch (error) {
    console.error("스토리지 저장 오류", error);
  }
};

// 최근 곡 제거
export const removeRecentTrack = (): void => {
  localStorage.removeItem("recentTrack");
};

// 최근 곡 정보 가져오기
export const getRecentTrack = (): PlayTrack[] => {
  try {
    const storedTrack = localStorage.getItem("recentTrack");
    return storedTrack ? JSON.parse(storedTrack) : [];
  } catch (error) {
    console.error("스토리지 로드 오류", error);
    return [];
  }
};
