import React, { useState } from "react";
import { PlaceInfo, Review } from "../../types/MapTypes";
import PlaceHeader from "./PlaceHeader";
import ReviewList from "./ReviewList";
import ReviewForm from "./ReviewForm"; // 리뷰 작성 폼 컴포넌트
import { usePlaceInfo } from "../../hooks/usePlaceInfo";

interface PlacePageProps {
  placeInfo: PlaceInfo;
  reviews: Review[];
  onClose: () => void;
}

const PlacePage: React.FC<PlacePageProps> = ({ placeInfo, reviews, onClose }) => {
  const [showForm, setShowForm] = useState(false);
  const { postReview } = usePlaceInfo();

  const handleReviewSubmit = async (formData: FormData) => {
    const success = await postReview(placeInfo.placeId, formData);
    if (success) {
      alert("리뷰가 성공적으로 등록되었습니다.");
      setShowForm(false);
      // 새로고침 없이 처리하려면 fetchPlaceInfo로 갱신 필요 (추후 연결)
    } else {
      alert("리뷰 등록에 실패했습니다.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md w-full max-w-md max-h-[90vh] overflow-y-auto flex flex-col">
      {/* 닫기 버튼 */}
      <div className="p-2 border-b border-gray-200 flex justify-end">
        <button
          onClick={onClose}
          className="bg-black text-white text-sm px-3 py-1.5 rounded hover:bg-gray-800"
        >
          X 닫기
        </button>
      </div>

      {/* 장소 정보 */}
      <div className="flex-shrink-0">
        <PlaceHeader placeInfo={placeInfo} />
      </div>

      {/* 리뷰 작성 버튼 */}
      <div className="flex justify-end px-4 mt-2">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gray-500 text-white text-sm px-3 py-1.5 rounded hover:bg-gray-600"
        >
          리뷰 작성
        </button>
      </div>

      {/* 리뷰 작성 폼 */}
      {showForm && (
        <div className="px-4 mt-2">
          <ReviewForm onSubmit={handleReviewSubmit} />
        </div>
      )}

      {/* 리뷰 영역 */}
      <div className="mt-4 px-4 pb-6">
        <ReviewList reviews={reviews} />
      </div>
    </div>
  );
};

export default PlacePage;
