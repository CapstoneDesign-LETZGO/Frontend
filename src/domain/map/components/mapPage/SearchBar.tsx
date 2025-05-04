import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      onSearch(query);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md relative">
      <div className="flex items-center p-2 bg-white border-b border-gray-300 w-full">
        <input
          type="text"
          placeholder="장소를 검색하세요"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          className="flex-1 h-9 text-base px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
        <button
          onClick={() => onSearch(query)}
          className="ml-2 bg-gray-800 text-white py-2 px-4 rounded-md"
        >
          검색
        </button>
      </div>
    </div>
  );

};

export default SearchBar;
