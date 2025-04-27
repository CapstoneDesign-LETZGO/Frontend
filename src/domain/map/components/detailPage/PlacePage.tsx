import React from "react";
import { PlaceInfo } from "../../types/MapTypes";
import PlaceHeader from "./PlaceHeader";
import ReviewList from "./ReviewList";

interface PlacePageProps {
  placeInfo: PlaceInfo;
  onClose: () => void; // 닫기 핸들러 추가
}

const PlacePage: React.FC<PlacePageProps> = ({ placeInfo, onClose }) => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={onClose} style={styles.closeButton}>❌ 닫기</button>
      </div>
      <PlaceHeader placeInfo={placeInfo} />
      <ReviewList reviews={[]} />
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    overflow: "hidden",
  },
  header: {
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
};

export default PlacePage;
