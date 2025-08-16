import React, { useEffect, useState } from "react";

import { apiGetGenreTrack, apiGetPlayList } from "../../api/api";
import { ApiGetPlayListItemsType, ApiGetPlayListType } from "../../types/types";
import { Link } from "react-router-dom";

function ApiGetPlayListSample() {
  const [data, setData] = useState<ApiGetPlayListType>({
    playlists: {
      href: "",
      items: [],
      limit: 0,
      next: "",
      offset: 0,
      previous: "",
      total: 0,
    },
  });

  useEffect(() => {
    apiGetPlayList("빅뱅").then((res) => {
      console.log(res);
      setData(res);
    });
  }, []);

  return (
    <div className="">
      <ul>
        {data.playlists.items.map(
          (item: ApiGetPlayListItemsType, index: number) => (
            <li className="inline-block " key={item?.id}>
              {item?.id && (
                <div className="h-100 flex flex-col">
                  <Link to={`/playlist/${item?.id}`}>
                    <img
                      className="m-10 mb-5 w-70 h-70 shadow-xl shadow-gray-600 rounded-xl"
                      src={item?.images[1]?.url}
                      alt=""
                    />
                  </Link>
                  <p className="mx-10 w-70 text-lg font-bold line-clamp-1">{`${item?.name}`}</p>
                  <p className="mx-10 w-70 text-sm font-bold text-gray-400">{`${item?.primary_color}`}</p>
                </div>
              )}
            </li>
          )
        )}
      </ul>
    </div>
  );
}

export default ApiGetPlayListSample;
