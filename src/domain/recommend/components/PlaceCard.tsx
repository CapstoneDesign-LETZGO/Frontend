import React from "react";

interface PlaceCardProps {
  image: string;
  title: string;
  rating: string;
  onClick?: () => void;
  onIgnore: () => void;
}

const PlaceCard: React.FC<PlaceCardProps> = ({
  image,
  title,
  rating,
  onClick,
  onIgnore,
}) => {
  return (
    <div
      className="flex items-center border border-gray-300 rounded-lg p-3 mb-3 bg-white shadow-sm cursor-pointer"
      onClick={onClick}
    >
      <img
        src={image}
        alt={title}
        className="w-24 h-24 object-cover rounded-lg mr-4"
      />
      <div className="flex flex-col flex-1">
        <div className="text-base font-bold mb-1">{title}</div>
        <div className="text-sm text-gray-600 mb-2">{rating}</div>
        <button
          className="px-3 py-1 text-xs text-gray-600 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 w-fit"
          onClick={(e) => {
            e.stopPropagation();
            onIgnore();
          }}
        >
          관심없음
        </button>
      </div>
    </div>
  );
};

export default PlaceCard;
