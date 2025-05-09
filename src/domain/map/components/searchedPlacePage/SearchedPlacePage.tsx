import React from "react";
import { PlaceDto } from "../../../../common/interfaces/MapInterface.ts";

interface Props {
  places: PlaceDto[];
  onPlaceClick: (place: PlaceDto) => void;
}

const SearchedPlacePage: React.FC<Props> = ({ places, onPlaceClick }) => {
  return (
    <div>
      {places.map((place) => (
        <div
          key={place.placeId}
          className="flex items-center p-2 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
          onClick={() => onPlaceClick(place)}
        >
          <div>
            <h3 className="text-base font-semibold">{place.name}</h3>
            <p className="text-sm text-gray-500">{place.address}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchedPlacePage;
