// hooks/useRecommend.ts
import { useEffect, useState } from "react";
import { useAuthFetch } from "../../../common/hooks/useAuthFetch";
import { PlaceInfo } from "../../map/types/MapTypes";

export const useRecommend = (count: number) => {
  const { authFetch } = useAuthFetch();
  const [data, setData] = useState<PlaceInfo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecommend = async () => {
      setLoading(true);
      try {
        const response = await authFetch(`/recommend/${count}`, {}, "GET");
        if (response?.data?.returnCode === "SUCCESS") {
          setData(response.data.data);
        } else {
          console.error("추천 장소 불러오기 실패:", response?.data?.returnMessage);
        }
      } catch (err) {
        console.error("추천 장소 호출 오류:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommend();
  }, [count]);

  return { data, loading };
};
