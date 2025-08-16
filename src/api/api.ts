import { UserInfo } from "../store/userInfo";
import { AddPlaylistType } from "../types/types";

import { hostInstance } from "./hostInstance";
import { instance } from "./instance";
import { ApiGetAlbumItemsType } from "../types/types";

// export const apiGetMusicList = async () => {
//   return await instance
//     .get(`search?offset=0&limit=20&query=BTS&type=artist`)
//     .then((res) => res.data);
// };

// 입력한 장르의 아티스트 정보
export const apiGetGenreArtist = async (genre: string) => {
  return await instance
    .get(`search?q=*&genre:${genre}&type=artist`)
    .then((res) => res.data);
};

// 입력한 장르의 트랙 정보
export const apiGetGenreTrack = async (genre: string) => {
  return await instance
    .get(`search?q=genre:${genre}&type=track`)
    .then((res) => res.data);
};

export const apiGetMusicList = async () => {
  return await instance
    .get(`search?offset=0&limit=20&q=BTS&type=artist&market=KR`)
    .then((res) => res.data);
};

// 아티스트 검색
export const apiGetArtistList = async (search: string) => {
  return await instance
    .get(`search?offset=0&limit=20&q=${search}&type=artist&market=KR`)
    .then((res) => res.data);
};

// 특정 아티스트 정보 가져오기 (새로 추가)
export const apiGetArtistById = async (artistId: string) => {
  return await instance.get(`artists/${artistId}`).then((res) => res.data);
};

// 트랙 검색
export const apiGetTrackList = async (search: string) => {
  return await instance
    .get(`search?offset=0&limit=20&q=${search}&type=track&market=KR`)
    .then((res) => res.data);
};

// 앨범 검색
export const apiGetAlbumList = async (search: string, offset: number) => {
  return await instance
    .get(`search?offset=${offset}&limit=20&q=${search}&type=album&market=KR`)
    .then((res) => res.data);
};

export const apiGetTrackListByAlbumId = async (album_id: string) => {
  try {
    const res = await instance.get(
      `albums/${album_id}/tracks?market=KR&limit=50&offset=0`
    );
    return res.data;
  } catch (error) {
    console.error("앨범 트랙 불러오기 실패:", error);
    throw error;
  }
};

export const apiGetTrackListByArtistId = async (artist_id: string) => {
  try {
    const res = await instance.get(
      `artists/${artist_id}/top-tracks?market=KR&limit=50&offset=0`
    );
    return res.data;
  } catch (error) {
    console.error("앨범 트랙 불러오기 실패:", error);
    throw error;
  }
};

// 공개 재생목록 검색
export const apiGetPlayList = async (search: string) => {
  return await instance
    .get(`search?offset=0&limit=20&q=${search}&type=playlist&market=KR`)
    .then((res) => res.data);
};

// 팟캐스트 쇼 검색
export const apiGetShowList = async (search: string) => {
  return await instance
    .get(`search?offset=0&limit=20&q=${search}&type=show&market=KR`)
    .then((res) => res.data);
};

// 오디오북 검색(일부 국가만 지원)
export const apiGetAudioBookList = async (search: string) => {
  return await instance
    .get(`search?offset=0&limit=20&q=${search}&type=audiobook&market=KR`)
    .then((res) => res.data);
};

// 팟캐스트 에피소드 검색
export const apiGetEpisodeList = async (search: string) => {
  return await instance
    .get(`search?offset=0&limit=20&q=${search}&type=episode&market=KR`)
    .then((res) => res.data);
};

// 장르 리스트 검색 - xxxxxxxxx안 됨xxxxxxxxxx
export const apiGetGenreList = async () => {
  return await instance
    .get(`recommendations/available-genre-seeds`, {
      headers: {
        Authorization: `Bearer BQAUSnNPdYaVXGr4ZxtX2ggBRfghMTMm3BO4NZaMPsqEvxr5WgsjgBBjUVPpPf4t36kOT2QOsRYJvfuH_egEYUc6X3OFv5IBF_MOhJK9iLJGzTYavfn0ZQ2UR2pl3PpYJNm899FmG2PIYje-Auu_G1QdYpgca35oATuR4Nadrnt6cxxVCKxTb7KVpfcIDwktRlZmUjoXIADEHgW4lz7Y_YjJ--DGskN3Yf2I-tZkABdA7bd4AePYcfdFnGMiR1d-mxSCGTBDlzqSNChVz9FEbKtMjA6d_HgYayvwEbXxKKjEP0w_f1e4OP-WsYnRob-Uxz3Gfd1kEQ_G7Q`,
      },
    })
    .then((res) => res.data);
};

/**
 *최신 앨범 목록 가져오기
 */
export const apiGetNewReleases = async () => {
  return await instance
    .get(`browse/new-releases?limit=50`)
    .then((res) => res.data);
};

/**
 * 특정 앨범의 트랙 목록 가져오기
 */
export const apiGetTracksByAlbumId = async (albumId: string) => {
  return await instance.get(`albums/${albumId}/tracks`).then((res) => res.data);
};

// http://localhost:8080/api/user/login
export const apiLogin = async (loginData: any) => {
  return await hostInstance
    .post("author/login", { loginData })
    .then((res) => res.data);
};

export const apiSignUp = async () => {
  return await hostInstance.get("auth/resister").then((res) => res.data);
};

