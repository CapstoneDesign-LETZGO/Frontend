import React from "react";

interface MoreButtonProps {
  onClick: () => void;
}

const MoreButton: React.FC<MoreButtonProps> = ({ onClick }) => {
  return (
    <div className="flex justify-end mt-4">
      <button
        onClick={onClick}
        className="border border-gray-300 px-4 py-2 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-100 transition"
      >
        더보기
      </button>
    </div>
  );
};

export default MoreButton;
