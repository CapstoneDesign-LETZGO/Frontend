import React, { useState, useCallback, useEffect } from "react";
import MapView from "../components/mapPage/MapView";
import SearchBar from "../components/mapPage/SearchBar";
import NavigationBar from "../../../common/components/NavigationBar";
import CategoryFilter from "../components/mapPage/CategoryFilter";
import PlacePage from "../components/detailPage/PlacePage";
import SearchedPlacePage from "../components/searchedPlacePage/SearchedPlacePage";
import { usePlaceInfo } from "../hooks/usePlaceInfo";
import { motion, AnimatePresence } from "framer-motion";
import { PlaceDto, Review } from "../../../common/interfaces/MapInterface.ts";
import RegionOverlay from "../components/hotelandResutanrantInfoPage/RegionOverlay.tsx";
import {useLocation, useNavigate} from "react-router-dom";

const Map: React.FC = ( ) => {
  const [placeDto, setPlaceDto] = useState<PlaceDto | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_placeReviews, setPlaceReviews] = useState<Review[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [isPoiClick, setIsPoiClick] = useState(false);
  const { fetchPlaceDto, fetchPlaceSearch, searchResults } = usePlaceInfo();
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const fromManage = location.state?.from === 'manage';
  const initialLat = location.state?.lat;
  const initialLng = location.state?.lng;

  useEffect(() => {
    if (initialLat && initialLng) {
      const loc = { lat: initialLat, lng: initialLng };
      setMapCenter(loc);
    } else if (navigator.geolocation) {
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
  }, [initialLat, initialLng]);

  const handleSearch = useCallback(
    async (query: string) => {
      if (!query || !userLocation) return;
      const radius = 1000;
      await fetchPlaceSearch(query, userLocation.lat, userLocation.lng, radius);
      setIsSearching(true);
      setPlaceDto(null);
      setIsPoiClick(false); // 검색으로 진입 시 POI 클릭 아님
    },
    [fetchPlaceSearch, userLocation]
  );

  const handleSelectPlace = useCallback(
    async (place: PlaceDto, triggeredByPoi = false) => {
      try {
        const result = await fetchPlaceDto(place.placeId);
        if (result) {
          setPlaceDto(result.placeDto);
          setPlaceReviews(result.reviews);
          setIsSearching(false);
          setMapCenter({ lat: place.lat, lng: place.lng });
          setIsPoiClick(triggeredByPoi);
          return;
        }
      } catch {
        const mockPlace: PlaceDto = {
          name: "",
          address: "",
          placeId: place.placeId,
          placePhoto: "",
          lat: place.lat,
          lng: place.lng,
        };
        const mockReviews: Review[] = [];

        setPlaceDto(mockPlace);
        setPlaceReviews(mockReviews);
        setIsSearching(false);
        setMapCenter({ lat: place.lat, lng: place.lng });
        setIsPoiClick(triggeredByPoi);
      }
    },
    [fetchPlaceDto]
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
              selectedPlace={placeDto}
              markerPosition={initialLat && initialLng ? { lat: initialLat, lng: initialLng } : null}
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
              onPlaceClick={(place) => handleSelectPlace(place, false)}
              userLocation={userLocation}
            />
          </div>
        )}

        <AnimatePresence>
          {placeDto && (
            <div className="absolute inset-0 flex items-center justify-center z-80 bg-black/40 backdrop-blur-sm px-4">
              <motion.div
                className="w-full max-w-md"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.3 }}
              >
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 bg-opacity-40">
                  <PlacePage
                      placeDto={placeDto}
                      reviews={_placeReviews}
                      onClose={() => setPlaceDto(null)}
                      onSelect={fromManage ? () => navigate(-1) : undefined}
                      showSelectButton={fromManage}
                  />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {isOverlayOpen && (
          <div className="z-[70] absolute inset-0">
            <RegionOverlay onClose={() => setIsOverlayOpen(false)} />
          </div>
        )}
        <div className="absolute bottom-14 left-4 z-65">
          <button
            onClick={() => setIsOverlayOpen(true)}
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded-full shadow-lg hover:bg-gray-50 hover:shadow-xl transition-all duration-200 text-sm font-medium"
          >
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h18M3 12h18M3 19h18" />
            </svg>
            지역 숙소, 식당 목록
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-70">
          <NavigationBar />
        </div>
      </div>
    </div>
  );
};

export default React.memo(Map);
