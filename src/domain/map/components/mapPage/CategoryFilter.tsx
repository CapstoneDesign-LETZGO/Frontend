import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const categories = ["실내 놀거리", "액티비티", "쇼핑"];

interface CategoryFilterProps {
  onCategorySelect: (category: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ onCategorySelect }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    onCategorySelect(category);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setSelectedCategory(null);
        onCategorySelect(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [onCategorySelect]);

  return (
    <div
      className="flex overflow-x-auto p-2 bg-transparent"
      ref={containerRef}
    >
      <button
        onClick={() => navigate("/recommend")}
        className="px-4 py-2 mr-2 rounded-full text-sm whitespace-nowrap bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-md border-none hover:brightness-110 active:scale-95 transition"
      >
        추천장소
      </button>

      {categories.map((category) => {
        const isSelected = selectedCategory === category;
        return (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`px-4 py-2 mr-2 rounded-full text-sm whitespace-nowrap shadow-sm transition font-medium 
              ${isSelected
                ? "bg-gray-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 active:bg-gray-200"
              }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
