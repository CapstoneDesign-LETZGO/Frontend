import React from "react";

interface PlaceCardProps {
  image: string;
  title: string;
  rating: string; // 예: "⭐ 3.3 · 1.2km"
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
  // 별점과 거리 분리
  const [starPart, ...restParts] = rating.split("·");
  const distancePart = restParts.join("·").trim();

  return (
    <div
      className="relative flex items-start border border-gray-300 rounded-lg p-3 mb-3 bg-white shadow-sm cursor-pointer"
      onClick={onClick}
    >
      {/* 우상단 관심없음 버튼 */}
      <button
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 z-10"
        onClick={(e) => {
          e.stopPropagation();
          onIgnore();
        }}
        aria-label="관심없음"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 text-gray-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 8.586l4.95-4.95a1 1 0 111.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10l-4.95-4.95A1 1 0 115.05 3.636L10 8.586z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <img
        src={image}
        alt={title}
        className="w-32 h-32 object-cover rounded-lg mr-4"
      />

      <div className="flex flex-col flex-1">
        <div className="text-base font-bold mb-1">{title}</div>
        <div className="text-sm text-gray-600 mb-1">
          <span className="font-bold text-gray-800">{starPart.trim()}</span>
          {distancePart && <span className="ml-1">· {distancePart}</span>}
        </div>

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
