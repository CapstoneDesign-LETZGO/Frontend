import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSchedule } from "../contexts/ScheduleContext";
import { X, Search, ChevronLeft } from "lucide-react";

interface City {
  name: string;
  description: string;
  imageUrl: string;
}

const cityList: City[] = [
  { name: "가평·양평", description: "가평, 양평", imageUrl: "/images/gapyeong.jpg" },
  { name: "강릉·속초", description: "강릉, 속초, 양양", imageUrl: "/images/gangneung.jpg" },
  { name: "경주", description: "경주", imageUrl: "/images/gyeongju.jpg" },
  { name: "부산", description: "부산", imageUrl: "/images/busan.jpg" },
  { name: "여수", description: "여수, 순천", imageUrl: "/images/yeosu.jpg" },
  { name: "인천", description: "인천, 강화도", imageUrl: "/images/incheon.jpg" },
  { name: "전주", description: "전주, 군산", imageUrl: "/images/jeonju.jpg" },
  { name: "제주", description: "제주도", imageUrl: "/images/jeju.jpg" },
];

const SelectRegion = () => {
  const { setScheduleData } = useSchedule();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleSelect = (name: string) => {
    setSelected((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  const handleComplete = () => {
    if (selected.length === 0) {
      alert("최소 1개 도시를 선택해주세요.");
      return;
    }
    setScheduleData((prev) => ({ ...prev, region: selected.join(", ") }));
    navigate("/schedule/register");
  };

  const filteredCities = cityList.filter((city) =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen items-center bg-[#F5F5F5]">
      <div className="flex flex-col w-full max-w-md h-screen relative bg-white">

        {/* 검색창 */}
        <div className="flex items-center border-b border-gray-300 px-4 py-4">
          <ChevronLeft size={25} className="text-gray-600" />
          <input
            type="text"
            placeholder="여행, 어디로 떠나시나요?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 ml-3 bg-transparent outline-none text-base font-bold text-gray-800 placeholder:text-gray-400"
          />
          <Search size={25} className="text-gray-500" />
        </div>

        {/* 도시 리스트 */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          {filteredCities.map((city, idx) => {
            const isSelected = selected.includes(city.name);
            return (
              <div key={idx} className="flex items-center justify-between py-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={city.imageUrl}
                    alt={city.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-base font-bold text-gray-800">{city.name}</p>
                    <p className="text-sm text-gray-500">{city.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleSelect(city.name)}
                  className={`border px-3 py-1 rounded-full text-sm font-semibold transition ${
                    isSelected
                      ? "text-blue-600 border-blue-600"
                      : "text-gray-500 border-gray-300"
                  }`}
                >
                  {isSelected ? "취소" : "선택"}
                </button>
              </div>
            );
          })}
        </div>

        {/* 하단 고정 선택 확인 영역 */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-3 z-10">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {selected.map((city, idx) => {
              const cityObj = cityList.find((c) => c.name === city);
              return (
                <div key={idx} className="flex items-center gap-2">
                  <div className="flex flex-col items-center relative">
                    <img
                      src={cityObj?.imageUrl}
                      alt={city}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <button
                      onClick={() => toggleSelect(city)}
                      className="absolute -top-1 -right-1 bg-white rounded-full border border-gray-300"
                    >
                      <X size={12} className="text-gray-500" />
                    </button>
                    <p className="text-[11px] text-gray-600 mt-1 truncate max-w-[50px]">{city}</p>
                  </div>
                  {idx < selected.length - 1 && (
                    <span className="text-gray-400 text-lg">→</span>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={handleComplete}
            className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-base font-bold font-semibold"
          >
            {selected.length > 0
              ? `${selected[0]} 외 ${selected.length - 1}개 선택 완료`
              : "선택 완료"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectRegion;
