import { useEffect, useState } from "react";
import { useAuthFetch } from "../../../common/hooks/useAuthFetch";
import { UserCircle, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

const getThumbnailUrlFromTitle = (title: string) => {
  const firstRegion = title.split(",")[0].trim();
  const match = cityList.find(
    (city) =>
      firstRegion.includes(city.name) || city.name.includes(firstRegion)
  );
  return match ? match.imageUrl : "/images/default.jpg";
};

const ScheduleList = () => {
  const [schedules, setSchedules] = useState([]);
  const { authFetch } = useAuthFetch();
  const navigate = useNavigate();

  const fetchSchedules = async () => {
    const res = await authFetch("/api/schedules", {}, "GET");
    setSchedules(res.data);
  };

  const deleteSchedule = async (schedulePk: number) => {
    await authFetch(`/api/schedules/${schedulePk}`, {}, "DELETE");
    fetchSchedules();
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return (
    <div className="flex flex-col min-h-screen items-center bg-[#F5F5F5]">
      <div className="flex flex-col w-full max-w-md h-screen relative bg-white">

        {/* 프로필 */}
        <div className="flex flex-col items-center mt-8 mb-4">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
            <UserCircle className="w-12 h-12 text-gray-400" />
          </div>
          <p className="mt-2 font-semibold text-lg">평근</p>
        </div>

        {/* 탭 메뉴 */}
        <div className="flex justify-around border-b border-gray-200 mb-4 text-sm font-semibold">
          <button className="py-2 text-black border-b-2 border-black">내 일정</button>
          <button className="py-2 text-gray-400">리뷰</button>
          <button className="py-2 text-gray-400">여행기</button>
        </div>

        {/* 일정 만들기 버튼 */}
        <div className="px-4 mb-2">
          <div
            className="bg-gray-100 rounded-lg px-4 py-5 flex items-center justify-between cursor-pointer"
            onClick={() => navigate("/schedule/region")}
          >
            <div>
              <p className="text-base font-bold text-gray-800">여행 일정 만들기</p>
              <p className="text-sm text-gray-500">새로운 여행을 떠나보세요.</p>
            </div>
            <span className="text-3xl text-purple-500 font-bold">+</span>
          </div>
        </div>

        {/* 일정 리스트 */}
        <div className="flex-1 overflow-y-auto px-4 pb-24">
          {schedules.map((schedule: any) => (
            <div
              key={schedule.schedulePk}
              className="flex items-center justify-between py-3 border-b border-gray-100"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={getThumbnailUrlFromTitle(schedule.title)}
                  alt="썸네일"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-base font-bold text-gray-800">{schedule.title}</p>
                  <p className="text-sm text-gray-500">
                    {schedule.startDate} ~ {schedule.endDate}
                  </p>
                </div>
              </div>
              <button
                onClick={() => deleteSchedule(schedule.schedulePk)}
                className="text-gray-400 hover:text-red-400"
              >
                <MoreVertical size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScheduleList;
