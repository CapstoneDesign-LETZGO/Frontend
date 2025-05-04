import React, { useState } from "react";
import { PlaceInfo, Review } from "../../types/MapTypes";
import PlaceHeader from "./PlaceHeader";
import ReviewList from "./ReviewList";
import ReviewForm from "./ReviewForm";
import { usePlaceInfo } from "../../hooks/usePlaceInfo";

interface PlacePageProps {
  placeInfo: PlaceInfo;
  reviews: Review[];
  onClose: () => void;
}

const PlacePage: React.FC<PlacePageProps> = ({
  placeInfo: initialPlaceInfo,
  reviews: initialReviews,
  onClose,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [placeInfo, setPlaceInfo] = useState<PlaceInfo>(initialPlaceInfo);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  const { postReview, fetchPlaceInfo, deleteReview } = usePlaceInfo();

  const refreshReviews = async () => {
    const updated = await fetchPlaceInfo(placeInfo.placeId);
    if (updated) {
      setPlaceInfo(updated.placeInfo);
      setReviews(updated.reviews);
    }
  };

  const handleReviewSubmit = async (formData: FormData) => {
    const success = await postReview(placeInfo.placeId, formData);
    if (success) {
      alert("리뷰가 성공적으로 등록되었습니다.");
      setShowForm(false);
      await refreshReviews();
    } else {
      alert("리뷰 등록에 실패했습니다.");
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    const ok = window.confirm("정말 이 리뷰를 삭제하시겠습니까?");
    if (!ok) return;

    const success = await deleteReview(reviewId);
    if (success) {
      alert("리뷰가 삭제되었습니다.");
      await refreshReviews();
    } else {
      alert("리뷰 삭제에 실패했습니다.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md w-full max-w-md max-h-[90vh] overflow-y-auto flex flex-col">
      {/* 닫기 버튼 */}
      <div className="sticky top-0 z-10 bg-white p-2 border-b border-gray-200 flex justify-end">
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

      {/* 리뷰 리스트 */}
      <div className="mt-4 px-4 pb-6">
        <ReviewList reviews={reviews} onDelete={handleDeleteReview} />
      </div>
    </div>
  );
};

export default PlacePage;