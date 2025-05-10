import React, { useEffect } from "react";
import { useMyProfile } from "../../../account/member/hooks/useMyProfile.ts";
import {Review} from "../../../../common/interfaces/MapInterface.ts";

interface ReviewListProps {
  reviews: Review[];
  onDelete?: (reviewId: number) => void;
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, onDelete }) => {
  const { memberInfo, refetch } = useMyProfile();

  useEffect(() => {
    refetch();
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
              {/* 삭제 버튼 - 작성자일 경우만 */}
              {isAuthor && onDelete && (
                <button
                  onClick={() => onDelete(review.id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-sm"
                >
                  ✕
                </button>
              )}

              {/* 이미지 or placeholder */}
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

              {/* 텍스트 영역 */}
              <div className="flex flex-col justify-between flex-1">
                <p className="text-base font-semibold mb-0 leading-tight">{review.title}</p>

                <div className="flex justify-between items-center mt-0 leading-tight">
                  <p className="text-yellow-500 font-medium m-0">⭐{review.rating}</p>
                  <span className="text-xs text-gray-400 whitespace-nowrap m-0">{review.account}</span>
                </div>

                <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
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
