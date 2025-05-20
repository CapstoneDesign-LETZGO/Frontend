import React from "react";
import { useNavigate } from "react-router-dom";

const categories = ["실내 놀거리", "액티비티", "쇼핑"];

interface CategoryFilterProps {
  onCategorySelect: (category: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ onCategorySelect }) => {
  const navigate = useNavigate();

  const handleCategoryClick = (category: string) => {
    onCategorySelect(category); // 선택 상태 유지 안 함
  };

  return (
    <div className="flex overflow-x-auto p-2 bg-transparent">
      <button
        onClick={() => navigate("/recommend")}
        className="px-4 py-2 mr-2 rounded-full text-sm whitespace-nowrap bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-md border-none hover:brightness-110 active:scale-95 transition"
      >
        추천장소
      </button>

      {categories.map((category) => (
        <button
          key={category}
          onClick={() => handleCategoryClick(category)}
          className="px-4 py-2 mr-2 rounded-full text-sm whitespace-nowrap shadow-sm transition font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 active:bg-gray-200 active:scale-95"
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
