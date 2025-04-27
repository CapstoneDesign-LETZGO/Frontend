import React from "react";
import { PlaceInfo } from "../../types/MapTypes";

interface Prop {
  placeInfo: PlaceInfo | null;
}

const PlaceHeader: React.FC<Prop> = ({ placeInfo }) => {
  if (!placeInfo) return null;
  const { name, address, placePhoto } = placeInfo;

  return (
    <div style={styles.container}>
      <img src={placePhoto} alt={name} style={styles.image} />
      <div style={styles.textWrapper}>
        <h2 style={styles.name}>{name}</h2>
        <p style={styles.address}>{address}</p>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: "16px",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #eee",
  },
  textWrapper: {
    display: "flex",
    flexDirection: "column",
  },
  name: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "bold",
  },
  address: {
    margin: "4px 0 0",
    color: "#666",
    fontSize: "14px",
  },
};

export default PlaceHeader;
