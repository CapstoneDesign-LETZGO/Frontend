import {useCallback, useState} from "react";
import { useAuthFetch } from "../../../common/hooks/useAuthFetch";
import {PlaceDto} from "../../../common/interfaces/MapInterface.ts";
import {fetchRecommendApi} from "../services/recommendService.ts";
import {toast} from "react-toastify";

export const useRecommend = () => {
  const { authFetch } = useAuthFetch();
  const [recommendPlace, setRecommendPlace] = useState<PlaceDto[]>([]);
  const [loading, setLoading] = useState(false);

  // 추천 장소 조회
  const fetchRecommend = useCallback(async () => {
    setLoading(true);
    try {
      const { places, success } = await fetchRecommendApi(authFetch);
      if (success) {
        setRecommendPlace(places);
      }
    } catch (err) {
      console.error("추천 장소 정보를 가져오는 중 오류 발생:", err);
      toast.error("추천 장소 정보를 가져오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  return { recommendPlace, fetchRecommend, loading };
};
