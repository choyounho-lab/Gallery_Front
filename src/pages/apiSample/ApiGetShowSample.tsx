import React, { useEffect, useState } from "react";

import { apiGetShowList } from "../../api/api";
import {
  ApiGetShowItemsType,
  ApiGetShowType,
  SearchGenreTrackType,
  Track,
} from "../../types/types";
import { Link } from "react-router-dom";

function ApiGetShowSample() {
  const [data, setData] = useState<ApiGetShowType>({
    shows: {
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
    apiGetShowList("k-pop").then((res) => {
      console.log(res);
      setData(res);
    });
  }, []);

  return (
    <div className="">
      <ul>
        {data.shows.items.map((item: ApiGetShowItemsType, index: number) => (
          <li className="inline-block " key={item.id}>
            {
              <div className="h-130 flex flex-col">
                <Link to={`/show/${item.id}`}>
                  <img
                    className="m-10 mb-5 w-70 h-70 shadow-xl shadow-gray-600 rounded-xl"
                    src={item.images[1].url}
                    alt=""
                  />
                </Link>
                <p className="mx-10 w-70 text-lg font-bold line-clamp-1">{`${item.name}`}</p>
                <p className="mx-10 w-70 text-sm font-bold text-gray-400">{`Publisher : ${item.publisher}`}</p>
                <p className="mx-10 w-70 text-sm font-bold line-clamp-5">{`Description : ${item.description}`}</p>
              </div>
            }
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ApiGetShowSample;
