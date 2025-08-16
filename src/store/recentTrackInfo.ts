import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { PlayTrack } from "../types/types";

interface RecentTrackInfoState {
  info: PlayTrack[];
}

const initialState: RecentTrackInfoState = {
  info: [],
};

export const recentTrackInfoSlice = createSlice({
  name: "recentTrackInfo",
  initialState,
  reducers: {
    addRecentTrackInfo: (state, action: PayloadAction<PlayTrack>) => {
      state.info = state.info.filter(
        (track) => track.name !== action.payload.name
      );
      state.info.unshift(action.payload);
      if (state.info.length > 10) {
        state.info.pop();
      }
    },

    setRecentTrackInfo: (state, action: PayloadAction<PlayTrack[]>) => {
      state.info = action.payload;
    },
    // 전체 초기화
    clearRecentTrackInfo: (state) => {
      state.info = [];
    },
    // 곡 이름으로 최근 재생한 트랙 삭제
    removeRecentTrackByTitle: (state, action: PayloadAction<string>) => {
      state.info = state.info.filter((track) => track.id !== action.payload);
      console.log(state.info.map((track) => track.name));
    },
  },
});

export const {
  addRecentTrackInfo,
  setRecentTrackInfo,
  clearRecentTrackInfo,
  removeRecentTrackByTitle,
} = recentTrackInfoSlice.actions;

export default recentTrackInfoSlice.reducer;

export const selectRecentTrackInfo = (state: RootState) =>
  state.recentTrackInfo.info;
