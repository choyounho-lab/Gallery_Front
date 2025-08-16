import React, { useEffect, useState } from "react";

import { apiGetAudioBookList } from "../../api/api";
import { SearchGenreTrackType } from "../../types/types";
import { Link } from "react-router-dom";

function ApiGetAudioBookSample() {
  const [data, setData] = useState<SearchGenreTrackType>({
    tracks: {
      items: [],
    },
  });

  useEffect(() => {
    apiGetAudioBookList("audio").then((res) => {
      console.log(res);
      setData(res);
    });
  }, []);

  return (
    <div className="">
      <ul>
        {data.tracks.items.map((item: any, index: number) => (
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
                <p className="mx-10 w-70 text-sm font-bold text-gray-400">{`${item.artists[0].name}`}</p>
              </div>
            }
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ApiGetAudioBookSample;
