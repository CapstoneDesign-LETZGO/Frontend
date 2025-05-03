import React from "react";
import { PlaceInfo, Review } from "../../types/MapTypes";
import PlaceHeader from "./PlaceHeader";
import ReviewList from "./ReviewList";

interface PlacePageProps {
  placeInfo: PlaceInfo;
  reviews: Review[];
  onClose: () => void;
}

const PlacePage: React.FC<PlacePageProps> = ({ placeInfo, reviews, onClose }) => {
  return (
    <div className="bg-white rounded-lg shadow-md w-full max-w-md h-[80vh] flex flex-col overflow-hidden">
      {/* 닫기 버튼 */}
      <div className="p-2 border-b border-gray-200 flex justify-end">
        <button
          onClick={onClose}
          className="bg-black text-white text-sm px-3 py-1.5 rounded hover:bg-gray-800"
        >
          X 닫기
        </button>
      </div>

      {/* 장소 정보 고정 */}
      <div className="flex-shrink-0">
        <PlaceHeader placeInfo={placeInfo} />
      </div>

      {/* 리뷰 스크롤 영역 */}
      <div className="flex-grow overflow-y-auto">
        <ReviewList reviews={reviews} />
      </div>
    </div>
  );
};

export default PlacePage;
