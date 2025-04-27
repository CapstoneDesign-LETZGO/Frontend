import React, { useState } from "react";

const categories = ["음식점", "카페", "관광지", "숙소", "쇼핑"];

const CategoryFilter: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category === selectedCategory ? null : category);
    // 💡 여기서 category를 상위 컴포넌트로 전달하거나, 검색 필터링 로직 넣을 수 있음
    console.log("선택된 카테고리:", category);
  };

  return (
    <div style={styles.container}>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => handleCategoryClick(category)}
          style={{
            ...styles.button,
            ...(selectedCategory === category ? styles.selected : {}),
          }}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    overflowX: "auto",
    padding: "10px",
    backgroundColor: "transparent",
  },
  button: {
    padding: "8px 16px",
    marginRight: "8px",
    border: "1px solid #ccc",
    borderRadius: "20px",
    background: "#f9f9f9",
    cursor: "pointer",
    whiteSpace: "nowrap",
    fontSize: "14px",
  },
  selected: {
    backgroundColor: "#4CAF50",
    color: "#fff",
    borderColor: "#4CAF50",
  },
};

export default CategoryFilter;
