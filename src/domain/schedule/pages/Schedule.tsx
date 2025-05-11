import { ArrowLeft, Search } from "lucide-react";

const Schedule = () => {
  const cities = ["제주도", "영주", "인천", "서울", "대구", "부산", "횡성", "대전"];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <div className="w-full max-w-sm">

        {/* 상단 헤더 */}
        <div className="flex items-center px-4 py-4 border-b">
          <ArrowLeft size={20} className="text-gray-700" />
          <input
            type="text"
            placeholder="여행, 어디로 떠나시나요?"
            className="flex-1 ml-3 bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
          />
          <Search size={20} className="text-gray-700" />
        </div>

        {/* 도시 리스트 */}
        <ul>
          {cities.map((city, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between px-4 py-3 border-b"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full" />
                <span className="ml-4 text-sm text-gray-800">{city}</span>
              </div>
              <button className="px-3 py-1 rounded-md text-sm text-white bg-[#7646FF]">
                선택
              </button>
            </li>
          ))}
        </ul>

        {/* 완료 버튼 */}
        <div className="px-4 py-6">
          <button className="w-full bg-[#7646FF] text-white py-3 text-sm font-semibold rounded-md">
            완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default Schedule;