import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSchedule } from "../contexts/ScheduleContext";
import { useMemberActions } from "../../account/member/hooks/useMemberActions.ts";
import { authFetchData } from "../../../common/services/authFetchService"; // ✅ 수정된 import
import { DateRange, DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { ko } from "date-fns/locale";
import { format } from "date-fns";
import { X } from "lucide-react";

const RegisterSchedule = () => {
  const { scheduleData } = useSchedule();
  const { member, loading } = useMemberActions({ mode: "member" });
  const navigate = useNavigate();

  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubmit = async () => {
    if (!member?.id || !range?.from || !range?.to) {
      alert("모든 정보를 입력해주세요.");
      return;
    }

    const title = `${scheduleData.region} 여행`;

    try {
      const newScheduleId = await authFetchData<number>(
        "/api/schedules",
        {
          hostAccountPk: member.id,
          region: scheduleData.region,
          title,
          startDate: format(range.from, "yyyy-MM-dd"),
          endDate: format(range.to, "yyyy-MM-dd"),
        },
        "POST"
      );

      console.log("✅ 등록된 일정 ID:", newScheduleId);
      navigate("/schedule/list");
    } catch (error) {
      console.error("❌ 일정 등록 실패:", error);
      alert("일정 등록에 실패했습니다.");
    }
  };

  const cityList = [
    { name: "가평·양평", imageUrl: "/images/gapyeong.jpg" },
    { name: "강릉·속초", imageUrl: "/images/gangneung.jpg" },
    { name: "경주", imageUrl: "/images/gyeongju.jpg" },
    { name: "부산", imageUrl: "/images/busan.jpg" },
    { name: "여수", imageUrl: "/images/yeosu.jpg" },
    { name: "인천", imageUrl: "/images/incheon.jpg" },
    { name: "전주", imageUrl: "/images/jeonju.jpg" },
    { name: "제주", imageUrl: "/images/jeju.jpg" },
  ];

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#F5F5F5]">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md h-screen flex flex-col">
        {/* 상단 헤더 */}
        <div className="flex items-center px-4 py-3 border-b border-gray-200">
          <button onClick={() => navigate("/community")}>
            <X className="text-gray-600" />
          </button>
        </div>

        {/* 제목 & 설명 */}
        <div className="px-5 bg-gray-50 py-3">
          <h2 className="text-2xl font-bold text-gray-800 py-2">여행 일정 등록</h2>
          <p className="text-base text-gray-500 mt-1 mb-4 font-bold">
            {scheduleData.region}의 여행 정보를 알려드립니다.
          </p>

          {/* 선택 지역 이미지 목록 */}
          <div className="flex items-center gap-2 overflow-x-auto py-3 px-2 bg-gray-50 border-b border-gray-100">
            {scheduleData.region.split(", ").map((city, idx, array) => {
              const cityObj = cityList.find((c) => c.name === city);
              return (
                <div key={idx} className="flex items-center gap-2">
                  <div className="flex flex-col items-center">
                    <img
                      src={cityObj?.imageUrl}
                      alt={city}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <p className="text-[11px] text-gray-700 mt-1 truncate max-w-[50px] text-center">
                      {city}
                    </p>
                  </div>
                  {idx < array.length - 1 && (
                    <span className="text-gray-400 text-lg">→</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 본문: 달력 */}
        <div className="flex-1 overflow-y-auto px-5 mt-6 pb-6">
          <div className="flex justify-center">
            <div className="max-h-[550px] overflow-y-auto w-full">
              <DayPicker
                mode="range"
                selected={range}
                onSelect={setRange}
                numberOfMonths={isMobile ? 1 : 3}
                pagedNavigation={false}
                locale={ko}
                showOutsideDays
                styles={{
                  caption: {
                    textAlign: "start",
                    fontWeight: "bold",
                    fontSize: "16px",
                    paddingBottom: "16px",
                  },
                  head_cell: { color: "#999", fontSize: "13px" },
                  day: { height: 40, width: 40, margin: 2 },
                }}
                modifiersStyles={{
                  weekend: { color: "#D14343" },
                  selected: {
                    backgroundColor: "#2563eb",
                    color: "white",
                    borderRadius: "50%",
                  },
                  range_middle: {
                    backgroundColor: "#DBEAFE",
                    color: "#1E40AF",
                  },
                  today: {
                    fontWeight: "bold",
                    backgroundColor: "#F3F4F6",
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* 하단 고정 버튼 */}
        <div className="px-4 py-3 sticky bottom-0 bg-white">
          <button
            onClick={handleSubmit}
            disabled={loading || !range?.from || !range?.to}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-sm font-semibold disabled:opacity-40"
          >
            등록 완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterSchedule;
