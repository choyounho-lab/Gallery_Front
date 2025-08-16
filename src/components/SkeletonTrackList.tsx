import React from "react";

const SkeletonTrackList = () => {
  return (
    <ul className="space-y-4">
      {[...Array(10)].map((_, index) => (
        <li
          key={index}
          className="bg-white shadow rounded-xl px-4 py-3 flex justify-between items-center gap-4 animate-pulse"
        >
          {/* 이미지 자리 */}
          <div className="flex items-center gap-4 flex-1">
            <div className="w-14 h-14 bg-gray-300 rounded-md flex-shrink-0" />
            <div className="space-y-2 w-full">
              <div className="h-4 bg-gray-300 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>

          {/* 오른쪽 날짜/시간/삭제 버튼 자리 */}
          <div className="flex gap-4 flex-shrink-0 items-center">
            <div className="h-3 w-20 bg-gray-200 rounded" />
            <div className="h-3 w-10 bg-gray-200 rounded" />
            <div className="h-8 w-16 bg-gray-300 rounded" />
          </div>
        </li>
      ))}
    </ul>
  );
};

export default SkeletonTrackList;
