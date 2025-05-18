import React from "react";
import { PlaceDto } from "../../../../common/interfaces/MapInterface.ts";

interface Props {
  places: PlaceDto[];
  onPlaceClick: (place: PlaceDto) => void;
  userLocation: { lat: number; lng: number } | null;
}

const SearchedPlacePage: React.FC<Props> = ({ places, onPlaceClick, userLocation }) => {
  const calculateDistance = (place: PlaceDto): string => {
    if (!userLocation) return "";
    const km = getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, place.lat, place.lng);
    return `${km.toFixed(1)}km`;
  };

  return (
    <div>
      {places.map((place) => (
        <div
          key={place.placeId}
          className="flex items-center p-2 border-b border-gray-200 cursor-pointer hover:bg-gray-50"
          onClick={() => onPlaceClick(place)}
        >
          <div>
            <h3 className="text-base font-semibold">
              {place.name}
              {userLocation && (
                <span className="text-sm text-gray-400 ml-2">
                  · {calculateDistance(place)}
                </span>
              )}
            </h3>
            <p className="text-sm text-gray-500">{place.address}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export default SearchedPlacePage;
