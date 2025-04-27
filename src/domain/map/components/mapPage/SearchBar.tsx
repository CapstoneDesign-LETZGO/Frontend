import React, { useState } from "react";

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    // 이 부분에 검색 기능 연결 (예: API 요청, 지도 이동 등)
    console.log("검색어:", query);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div style={styles.container}>
      <input
        type="text"
        placeholder="장소를 검색하세요"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        style={styles.input}
      />
      <button onClick={handleSearch} style={styles.button}>
        🔍
      </button>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    alignItems: "center",
    padding: "8px",
    backgroundColor: "#fff",
    borderBottom: "1px solid #ccc",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  input: {
    flex: 1,
    height: "36px",
    fontSize: "16px",
    padding: "0 10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  button: {
    marginLeft: "8px",
    height: "36px",
    padding: "0 12px",
    fontSize: "16px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default SearchBar;
