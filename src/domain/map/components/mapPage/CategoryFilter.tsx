import React, { useState } from "react";

const categories = ["음식점", "카페", "관광지", "숙소", "쇼핑"];

const CategoryFilter: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category === selectedCategory ? null : category);
    console.log("선택된 카테고리:", category);
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
              isSelected
                ? "bg-green-500 text-white border-green-500"
                : "bg-gray-100 text-black border-gray-300"
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
