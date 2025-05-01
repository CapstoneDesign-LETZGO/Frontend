import React from "react";
import { PlaceInfo } from "../../types/MapTypes";
import PlaceHeader from "./PlaceHeader";
import ReviewList from "./ReviewList";

interface PlacePageProps {
  placeInfo: PlaceInfo;
  onClose: () => void;
}

const PlacePage: React.FC<PlacePageProps> = ({ placeInfo, onClose }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-2 border-b border-gray-200 flex justify-end">
        <button
          onClick={onClose}
          className="bg-red-500 text-white text-sm px-3 py-1.5 rounded hover:bg-red-600"
        >
          ❌ 닫기
        </button>
      </div>
      <PlaceHeader placeInfo={placeInfo} />
      <ReviewList reviews={[]} />
    </div>
  );
};

export default PlacePage;
