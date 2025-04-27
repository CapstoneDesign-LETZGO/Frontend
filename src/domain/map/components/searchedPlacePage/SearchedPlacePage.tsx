// SearchedPlacePage.tsx
import React from "react";
import { PlaceInfo } from "../../types/MapTypes";

interface Props {
  places: PlaceInfo[];
  onPlaceClick: (place: PlaceInfo) => void;
}

const SearchedPlacePage: React.FC<Props> = ({ places, onPlaceClick }) => {
  return (
    <div>
      {places.map((place) => (
        <div
          key={place.placeId}
          style={styles.item}
          onClick={() => onPlaceClick(place)}
        >
          <img src={place.placePhoto} alt={place.name} style={styles.image} />
          <div>
            <h3>{place.name}</h3>
            <p>{place.address}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  item: {
    display: "flex",
    padding: "10px",
    borderBottom: "1px solid #eee",
    cursor: "pointer",
  },
  image: {
    width: "60px",
    height: "60px",
    objectFit: "cover",
    marginRight: "10px",
  },
};

export default SearchedPlacePage;
