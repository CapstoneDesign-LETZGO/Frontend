import React, { useState } from "react";
import PlaceCard from "../components/PlaceCard";
import MoreButton from "../components/MoreButton";
import NavigationBar from "../../../common/components/NavigationBar";

const Recommend: React.FC = () => {
  const allPlacesData = [
    {
      id: 1,
      title: "COFF 커피숍",
      description: "분위기 좋은 카페",
      imageUrl: "/images/place1.jpg",
      rating: "⭐ 4.5",
    },
    {
      id: 2,
      title: "파스타 레스토랑",
      description: "이탈리안 레스토랑",
      imageUrl: "/images/place2.jpg",
      rating: "⭐ 4.7",
    },
    {
      id: 3,
      title: "삼겹살 맛집",
      description: "현지인 추천 고깃집",
      imageUrl: "/images/place3.jpg",
      rating: "⭐ 4.6",
    },
  ];

  const [visibleCount, setVisibleCount] = useState(2);
  const [ignoredIds, setIgnoredIds] = useState<number[]>([]);

  const handleMoreClick = () => {
    setVisibleCount((prev) => prev + 1);
  };

  const handleIgnore = (id: number) => {
    setIgnoredIds((prev) => [...prev, id]);
  };

  const visiblePlaces = allPlacesData
    .filter((place) => !ignoredIds.includes(place.id))
    .slice(0, visibleCount);

  return (
    <div className="flex flex-col min-h-screen items-center bg-[#F5F5F5]">
      <div className="flex flex-col w-full max-w-md min-h-screen relative bg-white">
        {/* 상단 타이틀 */}
        <h2 className="text-lg font-bold text-center p-4 border-b border-gray-200">
          사용자 맞춤 장소 추천
        </h2>

        {/* 리스트 영역 */}
        <div className="flex-1 overflow-y-auto p-4">
          {visiblePlaces.map((place) => (
            <PlaceCard
              key={place.id}
              image={place.imageUrl}
              title={place.title}
              rating={place.rating}
              onIgnore={() => handleIgnore(place.id)}
            />
          ))}

          {/* 더보기 버튼 */}
          {visibleCount < allPlacesData.length - ignoredIds.length && (
            <div className="flex justify-end mt-4">
              <MoreButton onClick={handleMoreClick} />
            </div>
          )}
        </div>

        {/* 네비게이션 바 */}
        <div className="absolute bottom-0 left-0 right-0">
          <NavigationBar />
        </div>
      </div>
    </div>
  );
};

export default Recommend;
