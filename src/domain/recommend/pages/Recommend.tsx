import React, { useState } from "react";
import PlaceCard from "../components/PlaceCard";
import MoreButton from "../components/MoreButton";
import NavigationBar from "../../../common/components/NavigationBar";
import PlacePage from "../../map/components/detailPage/PlacePage";
import { PlaceInfo, Review } from "../../map/types/MapTypes";
import { motion, AnimatePresence } from "framer-motion";

const Recommend: React.FC = () => {
  const allPlacesData: PlaceInfo[] = [
    { placeId: "1", name: "COFF 커피숍", address: "서울 강남구", placePhoto: "/images/place1.jpg", lat: 0, lng: 0 },
    { placeId: "2", name: "파스타 레스토랑", address: "서울 종로구", placePhoto: "/images/place2.jpg", lat: 0, lng: 0 },
    { placeId: "3", name: "삼겹살 맛집", address: "서울 마포구", placePhoto: "/images/place3.jpg", lat: 0, lng: 0 },
    { placeId: "4", name: "분식왕국", address: "서울 동작구", placePhoto: "/images/place4.jpg", lat: 0, lng: 0 },
    { placeId: "5", name: "전통 찻집", address: "서울 종로구", placePhoto: "/images/place5.jpg", lat: 0, lng: 0 },
    { placeId: "6", name: "프렌치 베이커리", address: "서울 서초구", placePhoto: "/images/place6.jpg", lat: 0, lng: 0 },
    { placeId: "7", name: "해장국 전문점", address: "서울 구로구", placePhoto: "/images/place7.jpg", lat: 0, lng: 0 },
    { placeId: "8", name: "버거 앤 프라이즈", address: "서울 강서구", placePhoto: "/images/place8.jpg", lat: 0, lng: 0 },
    { placeId: "9", name: "마라탕 천국", address: "서울 관악구", placePhoto: "/images/place9.jpg", lat: 0, lng: 0 },
    { placeId: "10", name: "빙수 카페", address: "서울 은평구", placePhoto: "/images/place10.jpg", lat: 0, lng: 0 },
  ];

  const [visibleCount, setVisibleCount] = useState(5);
  const [ignoredIds, setIgnoredIds] = useState<string[]>([]);
  const [selectedPlaceInfo, setSelectedPlaceInfo] = useState<PlaceInfo | null>(null);

  const handleMoreClick = () => setVisibleCount((prev) => prev + 2);
  const handleIgnore = (id: string) => setIgnoredIds((prev) => [...prev, id]);
  const handlePlaceClick = (place: PlaceInfo) => setSelectedPlaceInfo(place);

  const visiblePlaces = allPlacesData
    .filter((place) => !ignoredIds.includes(place.placeId))
    .slice(0, visibleCount);

  return (
    <div className="flex flex-col min-h-screen items-center bg-[#F5F5F5]">
      <div className="flex flex-col w-full max-w-md min-h-screen relative bg-white">
        {/* 헤더 고정 */}
        <h2 className="sticky top-0 z-10 bg-white text-lg font-bold text-center p-4 border-b border-gray-200">
          사용자 맞춤 장소 추천
        </h2>

        {/* 리스트 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto p-4 pb-24">
          {visiblePlaces.map((place) => (
            <PlaceCard
              key={place.placeId}
              image={place.placePhoto}
              title={place.name}
              rating={"⭐ 4.5"}
              onClick={() => handlePlaceClick(place)}
              onIgnore={() => handleIgnore(place.placeId)}
            />
          ))}

          {/* 더보기 버튼 */}
          {visibleCount < allPlacesData.length - ignoredIds.length && (
            <div className="flex justify-end mt-4">
              <MoreButton onClick={handleMoreClick} />
            </div>
          )}
        </div>

        {/* 상세정보 모달 */}
        <AnimatePresence>
          {selectedPlaceInfo && (
            <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm px-4">
              <motion.div
                className="w-full max-w-md"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.3 }}
              >
                <PlacePage
                  placeInfo={selectedPlaceInfo}
                  reviews={[]}
                  onClose={() => setSelectedPlaceInfo(null)}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* 네비게이션 바 */}
        <div className="absolute bottom-0 left-0 right-0">
          <NavigationBar />
        </div>
      </div>
    </div>
  );
};

export default Recommend;
