import React, { useEffect, useState } from "react";

import { apiGetAlbumList } from "../../api/api";
import { ApiGetAlbumType, ApiGetAlbumItemsType } from "../../types/types";
import { Link } from "react-router-dom";

function ApiGetAlbumSample() {
  const [data, setData] = useState<ApiGetAlbumType>({
    albums: {
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
    // 파라미터(앨범명 검색, 페이지 번호)
    apiGetAlbumList("BTS", 0).then((res) => {
      console.log(res);
      setData(res);
    });
  }, []);

  return (
    <div className="">
      <ul>
        {data.albums.items.map((item: ApiGetAlbumItemsType, index: number) => (
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

export default ApiGetAlbumSample;
