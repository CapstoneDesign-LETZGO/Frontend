import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoreVertical, Heart } from "lucide-react";
import { authFetchData } from "../../../common/services/authFetchService";
import { useMemberActions } from "../../account/member/hooks/useMemberActions";
import { ScheduleDto } from "../../../common/interfaces/ScheduleInterface";
import NavigationBar from "../../../common/components/NavigationBar";

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
    (city) => firstRegion.includes(city.name) || city.name.includes(firstRegion)
  );
  return match ? match.imageUrl : "/images/default.jpg";
};

const ScheduleList = () => {
  const [schedules, setSchedules] = useState<ScheduleDto[]>([]);
  const { member } = useMemberActions({ mode: "member" });
  const navigate = useNavigate();

  const fetchSchedules = async () => {
    if (!member?.id) return;
    try {
      const res = await authFetchData<ScheduleDto[]>(
        "/api/schedules",
        { memberId: member.id },
        "GET"
      );
      setSchedules(res);
    } catch (error) {
      console.error("❌ 일정 불러오기 실패:", error);
    }
  };

  const deleteSchedule = async (schedulePk: number) => {
    try {
      await authFetchData(`/api/schedules/${schedulePk}`, {}, "DELETE");
      fetchSchedules();
    } catch (error) {
      console.error("❌ 일정 삭제 실패:", error);
    }
  };

  useEffect(() => {
    if (member?.id) {
      fetchSchedules();
    }
  }, [member?.id]);

  return (
    <div className="flex flex-col min-h-screen items-center bg-[#F5F5F5]">
      <div className="flex flex-col w-full max-w-md min-h-screen bg-white">
        <div className="px-5 pt-10">
          <h1 className="text-2xl font-bold text-black">당신의 여행을 계획해보세요</h1>
          <p className="text-sm text-gray-500 mt-1">당신만의 여행 일정을 지금 바로 등록하고 관리해보세요.</p>
        </div>

        <div className="mt-6 px-5">
          <p className="text-sm font-bold text-gray-600"></p>
          <p className="text-lg font-bold text-black mt-1">인기 지역</p>
          <div className="flex overflow-x-auto space-x-4 mt-4">
            {cityList.slice(0, 3).map((city, index) => (
              <div key={index} className="relative min-w-[8rem] h-40 rounded-xl overflow-hidden cursor-pointer">
                <img
                  src={city.imageUrl}
                  alt={city.name}
                  onError={(e) => (e.currentTarget.src = '/images/default.jpg')}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="absolute top-3 left-3 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <Heart size={14} className="text-red-500 fill-red-500" />
                </div>
                <div className="absolute bottom-10 left-3 text-[#DEF358] text-sm">{city.name}</div>
                <div className="absolute bottom-5 left-3 text-white text-xs">추천 여행지</div>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 mt-4 font-bold">자세히 보기</p>
        </div>

        {/* 일정 등록 버튼 */}
        <div className="px-4 mt-6">
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

        {/* 내 일정 목록 */}
        <div className="bg-black text-white mt-10 px-5 py-6 rounded-2xl min-h-[180px]">
          <h2 className="text-lg font-bold">내 일정</h2>
          <div className="flex space-x-4 text-sm mt-3">
            <span className="border-b-2 border-white pb-1">전체</span>
            <span>다가오는</span>
            <span>지난 여행</span>
          </div>

          <div className="mt-5 space-y-4">
            {schedules.length === 0 ? (
              <p className="text-center text-gray-400">등록된 일정이 없습니다.</p>
            ) : (
              schedules.map((schedule) => (
                <div
                  key={schedule.schedulePk}
                  className="bg-white rounded-xl flex items-center p-3 relative text-black"
                >
                  <img
                    src={getThumbnailUrlFromTitle(schedule.title)}
                    alt="썸네일"
                    onError={(e) => (e.currentTarget.src = '/images/default.jpg')}
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                  <div className="ml-4 flex-1">
                    <p
                      className="font-bold text-sm cursor-pointer"
                      onClick={() => navigate(`/schedule/detail/${schedule.schedulePk}`)}
                    >
                      {schedule.title}
                    </p>
                    <p className="text-xs text-gray-500">{schedule.startDate} ~ {schedule.endDate}</p>
                  </div>
                  <button
                    onClick={() => deleteSchedule(schedule.schedulePk)}
                    className="text-gray-400 hover:text-red-400"
                  >
                    <MoreVertical size={20} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="h-20"></div>
      </div>
      <NavigationBar />
    </div>
  );
};

export default ScheduleList;
