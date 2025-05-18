import React from "react";

interface PlaceCardProps {
  image: string;
  title: string;
  rating: string;
  reviewTags?: string[];
  onClick?: () => void;
  onIgnore: () => void;
}

const PlaceCard: React.FC<PlaceCardProps> = ({
  image,
  title,
  rating,
  reviewTags = [],
  onClick,
  onIgnore,
}) => {
  return (
    <div
      className="relative flex items-start border border-gray-300 rounded-lg p-3 mb-3 bg-white shadow-sm cursor-pointer"
      onClick={onClick}
    >
      {/* 관심없음 버튼 (우상단 고정) */}
      <button
        className="absolute top-2 right-2 px-2 py-1 text-xs text-gray-600 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 z-10"
        onClick={(e) => {
          e.stopPropagation();
          onIgnore();
        }}
      >
        관심없음
      </button>

      <img
        src={image}
        alt={title}
        className="w-32 h-32 object-cover rounded-lg mr-4"
      />

      <div className="flex flex-col flex-1">
        <div className="text-base font-bold mb-1">{title}</div>
        <div className="text-sm text-gray-600 mb-1">{rating}</div>

        {reviewTags.length > 0 && (
          <div className="text-sm text-gray-500 flex flex-wrap gap-x-1 leading-snug">
            {reviewTags.map((tag, index) => (
              <span key={index}>#{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaceCard;
