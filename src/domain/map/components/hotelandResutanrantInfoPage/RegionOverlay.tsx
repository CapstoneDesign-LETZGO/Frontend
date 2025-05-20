import React, { useState, useEffect } from "react";
import PlaceCard from "./PlaceCard";
import { usePlaceInfo } from "../../hooks/usePlaceInfo";

const REGIONS = [
    "경기도", "제주특별자치도", "충청남도", "인천광역시", "대구광역시", "대전광역시", "서울특별시",
    "경상남도", "부산광역시", "전북특별자치도", "울산광역시", "광주광역시", "강원특별자치도",
    "경상북도", "전라남도", "충청북도", "세종특별자치시"
];

interface RegionOverlayProps {
    onClose: () => void;
}

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
}

const RegionOverlay: React.FC<RegionOverlayProps> = ({ onClose }) => {
    const [selectedTab, setSelectedTab] = useState<"식당" | "숙소">("식당");
    const [selectedRegion, setSelectedRegion] = useState("서울특별자치시");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [sortOption, setSortOption] = useState<"rating" | "distance" | "priceHigh" | "priceLow">("rating");
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [categoryQuery, setCategoryQuery] = useState("");

    const {
        fetchRegionRestaurant,
        fetchRegionHotel,
        restaurantList,
        hotelList
    } = usePlaceInfo();

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                },
                (err) => {
                    console.warn("위치 정보를 가져오는 데 실패했습니다:", err);
                }
            );
        }
    }, []);

    useEffect(() => {
        if (selectedTab === "식당") {
            fetchRegionRestaurant(selectedRegion);
        } else {
            fetchRegionHotel(selectedRegion);
        }
    }, [selectedRegion, selectedTab]);

    const dataList = selectedTab === "식당" ? restaurantList : hotelList;

    const dataListWithDistance = dataList.map((item) => {
        const distance = userLocation
            ? getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, item.lat, item.lng)
            : 0;
        return {
            ...item,
            distance: Math.round(distance * 10) / 10,
        };
    });

    const uniqueDataList = Array.from(
        new Map(dataListWithDistance.map(item => [item.name, item])).values()
    );

    const filteredDataList = selectedTab === "식당" && categoryQuery.trim() !== ""
        ? uniqueDataList.filter((item) =>
            (item as any).category?.split(" ").some((tag: string) =>
                tag.toLowerCase().includes(categoryQuery.trim().toLowerCase())
            )
        )
        : uniqueDataList;

    const sortedDataList = [...filteredDataList].sort((a, b) => {
        const isHotel = selectedTab === "숙소";

        if (isHotel) {
            const priceA = (a as any).sukbakPrice ?? 0;
            const priceB = (b as any).sukbakPrice ?? 0;
            if (sortOption === "priceHigh") return priceB - priceA;
            if (sortOption === "priceLow") return priceA - priceB;
        }

        if (sortOption === "rating") return b.rating - a.rating;
        if (sortOption === "distance") return a.distance - b.distance;

        return 0;
    });

    const baseBtnClass = "px-3 py-1 rounded-full text-xs border transition";

    return (
        <div className="absolute inset-0 z-90 bg-white flex flex-col p-0 h-full">
            <div className="sticky top-0 bg-white z-10 p-4 pb-2">
                <div className="flex justify-end mb-0">
                    <button onClick={onClose} className="text-sm text-gray-500">닫기 ✕</button>
                </div>

                <div className="flex justify-around border-b border-gray-200 mb-2">
                    {["식당", "숙소"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => {
                                setSelectedTab(tab as "식당" | "숙소");
                                setCategoryQuery("");
                            }}
                            className={`flex-1 text-center py-2 font-medium ${selectedTab === tab ? "text-black border-b-[2px] border-black" : "text-gray-400"}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="mb-2">
                    <button
                        className="w-full border border-gray-300 px-4 py-2 rounded text-left flex justify-between items-center"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <span>{selectedRegion}</span>
                        <svg className="w-4 h-4 text-gray-500 ml-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            {isDropdownOpen
                                ? <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                                : <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />}
                        </svg>
                    </button>
                    <div className={`transition-all duration-300 ease-in-out ${isDropdownOpen ? "max-h-[300px] mt-2 border border-gray-300 rounded" : "max-h-0"}`}>
                        {isDropdownOpen && (
                            <div className="overflow-y-auto max-h-[250px] p-2">
                                {REGIONS.map((region) => (
                                    <button
                                        key={region}
                                        onClick={() => {
                                            setSelectedRegion(region);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`block w-full text-left px-2 py-2 rounded ${region === selectedRegion ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"}`}
                                    >
                                        {region}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {selectedTab === "식당" && (
                    <div className="mb-2">
                        <input
                            type="text"
                            placeholder="카테고리 검색"
                            value={categoryQuery}
                            onChange={(e) => setCategoryQuery(e.target.value)}
                            className="w-full border border-gray-300 px-4 py-2 rounded text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                    </div>
                )}

                <div className="flex flex-wrap gap-2">
                    <button onClick={() => setSortOption("rating")} className={`${baseBtnClass} ${sortOption === "rating" ? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-300"}`}>평점순</button>
                    <button onClick={() => setSortOption("distance")} className={`${baseBtnClass} ${sortOption === "distance" ? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-300"}`}>거리순</button>
                    {selectedTab === "숙소" && (
                        <>
                            <button onClick={() => setSortOption("priceHigh")} className={`${baseBtnClass} ${sortOption === "priceHigh" ? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-300"}`}>높은가격순</button>
                            <button onClick={() => setSortOption("priceLow")} className={`${baseBtnClass} ${sortOption === "priceLow" ? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-300"}`}>낮은가격순</button>
                        </>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-4">
                {sortedDataList.map((item, idx) => {
                    const isHotel = selectedTab === "숙소";
                    return (
                        <PlaceCard
                            key={`${item.name}-${item.lat}-${item.lng}`}
                            image={item.imagePath.split(" ")[0]}
                            title={item.name}
                            rating={item.rating}
                            distance={`${item.distance}km`}
                            address={item.location}
                            tags={
                                isHotel
                                    ? [String((item as any).sukbakPrice ?? "없음"), String((item as any).daesilPrice ?? "없음")]
                                    : (item as any).category.split(" ")
                            }
                            isHotel={isHotel}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default RegionOverlay;