export const apiCreatePlayList = async (
  userInfo: UserInfo,
  createPlaylistInfo: AddPlaylistType
) => {
  return await hostInstance.post("playlist/create", {
    userInfo,
    createPlaylistInfo,
  });
};

/**
 * K-Pop 앨범 검색
 * 'K-Pop' 키워드로 앨범을 검색하고 한국 시장으로 필터링합니다.
 * @param offset 검색 결과의 시작 지점 (페이지네이션용)
 * @param limit 반환할 결과의 최대 개수
 */
export const apiGetKpopAlbums = async (
  offset: number = 0,
  limit: number = 15
) => {
  return await instance
    .get(
      `search?q=q=genre:k-pop.&type=album&market=KR&offset=${offset}&limit=${limit}`
    )
    .then((res) => res.data);
};

// refresh token
export const apiGetRefreshToken = async (refreshToken: string | null) => {
  return await hostInstance
    .post("auth/refresh", { refreshToken })
    .then((res) => res);
};

// 댓글 작성 (POST)
export const apiPostComment = async (
  targetType: string, // 예: 'ALBUM', 'TRACK' 등
  targetId: string,
  content: string,
  userId: number // userId도 추가
) => {
  try {
    const response = await hostInstance.post("/board/comment", {
      targetType,
      targetId,
      content,
      userId, // 서버로 보내는 데이터에 userId 포함
    });
    return response.data; // 서버에서 반환하는 데이터
  } catch (error) {
    console.error("댓글 작성 실패:", error);
    throw new Error("댓글 작성 실패");
  }
};

// 댓글 조회 (GET)
export const apiGetComments = async (
  targetType: string, // 예: 'ALBUM', 'TRACK' 등
  targetId: string, // 대상 ID
  userId: number // 로그인한 유저의 ID
) => {
  try {
    const response = await hostInstance.get("board/comments/list", {
      params: { targetType, targetId, userId },
    });
    return response.data; // 댓글 목록
  } catch (error) {
    console.error("댓글 불러오기 실패:", error);
    throw new Error("댓글 불러오기 실패");
  }
};

// 댓글 수정 API
export const apiUpdateComment = async (commentId: number, content: string) => {
  try {
    const response = await hostInstance.put(
      `/board/commentUpdate/${commentId}`,
      { content }
      // { headers: { 'Content-Type': 'text/plain' } } // content-type을 text로 설정
    );
    return response.data;
  } catch (error) {
    console.error("댓글 수정 실패:", error);
    throw error;
  }
};

// 댓글 삭제 API
export const apiDeleteComment = async (commentId: number) => {
  try {
    const response = await hostInstance.delete(
      `board/commentDelete/${commentId}`
    );
    return response.data;
  } catch (error) {
    console.error("댓글 삭제 실패:", error);
    throw error;
  }
};

// 신고 API 함수
export const apiReportComment = async (
  commentId: number,
  reason: string,
  userId: number
) => {
  try {
    const response = await hostInstance.post(
      `board/commentReport/${commentId}`,
      {
        reportReason: reason,
        userId: userId,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 댓글 신고 여부 확인 함수
export const apiCheckReportStatus = async (
  commentId: number,
  userId: number
) => {
  try {
    const response = await hostInstance.get(`/board/report-status`, {
      params: {
        commentId,
        userId,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 좋아요 상태 조회 (GET 호출로 변경, 경로 수정)
export const apiGetAlbumLikeStatus = async (
  albumExternalId: string
): Promise<boolean> => {
  try {
    // 백엔드: GET /api/album-like/album/status/{albumExternalId}
    const response = await hostInstance.get(
      `/album-like/album/status/${albumExternalId}`
    );
    return response.data; // 백엔드에서 boolean 값을 바로 반환한다고 가정
  } catch (error) {
    console.error("좋아요 상태 조회 실패:", error);
    throw error;
  }
};

// 좋아요 등록 (POST 호출, 경로 및 RequestBody 수정)
// 백엔드의 apiPostAlbumLike가 AlbumVO를 받는다고 가정합니다.
// 따라서 프론트엔드에서는 AlbumVO에 필요한 데이터를 모두 보내야 합니다.
// AlbumDetail 컴포넌트에서는 albumData를 가지고 있으므로 이를 활용해야 합니다.

export const apiPostAlbumLike = async (albumData: ApiGetAlbumItemsType) => {
  try {
    // 백엔드: POST /api/album-like/Album
    // AlbumVO에 필요한 필드를 포함하여 전송
    const albumVo = {
      spotifyAlbumId: albumData.id,
      albumTitle: albumData.name,
      albumCoverImage:
        albumData.images?.[0]?.url || albumData.images?.[1]?.url || "",
      artistName: albumData.artists?.[0]?.name || "", // 필요에 따라 다른 아티스트 정보도 추가
      releaseDate: albumData.release_date || "",
      // 기타 AlbumVO에 필요한 필드 추가
    };
    const res = await hostInstance.post("/album-like/Album", albumVo);
    return res.data;
  } catch (error) {
    console.error("좋아요 등록 실패:", error);
    throw error;
  }
};

// 좋아요 취소 (DELETE 호출로 변경, 경로 수정)
export const apiDeleteAlbumLike = async (albumExternalId: string) => {
  try {
    // 백엔드: DELETE /api/album-like/album/{albumExternalId}
    const res = await hostInstance.delete(
      `/album-like/album/${albumExternalId}`
    );
    return res.data;
  } catch (error) {
    console.error("좋아요 삭제 실패:", error);
    throw error;
  }
};
