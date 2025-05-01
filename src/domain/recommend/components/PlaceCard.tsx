import React from "react";
import "../styles/Recommend.css";

interface PlaceCardProps {
  image: string;
  title: string;
  rating: string;
  onIgnore?: () => void;
}

const PlaceCard: React.FC<PlaceCardProps> = ({
  image,
  title,
  rating,
  onIgnore,
}) => {
  return (
    <div className="place-card-row">
      <img src={image} alt={title} className="place-thumbnail" />
      <div className="place-content">
        <div className="place-title">{title}</div>
        <div className="place-rating">{rating}</div>
        <button className="ignore-button" onClick={onIgnore}>
          관심없음
        </button>
      </div>
    </div>
  );
};

export default PlaceCard;
