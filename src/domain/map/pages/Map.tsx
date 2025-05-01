import React, { useState, useCallback } from "react";
import MapView from "../components/mapPage/MapView";
import SearchBar from "../components/mapPage/SearchBar";
import NavigationBar from "../../../common/components/NavigationBar";
import CategoryFilter from "../components/mapPage/CategoryFilter";
import PlacePage from "../components/detailPage/PlacePage";
import SearchedPlacePage from "../components/searchedPlacePage/SearchedPlacePage";
import { PlaceInfo } from "../types/MapTypes";
import { useAuthFetch } from "../../../common/hooks/useAuthFetch";

const MyComponent: React.FC = () => {
  const [placeInfo, setPlaceInfo] = useState<PlaceInfo | null>(null);
  const [searchResults, setSearchResults] = useState<PlaceInfo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { authFetch, loading } = useAuthFetch();

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

  const handleSelectPlace = useCallback(async (place: PlaceInfo) => {
    try {
      const response = await authFetch(`http://api.letzgo.site/map-api/place/${place.placeId}`, {
        method: "GET",
      });

      if (response) {
        const fetchedPlace = response.data.placeinfo as PlaceInfo;
        console.log(fetchedPlace);
        setPlaceInfo(fetchedPlace);
        setIsSearching(false);
      }
    } catch (error) {
      console.error("장소 정보 불러오기 실패:", error);
    }
  }, [authFetch]);


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
          <CategoryFilter />
        </div>
        <div className="flex-grow relative w-full z-60">
          <MapView onSelectPlace={handleSelectPlace} />
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
            <div className="absolute bottom-[300px] left-0 right-0 z-80 px-2">
              <PlacePage
                placeInfo={placeInfo}
                onClose={() => setPlaceInfo(null)}
              />
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
