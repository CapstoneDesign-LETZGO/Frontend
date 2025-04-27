import React, { useState } from "react";
import MapView from "../components/mapPage/MapView";
import SearchBar from "../components/mapPage/SearchBar";
import BottomNavBar from "../components/mapPage/BottomNavBar";
import CategoryFilter from "../components/mapPage/CategoryFilter";
import PlacePage from "../components/detailPage/PlacePage";
import { PlaceInfo } from "../types/MapTypes";

const MyComponent: React.FC = () => {
  const [placeInfo, setPlaceInfo] = useState<PlaceInfo | null>(null);

  return (
    <div style={styles.wrapper}>
      <SearchBar />
      <div style={styles.mapWrapper}>
        <MapView onSelectPlace={setPlaceInfo} />
        <div style={styles.categoryFilter}>
          <CategoryFilter />
        </div>
        <div style={styles.placePage}>
          {placeInfo && <PlacePage placeInfo={placeInfo} />}
        </div>
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
  categoryFilter: {
    position: "absolute",
    top: "50px",
    left: "0",
    right: "0",
    zIndex: 5,
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
