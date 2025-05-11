import React, { useState, useEffect } from "react";
import PlaceCard from "../components/PlaceCard";
import MoreButton from "../components/MoreButton";
import NavigationBar from "../../../common/components/NavigationBar";
import PlacePage from "../../map/components/detailPage/PlacePage";
import { motion, AnimatePresence } from "framer-motion";
import { useRecommend } from "../hooks/useRecommend";
import { usePlaceInfo } from "../../map/hooks/usePlaceInfo";
import { PlaceDto, Review } from "../../../common/interfaces/MapInterface.ts";

interface RatedPlace extends PlaceDto {
  averageRating: number;
}

const Recommend: React.FC = () => {
  const [visibleCount, setVisibleCount] = useState(5);
  const [ignoredIds, setIgnoredIds] = useState<string[]>([]);
  const [selectedPlaceDto, setSelectedPlaceDto] = useState<PlaceDto | null>(null);
  const [ratedPlaces, setRatedPlaces] = useState<RatedPlace[]>([]);
  const [selectedReviews, setSelectedReviews] = useState<Review[]>([]);
  const { recommendPlace: allPlacesData, fetchRecommend, loading } = useRecommend();
  const { fetchPlaceDto } = usePlaceInfo();

  useEffect(() => {
    fetchRecommend();
  }, []);

  useEffect(() => {
    const fetchRatings = async () => {
      const filtered = allPlacesData.filter(p => !ignoredIds.includes(p.placeId));
      const sliced = filtered.slice(0, visibleCount);

      const results = await Promise.all(
        sliced.map(async (place) => {
          const data = await fetchPlaceDto(place.placeId);
          const reviews = data?.reviews ?? [];
          const avg =
            reviews.length === 0 ? 0 : Number((reviews.reduce((acc, cur) => acc + cur.rating, 0) / reviews.length).toFixed(1));

          return { ...place, averageRating: avg };
        })
      );

      setRatedPlaces(results);
    };

    if (allPlacesData.length > 0) {
      fetchRatings();
    }
  }, [allPlacesData, visibleCount, ignoredIds]);

  const handleMoreClick = () => setVisibleCount((prev) => prev + 2);
  const handleIgnore = (id: string) => setIgnoredIds((prev) => [...prev, id]);
  const handlePlaceClick = async (place: PlaceDto) => {
    const result = await fetchPlaceDto(place.placeId);
    if (result) {
      setSelectedPlaceDto(result.placeDto); // 장소
      setSelectedReviews(result.reviews);     // 리뷰
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center bg-[#F5F5F5]">
      <div className="flex flex-col w-full max-w-md min-h-screen relative bg-white">
        <h2 className="sticky top-0 z-10 bg-white text-lg font-bold text-center p-4 border-b border-gray-200">
          사용자 맞춤 장소 추천
        </h2>

        <div className="flex-1 overflow-y-auto p-4 pb-24">
          {loading ? (
            <p className="text-center text-gray-500">불러오는 중...</p>
          ) : (
            <>
              {ratedPlaces.map((place) => (
                <PlaceCard
                  key={place.placeId}
                  image={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.placePhoto}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`}
                  //image={""}
                  title={place.name}
                  rating={`⭐ ${place.averageRating}`}
                  onClick={() => handlePlaceClick(place)}
                  onIgnore={() => handleIgnore(place.placeId)}
                />
              ))}
              {visibleCount < allPlacesData.length - ignoredIds.length && (
                <div className="flex justify-end mt-4">
                  <MoreButton onClick={handleMoreClick} />
                </div>
              )}
            </>
          )}
        </div>

        <AnimatePresence>
          {selectedPlaceDto && (
            <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm px-4">
              <motion.div
                className="w-full max-w-md"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.3 }}
              >
                <PlacePage
                  placeDto={selectedPlaceDto}
                  reviews={selectedReviews}
                  onClose={() => setSelectedPlaceDto(null)}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-0 left-0 right-0">
          <NavigationBar />
        </div>
      </div>
    </div>
  );
};

export default Recommend;
