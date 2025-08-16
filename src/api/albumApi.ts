import axios from "axios";
import { AlbumType } from "../types/types";
import { instance } from "./instance";
import { hostInstance } from "./hostInstance";

export const apiGetWeeklyPopularAlbums = async (): Promise<AlbumType[]> => {
  const response = await hostInstance.get("/albums/popular-weekly");
  return response.data;
};
