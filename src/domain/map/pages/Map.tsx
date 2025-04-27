import React, { useState, useCallback } from "react";
import MapView from "../components/mapPage/MapView";
import SearchBar from "../components/mapPage/SearchBar";
import BottomNavBar from "../components/mapPage/BottomNavBar";
import CategoryFilter from "../components/mapPage/CategoryFilter";
import PlacePage from "../components/detailPage/PlacePage";
import SearchedPlacePage from "../components/searchedPlacePage/SearchedPlacePage";
import { PlaceInfo } from "../types/MapTypes";

const MyComponent: React.FC = () => {
  const [placeInfo, setPlaceInfo] = useState<PlaceInfo | null>(null);
  const [searchResults, setSearchResults] = useState<PlaceInfo[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback((query: string) => {
    if (!query) return;

    const dummyResults: PlaceInfo[] = [
      {
        name: `${query} 맛집1`,
        address: "서울시 강남구",
        placeId: "1",
        placePhoto: "https://via.placeholder.com/80",
        lat: 37.5,
        lng: 127.0,
      },
      {
        name: `${query} 맛집2`,
        address: "서울시 강북구",
        placeId: "2",
        placePhoto: "https://via.placeholder.com/80",
        lat: 37.6,
        lng: 127.1,
      },
    ];

    setSearchResults(dummyResults);
    setIsSearching(true);
    setPlaceInfo(null);
  }, []);

  const handleSelectPlace = useCallback((place: PlaceInfo) => {
    setPlaceInfo(place);
    setIsSearching(false);
  }, []);

  const handleCloseSearch = () => {
    setIsSearching(false);
    setSearchResults([]);
  };

  return (
    <div style={styles.wrapper}>
      <SearchBar onSearch={handleSearch} />
      
      <div style={styles.mapWrapper}>
        <MapView onSelectPlace={handleSelectPlace} />
        
        {isSearching && (
          <div style={styles.searchPage}>
            {/* 닫기버튼 */}
            <div style={styles.searchHeader}>
              <button onClick={handleCloseSearch} style={styles.closeButton}>❌ 닫기</button>
            </div>
            <SearchedPlacePage
              places={searchResults}
              onPlaceClick={handleSelectPlace}
            />
          </div>
        )}

        <div style={styles.categoryFilter}>
          <CategoryFilter />
        </div>

        {placeInfo && (
           <div style={styles.placePage}>
           <PlacePage
             placeInfo={placeInfo}
             onClose={() => setPlaceInfo(null)} // 클릭하면 창 닫기
           />
         </div>
        )}
      </div>

      <BottomNavBar />
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    width: "100vw",
    margin: 0,
    padding: 0,
    boxSizing: "border-box",
  },
  mapWrapper: {
    flex: 1,
    position: "relative",
    height: "100%",
    width: "100%",
    margin: 0,
    padding: 0,
  },
  searchPage: {
    position: "absolute",
    top: "50px",
    bottom: "0",
    left: "0",
    width: "350px",
    overflowY: "auto",
    backgroundColor: "#fff",
    zIndex: 5,
    borderRight: "1px solid #ddd",
    display: "flex",
    flexDirection: "column",
  },
  searchHeader: {
    padding: "8px",
    borderBottom: "1px solid #eee",
    display: "flex",
    justifyContent: "flex-end",
  },
  closeButton: {
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  },
  categoryFilter: {
    position: "absolute",
    top: "50px",
    left: "0",
    right: "0",
    zIndex: 4,
    padding: "0 10px",
  },
  placePage: {
    position: "absolute",
    bottom: "300px",
    left: "0",
    right: "0",
    zIndex: 5,
    padding: "0 10px",
  },
};

export default React.memo(MyComponent);
