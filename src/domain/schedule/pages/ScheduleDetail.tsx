import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { ChevronLeft, X } from "lucide-react";
import { authFetchData } from "../../../common/services/authFetchService";
import {
  ScheduleDto,
  SchedulePlaceDto,
} from "../../../common/interfaces/ScheduleInterface";
import dayjs from "dayjs";
import range from "lodash/range";
import weekday from "dayjs/plugin/weekday";
import updateLocale from "dayjs/plugin/updateLocale";
import "dayjs/locale/ko";
import {
  GoogleMap,
  Marker,
  Polyline,
  InfoWindow,
  useLoadScript,
} from "@react-google-maps/api";
import NavigationBar from "../../../common/components/NavigationBar";

dayjs.extend(weekday);
dayjs.extend(updateLocale);
dayjs.locale("ko");

const ScheduleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const mapRef = useRef<google.maps.Map | null>(null);
  const [schedule, setSchedule] = useState<ScheduleDto | null>(null);
  const [groupedPlaces, setGroupedPlaces] = useState<Record<number, SchedulePlaceDto[]>>({});
  const [selectedPlacePk, setSelectedPlacePk] = useState<number | null>(null);
  const [memoText, setMemoText] = useState("");
  const [showMemoModal, setShowMemoModal] = useState(false);
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [optimalRoute, setOptimalRoute] = useState<SchedulePlaceDto[]>([]);
  const [currentDay, setCurrentDay] = useState<number | null>(null);

  const { isLoaded } = useLoadScript({ googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY });

  const fetchSchedule = async () => {
    const res = await authFetchData<ScheduleDto>(`/api/schedules/${id}`);
    setSchedule(res);
  };

  const fetchGroupedPlaces = async () => {
    const res = await authFetchData(`/api/schedules/${id}/places/grouped`);
    setGroupedPlaces(res);
  };

  const fetchOptimalRoute = async (day: number) => {
    const res = await authFetchData(`/api/schedules/${id}/optimal-route?day=${day}`);
    setOptimalRoute(res);
    setCurrentDay(day);
    setShowRouteModal(true);
  };

  const handleReorder = async () => {
    const placePks = optimalRoute.map((p) => p.schedulePlacePk);
    await authFetchData(`/api/schedules/${id}/reorder?day=${currentDay}`, placePks, "POST");
    setShowRouteModal(false);
    fetchGroupedPlaces();
  };

  const handleDeleteMemo = async (placePk: number) => {
    await authFetchData(`/api/schedules/${id}/places/${placePk}/memo`, {}, "DELETE");
    fetchGroupedPlaces();
  };

  useEffect(() => {
    fetchSchedule();
    fetchGroupedPlaces();
  }, [id]);

  if (!schedule || !isLoaded) return <p className="p-4">불러오는 중...</p>;

  const start = dayjs(schedule.startDate);
  const end = dayjs(schedule.endDate);
  const totalDays = end.diff(start, "day") + 1;

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="w-full max-w-md mx-auto bg-white min-h-screen flex flex-col">
        <div className="flex items-center px-4 pt-4 pb-2 border-b border-gray-200">
          <button onClick={() => history.back()} className="mr-2">
            <ChevronLeft />
          </button>
        </div>

        <div className="px-4">
          <h1 className="text-2xl font-bold text-gray-800 py-2">
            {schedule.title} <span className="text-base text-gray-400">편집</span>
          </h1>
          <p className="text-base text-gray-500">{schedule.startDate} ~ {schedule.endDate}</p>
          {/* 일행 초대 영역 */}
          <div className="flex items-center gap-2 mt-3">

            {/* 일행 초대 버튼 */}
            <button
              onClick={() => setShowInviteModal(true)}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded-full"
            >
              일행초대
            </button>
          </div>
          {range(0, totalDays).map((i) => {
            const orderIndex = i + 1;
            const currentDate = start.add(i, "day");
            const places = groupedPlaces[orderIndex] || [];

            return (
              <div key={orderIndex} className="mt-6">
                <p className="text-lg font-bold text-gray-800">
                  Day {orderIndex} <span className="ml-2 text-gray-400">{currentDate.format("YYYY.MM.DD (dd)")}</span>
                </p>

                {places.map((place, idx) => (
                  <div key={place.schedulePlacePk} className="relative flex gap-3 items-start mt-4">
                    <button
                      onClick={async () => {
                        await authFetchData(`/api/schedules/${id}/places/${place.schedulePlacePk}`, {}, "DELETE");
                        fetchGroupedPlaces();
                      }}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                    >
                      <X size={16} />
                    </button>

                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-purple-500 text-white text-sm flex items-center justify-center">
                        {idx + 1}
                      </div>
                      {idx < places.length - 1 && <div className="w-[2px] bg-purple-200 h-10" />}
                    </div>

                    <div className="flex-1 bg-gray-50 rounded-2xl px-4 py-3 shadow">
                      <p className="font-semibold text-gray-800">{place.name}</p>
                      <p className="text-sm text-gray-500">{place.address}</p>

                      {place.memoContent && (
                        <div className="relative mt-2 text-sm bg-white border border-gray-200 shadow p-3 rounded-xl">
                          {place.memoContent}
                          <button
                            onClick={() => handleDeleteMemo(place.schedulePlacePk)}
                            className="absolute top-1 right-2 text-gray-400 hover:text-red-500"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      )}

                      <div className="mt-3">
                        <button
                          onClick={() => {
                            setSelectedPlacePk(place.schedulePlacePk);
                            setMemoText(place.memoContent || "");
                            setShowMemoModal(true);
                          }}
                          className="text-xs text-gray-700 px-2 py-1 rounded-xl bg-white shadow border border-gray-200 font-bold"
                        >
                          Memo
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="mt-4">
                  <button
                    onClick={() => navigate(`/schedule/register/place/${id}?day=${orderIndex}`)}
                    className="w-full py-3 text-base font-semibold rounded-xl bg-white shadow border border-gray-200"
                  >
                    장소 추가
                  </button>
                </div>

                {places.length > 0 && (
                  <div className="mt-2">
                    <button
                      onClick={() => fetchOptimalRoute(orderIndex)}
                      className="w-full py-3 text-base font-semibold rounded-xl bg-black text-white"
                    >
                      추천 여행 경로
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 메모 모달 */}
        {showMemoModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-5 rounded-xl w-[90%] max-w-sm shadow-xl">
              <h2 className="text-lg font-semibold mb-3">메모 작성</h2>
              <textarea
                value={memoText}
                onChange={(e) => setMemoText(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded p-2 mb-4"
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowMemoModal(false)} className="px-4 py-2 text-sm border rounded">
                  취소
                </button>
                <button
                  onClick={async () => {
                    if (!selectedPlacePk || !memoText.trim()) return;
                    const payload = { content: memoText };
                    await authFetchData(`/api/schedules/${id}/places/${selectedPlacePk}/memo`, payload, "POST");
                    setShowMemoModal(false);
                    setMemoText("");
                    fetchGroupedPlaces();
                  }}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded"
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 경로 안내 모달 */}
        {showRouteModal && optimalRoute.length > 0 && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
            <div className="bg-white w-full max-w-md mx-auto p-4 rounded-xl shadow-lg">
              <h2 className="text-lg font-bold mb-2"></h2>
              <div className="w-full h-[300px] mb-4 rounded overflow-hidden">


                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  onLoad={(map: google.maps.Map | null) => {
                    const bounds = new window.google.maps.LatLngBounds();
                    optimalRoute.forEach((place) => {
                      bounds.extend({ lat: place.latitude, lng: place.longitude });
                    });
                    map?.fitBounds(bounds);
                    mapRef.current = map;
                  }}
                  options={{
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: false,
                  }}
                >
                  {optimalRoute.map((place, idx) => (
                    <>
                      <Marker
                        key={`marker-${place.schedulePlacePk}`}
                        position={{ lat: place.latitude, lng: place.longitude }}
                        label={(idx + 1).toString()}
                      />

                      <InfoWindow
                        key={`info-${place.schedulePlacePk}`}
                        position={{ lat: place.latitude, lng: place.longitude }}
                        options={{ disableAutoPan: true }}
                      >
                        <div className="text-sm font-semibold text-gray-800 w-32">
                          {idx + 1}. {place.name}
                        </div>
                      </InfoWindow>
                    </>
                  ))}
                  <Polyline
                    path={optimalRoute.map((p) => ({ lat: p.latitude, lng: p.longitude }))}
                    options={{ strokeColor: "#0055FF", strokeOpacity: 1, strokeWeight: 3 }}
                  />
                </GoogleMap>
              </div>
              <ul className="text-sm text-gray-800 space-y-1 max-h-40 overflow-y-auto font-bold">
                {optimalRoute.map((place, idx) => (
                  <li key={place.schedulePlacePk}>
                    {idx + 1} - {place.name}
                  </li>
                ))}
              </ul>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => setShowRouteModal(false)}
                    className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded-xl font-bold"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleReorder}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-xl font-bold"
                  >
                    재정렬
                  </button>
                </div>
            </div>
          </div>
        )}
      </div>
      <NavigationBar />
    </div>
  );
};

export default ScheduleDetail;
