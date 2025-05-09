import React from "react";
import {PlaceDto} from "../../../../common/interfaces/MapInterface.ts";

interface Prop {
  placeDto: PlaceDto | null;
}

const PlaceHeader: React.FC<Prop> = ({ placeDto }) => {
  if (!placeDto) return null;
  const { name, address, placePhoto } = placeDto;

  console.log("placePhoto API호출됨:");
  return (
    <div className="p-4 bg-white border-b border-gray-200">
      {placePhoto ? (
        <img
          src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${placePhoto}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`}
          alt={name}
          className="w-full h-auto rounded-md"
        />
      ) : (
        <div className="w-full h-[200px] bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
          이미지 없음
        </div>
      )}
      <div className="flex flex-col mt-4">
        <h2 className="text-xl font-bold m-0">{name}</h2>
        <p className="text-gray-600 text-sm mt-1">{address}</p>
      </div>
    </div>
  );
};

export default PlaceHeader;
