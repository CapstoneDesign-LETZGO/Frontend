import React, { useState, useCallback, useEffect } from "react";
import MapView from "../components/mapPage/MapView";
import SearchBar from "../components/mapPage/SearchBar";
import NavigationBar from "../../../common/components/NavigationBar";
import CategoryFilter from "../components/mapPage/CategoryFilter";
import PlacePage from "../components/detailPage/PlacePage";
import SearchedPlacePage from "../components/searchedPlacePage/SearchedPlacePage";
import { PlaceInfo, Review } from "../types/MapTypes";
import { usePlaceInfo } from "../hooks/usePlaceInfo";
import { motion, AnimatePresence } from "framer-motion";

const Map: React.FC = () => {
  const [placeInfo, setPlaceInfo] = useState<PlaceInfo | null>(null);
  const [placeReviews, setPlaceReviews] = useState<Review[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [isPoiClick, setIsPoiClick] = useState(false);

  const {
    fetchPlaceInfo,
    fetchPlaceSearch,
    searchResults,
    loading,
    error,
  } = usePlaceInfo();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(loc);
          setMapCenter(loc);
        },
        (err) => {
          console.warn("위치 정보를 가져오는 데 실패했습니다:", err);
        }
      );
    }
  }, []);

  const handleSearch = useCallback(
    async (query: string) => {
      if (!query || !userLocation) return;
      const radius = 1000;
      const num = 10;

      await fetchPlaceSearch(query, userLocation.lat, userLocation.lng, radius, num);
      setIsSearching(true);
      setPlaceInfo(null);
      setIsPoiClick(false); // 검색으로 진입 시 POI 클릭 아님
    },
    [fetchPlaceSearch, userLocation]
  );

  const handleSelectPlace = useCallback(
    async (place: PlaceInfo, triggeredByPoi = false) => {
      try {
        const result = await fetchPlaceInfo(place.placeId);
        if (result) {
          setPlaceInfo(result.placeInfo);
          setPlaceReviews(result.reviews);
          setIsSearching(false);
          setMapCenter({ lat: place.lat, lng: place.lng });
          setIsPoiClick(triggeredByPoi);
          return;
        }
        throw new Error("API 실패 처리 진입");
      } catch {
        const mockPlace: PlaceInfo = {
          name: "api연결 오류",
          address: "",
          placeId: place.placeId,
          placePhoto: "",
          lat: place.lat,
          lng: place.lng,
        };
        const mockReviews: Review[] = [];

        setPlaceInfo(mockPlace);
        setPlaceReviews(mockReviews);
        setIsSearching(false);
        setMapCenter({ lat: place.lat, lng: place.lng });
        setIsPoiClick(triggeredByPoi);
      }
    },
    [fetchPlaceInfo]
  );

  const handleCloseSearch = () => {
    setIsSearching(false);
  };

  return (
    <div className="flex flex-col min-h-screen items-center bg-[#F5F5F5]">
      <div className="flex flex-col w-full max-w-md min-h-screen relative">
        <div className="absolute top-0 left-0 right-0 z-70">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="absolute top-[60px] left-0 right-0 z-70">
          <CategoryFilter onCategorySelect={setSelectedCategory} />
        </div>

        <div className="flex-grow relative w-full z-60">
          {mapCenter && (
            <MapView
              onSelectPlace={(place) => handleSelectPlace(place, true)}
              selectedCategory={selectedCategory}
              center={mapCenter}
              isPoiClick={isPoiClick}
              selectedPlace={placeInfo}
            />
          )}
        </div>

        {isSearching && (
          <div className="absolute top-12 bottom-0 left-0 w-[350px] overflow-y-auto bg-white z-70 border-r border-gray-300 flex flex-col">
            <div className="p-2 border-b border-gray-200 flex justify-end">
              <button
                onClick={handleCloseSearch}
                className="bg-gray-800 text-white border-none px-3 py-1 rounded text-sm cursor-pointer"
              >
                X 닫기
              </button>
            </div>
            <SearchedPlacePage
              places={searchResults}
              onPlaceClick={(place) =>  handleSelectPlace(place, false)}
            />
          </div>
        )}

        <AnimatePresence>
          {placeInfo && (
            <div className="absolute inset-0 flex items-center justify-center z-80 bg-black/40 backdrop-blur-sm px-4">
              <motion.div
                className="w-full max-w-md"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.3 }}
              >
                <PlacePage
                  placeInfo={placeInfo}
                  reviews={placeReviews}
                  onClose={() => setPlaceInfo(null)}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-0 left-0 right-0 z-70">
          <NavigationBar />
        </div>
      </div>
    </div>
  );
};

export default React.memo(Map);