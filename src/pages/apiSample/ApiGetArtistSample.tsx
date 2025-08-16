import React, { useEffect, useState } from "react";
import Logo from "../assets/image/logo4.png";

import { apiGetArtistList } from "../../api/api";
import {
  ApiGetArtisItemsType,
  ApiGetArtistType,
  SearchGenreTrackType,
  Track,
} from "../../types/types";
import { Link } from "react-router-dom";

function ApiGetArtistSample() {
  const [data, setData] = useState<ApiGetArtistType>({
    artists: {
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
    apiGetArtistList("BTS").then((res) => {
      console.log(res);
      setData(res);
    });
  }, []);

  return (
    <div className="">
      <ul>
        {data.artists.items.map((item: ApiGetArtisItemsType, index: number) =>
          item.images[1]?.url || item.images[0]?.url ? (
            <li className="inline-block " key={item.id}>
              {
                <div className="h-100 flex flex-col">
                  <Link to={`/artistDetail/${item.id}`}>
                    <img
                      className="m-10 mb-5 w-70 h-70 shadow-xl shadow-gray-600 rounded-xl"
                      src={item.images[1]?.url || item.images[0]?.url}
                      alt=""
                    />
                  </Link>
                  <p className="mx-10 w-70 text-lg font-bold line-clamp-1">{`${item.name}`}</p>
                  <p className="mx-10 w-70 text-sm font-bold text-gray-400">{`Followers : ${item.followers.total.toLocaleString()}`}</p>
                </div>
              }
            </li>
          ) : null
        )}
      </ul>
    </div>
  );
}

export default ApiGetArtistSample;
