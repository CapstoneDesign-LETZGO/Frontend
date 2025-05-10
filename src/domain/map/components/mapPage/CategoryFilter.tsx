import React, { useState } from "react";

const categories = ["음식점", "카페", "관광지", "숙소", "쇼핑"];

interface CategoryFilterProps {
  onCategorySelect: (category: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ onCategorySelect }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (category: string) => {
    const newCategory = category === selectedCategory ? null : category;
    setSelectedCategory(newCategory);
    onCategorySelect(newCategory);
  };

  return (
    <div className="flex overflow-x-auto p-2 bg-transparent">
      {categories.map((category) => {
        const isSelected = selectedCategory === category;
        return (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`px-4 py-2 mr-2 rounded-full text-sm whitespace-nowrap border ${
              isSelected ? "bg-gray-800 text-white border-gray-500" : "bg-gray-100 text-black border-gray-300"
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
