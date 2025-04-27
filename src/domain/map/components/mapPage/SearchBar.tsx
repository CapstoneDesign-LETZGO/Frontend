import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    if (query.trim() === "") return; // 빈 검색어는 무시
    onSearch(query);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // << 이거 중요, 폼 submit 막아야 함
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
