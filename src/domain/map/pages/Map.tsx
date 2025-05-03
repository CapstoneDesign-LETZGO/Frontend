import React, { useState, useCallback } from "react";
import MapView from "../components/mapPage/MapView";
import SearchBar from "../components/mapPage/SearchBar";
import NavigationBar from "../../../common/components/NavigationBar";
import CategoryFilter from "../components/mapPage/CategoryFilter";
import PlacePage from "../components/detailPage/PlacePage";
import SearchedPlacePage from "../components/searchedPlacePage/SearchedPlacePage";
import { PlaceInfo, Review } from "../types/MapTypes";
import { usePlaceInfo } from "../hooks/usePlaceInfo";

const MyComponent: React.FC = () => {
  const [placeInfo, setPlaceInfo] = useState<PlaceInfo | null>(null);
  const [placeReviews, setPlaceReviews] = useState<Review[]>([]);
  const [searchResults, setSearchResults] = useState<PlaceInfo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { fetchPlaceInfo, loading, error } = usePlaceInfo();

  const handleSearch = useCallback((query: string) => {
    if (!query) return;

    const dummyResults: PlaceInfo[] = [
      {
        name: `${query} 맛집1`,
        address: "서울시 강남구",
        placeId: "1",
        placePhoto: "https://via.placeholder.com/80",
        lat: 37.5,
        lng: 127.0,
      },
      {
        name: `${query} 맛집2`,
        address: "서울시 강북구",
        placeId: "2",
        placePhoto: "https://via.placeholder.com/80",
        lat: 37.6,
        lng: 127.1,
      },
    ];

    setSearchResults(dummyResults);
    setIsSearching(true);
    setPlaceInfo(null);
  }, []);

  const handleSelectPlace = useCallback(
    async (place: PlaceInfo) => {
      try {
        const result = await fetchPlaceInfo(place.placeId);
        if (result) {
          setPlaceInfo(result.placeInfo);
          setPlaceReviews(result.reviews);
          setIsSearching(false);
          return;
        }

        // fallback mock
        throw new Error("API 실패 처리 진입");
      } catch {
        const mockPlace: PlaceInfo = {
          name: "모의 장소명",
          address: "서울특별시 중구 세종대로 110",
          placeId: place.placeId,
          placePhoto: "https://via.placeholder.com/300x200.png?text=Mock+Place",
          lat: place.lat,
          lng: place.lng,
        };

        const mockReviews: Review[] = [
          {
            id: 1,
            name: "홍길동",
            title: "좋았어요",
            rating: 5,
            content: "가족이랑 즐겁게 놀다 왔어요!",
            photoDir: "https://via.placeholder.com/300x200.png?text=Review+1",
          },
          {
            id: 2,
            name: "이순신",
            title: "보통이었음",
            rating: 3,
            content: "크게 특별하진 않네요.",
            photoDir: "https://via.placeholder.com/300x200.png?text=Review+2",
          },

          {
            id: 3,
            name: "이순신",
            title: "보통이었음",
            rating: 3,
            content: "크게 특별하진 않네요.",
            photoDir: "https://via.placeholder.com/300x200.png?text=Review+2",
          },

          {
            id: 4,
            name: "이순신",
            title: "보통이었음",
            rating: 3,
            content: "크게 특별하진 않네요.",
            photoDir: "https://via.placeholder.com/300x200.png?text=Review+2",
          },
        ];

        setPlaceInfo(mockPlace);
        setPlaceReviews(mockReviews);
        setIsSearching(false);
      }
    },
    [fetchPlaceInfo]
  );

  const handleCloseSearch = () => {
    setIsSearching(false);
    setSearchResults([]);
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
          <MapView
            onSelectPlace={handleSelectPlace}
            selectedCategory={selectedCategory}
          />
        </div>

        {isSearching && (
          <div className="absolute top-12 bottom-0 left-0 w-[350px] overflow-y-auto bg-white z-70 border-r border-gray-300 flex flex-col">
            <div className="p-2 border-b border-gray-200 flex justify-end">
              <button
                onClick={handleCloseSearch}
                className="bg-red-500 text-white border-none px-3 py-1 rounded text-sm cursor-pointer"
              >
                ❌ 닫기
              </button>
            </div>
            <SearchedPlacePage
              places={searchResults}
              onPlaceClick={handleSelectPlace}
            />
          </div>
        )}

        {placeInfo && (
          <div className="absolute inset-0 flex items-center justify-center z-80 px-4 py-6">
            <div className = "w-full max-w-md">
            <PlacePage
              placeInfo={placeInfo}
              reviews={placeReviews}
              onClose={() => setPlaceInfo(null)}
            />
            </div>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 z-100">
          <NavigationBar />
        </div>
      </div>
    </div>
  );
};

export default React.memo(MyComponent);
