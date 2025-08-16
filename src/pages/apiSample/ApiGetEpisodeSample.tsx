import React, { useEffect, useState } from "react";

import { apiGetEpisodeList } from "../../api/api";
import {
  ApiGetEpisodeItemsType,
  ApiGetEpisodeType,
  SearchGenreTrackType,
  Track,
} from "../../types/types";
import { Link } from "react-router-dom";

function ApiGetEpisodeSample() {
  const [data, setData] = useState<ApiGetEpisodeType>({
    episodes: {
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
    apiGetEpisodeList("k-pop").then((res) => {
      console.log(res);
      setData(res);
    });
  }, []);

  return (
    <div className="">
      <ul>
        {data.episodes.items.map(
          (item: ApiGetEpisodeItemsType, index: number) => (
            <li className="inline-block " key={item.id}>
              {
                <div className="h-100 flex flex-col">
                  <Link to={`/albumDetail/${item.id}`}>
                    <img
                      className="m-10 mb-5 w-70 h-70 shadow-xl shadow-gray-600 rounded-xl"
                      src={item.images[1].url}
                      alt=""
                    />
                  </Link>
                  <p className="mx-10 w-70 text-lg font-bold line-clamp-1">{`${item.name}`}</p>
                  <p className="mx-10 w-70 text-sm font-bold text-gray-400 line-clamp-1">{`${item.description}`}</p>
                </div>
              }
            </li>
          )
        )}
      </ul>
    </div>
  );
}

export default ApiGetEpisodeSample;
