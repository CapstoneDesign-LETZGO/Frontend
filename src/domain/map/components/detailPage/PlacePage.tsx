import React from "react";
import { PlaceInfo } from "../../types/MapTypes";
import PlaceHeader from "./PlaceHeader";
import ReviewList from "./ReviewList";

interface PlacePageProps {
  placeInfo: PlaceInfo;
}

const PlacePage: React.FC<PlacePageProps> = ({ placeInfo }) => {
  return (
    <div>
      <PlaceHeader placeInfo={placeInfo} />
      <ReviewList reviews={[]} />
    </div>
  );
};

export default PlacePage;
