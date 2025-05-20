import React, { useState, useCallback, useEffect } from "react";
import MapView from "../../map/components/mapPage/MapView";
import SearchBar from "../../map/components/mapPage/SearchBar";
import CategoryFilter from "../../map/components/mapPage/CategoryFilter";
import PlacePage from "../../map/components/detailPage/PlacePage";
import SearchedPlacePage from "../../map/components/searchedPlacePage/SearchedPlacePage";
import { usePlaceInfo } from "../../map/hooks/usePlaceInfo";
import { motion, AnimatePresence } from "framer-motion";
import { PlaceDto, Review } from "../../../common/interfaces/MapInterface.ts";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { authFetchData } from "../../../common/services/authFetchService";

const SchedulePlaceRegister: React.FC = () => {
  const { scheduleId } = useParams();
  const [searchParams] = useSearchParams();
  const orderIndex = Number(searchParams.get("day"));
  const navigate = useNavigate();

  const [placeDto, setPlaceDto] = useState<PlaceDto | null>(null);
  const [placeReviews, setPlaceReviews] = useState<Review[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [isPoiClick, setIsPoiClick] = useState(false);
  const { fetchPlaceDto, fetchPlaceSearch, searchResults } = usePlaceInfo();

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
      await fetchPlaceSearch(query, userLocation.lat, userLocation.lng, radius);
      setIsSearching(true);
      setPlaceDto(null);
      setIsPoiClick(false);
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

  const handleSavePlace = async () => {
    if (!placeDto || !scheduleId || !orderIndex) return;

    const payload = {
      name: placeDto.name,
      address: placeDto.address,
      placeId: placeDto.placeId,
      latitude: placeDto.lat,
      longitude: placeDto.lng,
      orderIndex,
    };

    try {
      await authFetchData<number>(
          `/api/schedules/${scheduleId}/places`,
          payload,
          "POST"
      );
      alert("장소가 성공적으로 등록되었습니다.");
      navigate(`/schedule/detail/${scheduleId}`);
    } catch {
      alert("장소 저장에 실패했습니다.");
    }
  };

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
                <PlacePage
                  placeDto={placeDto}
                  reviews={placeReviews}
                  onClose={() => setPlaceDto(null)}
                />
                <button
                  onClick={handleSavePlace}
                  className="mt-4 w-full py-3 bg-blue-600 text-white rounded-lg text-sm font-semibold"
                >
                  장소 저장하기
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default React.memo(SchedulePlaceRegister);
