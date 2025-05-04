import React, { useEffect } from "react";
import { Review } from "../../types/MapTypes";
import { useProfile } from "../../../account/member/hooks/useProfile";

interface ReviewListProps {
  reviews: Review[];
  onDelete?: (reviewId: number) => void;
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, onDelete }) => {
  const { memberInfo, fetchMemberInfo } = useProfile();

  useEffect(() => {
    fetchMemberInfo();
  }, []);

  return (
    <div className="p-4 bg-gray-100">
      <h3 className="text-lg font-bold mb-3">리뷰</h3>
      {reviews.length === 0 ? (
        <p className="text-sm text-gray-500">아직 작성된 리뷰가 없습니다.</p>
      ) : (
        reviews.map((review) => {
          const isAuthor = memberInfo?.name === review.account;

          return (
            <div
              key={review.id}
              className="mb-3 p-3 bg-white rounded-lg shadow-sm flex gap-4 relative"
            >
              {isAuthor && onDelete && (
                <button
                  onClick={() => onDelete(review.id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-sm"
                >
                  ✕
                </button>
              )}
              {review.photoDir ? (
                <img
                  src={review.photoDir}
                  alt="리뷰 이미지"
                  className="w-24 h-24 object-cover rounded-md"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-sm">
                  이미지 없음
                </div>
              )}
              <div className="flex flex-col justify-between flex-1">
                <div>
                  <p className="text-base font-semibold">{review.title}</p>
                  <p className="text-yellow-500 font-medium">⭐{review.rating}</p>
                </div>
                <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">
                  {review.content}
                </p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ReviewList;
