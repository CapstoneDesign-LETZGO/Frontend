import React from "react";
import { Review } from "../../types/MapTypes";

interface ReviewListProps {
  reviews: Review[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  return (
    <div className="p-4 bg-gray-100">
      <h3 className="text-lg font-bold mb-3">리뷰</h3>
      {reviews.length === 0 ? (
        <p className="text-sm text-gray-500">아직 작성된 리뷰가 없습니다.</p>
      ) : (
        reviews.map((review) => (
          <div
            key={review.id}
            className="mb-3 p-3 bg-white rounded-lg shadow-sm"
          >
            <p className="font-bold mb-1">{review.name}</p>
            <img src={review.photoDir} alt={review.title} className="w-full h-auto rounded-md mb-2" />
            <p className="text-base font-semibold">{review.title}</p>
            <p className="text-yellow-500 font-medium">{review.rating}</p>
            <p className="text-sm mt-1">{review.content}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewList;
