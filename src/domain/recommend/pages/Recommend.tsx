import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  reviewTags?: string[];
  distanceKm?: number;
}

const Recommend: React.FC = () => {
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(5);
  const [ignoredIds, setIgnoredIds] = useState<string[]>([]);
  const [selectedPlaceDto, setSelectedPlaceDto] = useState<PlaceDto | null>(null);
  const [ratedPlaces, setRatedPlaces] = useState<RatedPlace[]>([]);
  const [selectedReviews, setSelectedReviews] = useState<Review[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { recommendPlace: allPlacesData, fetchRecommend, loading } = useRecommend();
  const { fetchPlaceDto } = usePlaceInfo();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        console.warn("위치 정보를 가져올 수 없습니다:", err);
        setUserLocation(null);
      }
    );
  }, []);

  useEffect(() => {
    fetchRecommend();
  }, []);

  useEffect(() => {
    const fetchRatings = async () => {
      if (!userLocation) return;

      const filtered = allPlacesData.filter(p => !ignoredIds.includes(p.placeId));
      const sliced = filtered.slice(0, visibleCount);

      const results = await Promise.all(
        sliced.map(async (place) => {
          const data = await fetchPlaceDto(place.placeId);
          const reviews = data?.reviews ?? [];
          const avg =
            reviews.length === 0
              ? 0
              : Number((reviews.reduce((acc, cur) => acc + cur.rating, 0) / reviews.length).toFixed(1));
          const reviewTags = reviews.slice(0, 5).map(r => r.content.trim());

          const distance = getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, place.lat, place.lng);

          return {
            ...place,
            averageRating: avg,
            reviewTags,
            distanceKm: distance,
          };
        })
      );

      setRatedPlaces(results);
    };

    if (allPlacesData.length > 0 && userLocation) {
      fetchRatings();
    }
  }, [allPlacesData, visibleCount, ignoredIds, userLocation]);

  const handleMoreClick = () => setVisibleCount((prev) => prev + 2);
  const handleIgnore = (id: string) => setIgnoredIds((prev) => [...prev, id]);
  const handlePlaceClick = async (place: PlaceDto) => {
    const result = await fetchPlaceDto(place.placeId);
    if (result) {
      setSelectedPlaceDto(result.placeDto);
      setSelectedReviews(result.reviews);
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center bg-[#F5F5F5]">
      <div className="flex flex-col w-full max-w-md min-h-screen relative bg-white">

        {/* 상단 바: 뒤로가기 + 타이틀 */}
        <div className="sticky top-0 z-10 bg-white px-4 py-4 border-b border-gray-200">
          <div className="relative flex items-center justify-center">
            <button
              onClick={() => navigate("/map")}
              className="absolute left-0 p-2 rounded-full hover:bg-gray-100"
              aria-label="뒤로가기"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <h2 className="text-lg font-bold text-center">
              사용자 맞춤 장소 추천
            </h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 pb-24">
          {loading ? (
            <p className="text-center text-gray-500">불러오는 중...</p>
          ) : (
            <>
              {ratedPlaces.map((place) => (
                <PlaceCard
                  key={place.placeId}
                  image={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.placePhoto}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`}
                  title={place.name}
                  rating={`⭐ ${place.averageRating} · ${place.distanceKm?.toFixed(1)}km`}
                  reviewTags={place.reviewTags}
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

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export default Recommend;
