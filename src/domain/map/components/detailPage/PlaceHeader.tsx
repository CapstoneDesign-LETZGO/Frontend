import React from "react";
import { PlaceInfo } from "../../types/MapTypes";

interface Prop {
  placeInfo: PlaceInfo | null;
}

const PlaceHeader: React.FC<Prop> = ({ placeInfo }) => {
  if (!placeInfo) return null;

  const { name, address, placePhoto } = placeInfo;

  // 대체 이미지 URL (원하는 이미지로 바꿔도 됩니다)
  const fallbackImage = "https://via.placeholder.com/300x200?text=No+Image";

  return (
    <div className="p-4 bg-white border-b border-gray-200">
      {placePhoto ? (
        <img src={placePhoto} alt={name} className="w-full h-auto rounded-md" />
      ) : (
        <img src={fallbackImage} alt="이미지 없음" className="w-full h-auto rounded-md" />
      )}
      <div className="flex flex-col mt-4">
        <h2 className="text-xl font-bold m-0">{name}</h2>
        <p className="text-gray-600 text-sm mt-1">{address}</p>
      </div>
    </div>
  );
};

export default PlaceHeader;
