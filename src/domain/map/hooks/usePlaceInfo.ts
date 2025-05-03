// hooks/usePlaceInfo.ts
import { useState } from 'react';
import { useAuthFetch } from '../../../common/hooks/useAuthFetch';
import { PlaceInfo } from '../types/MapTypes';

export const usePlaceInfo = () => {
  const [placeInfo, setPlaceInfo] = useState<PlaceInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { authFetch } = useAuthFetch();

  const fetchPlaceInfo = async (placeId: string): Promise<PlaceInfo | null> => {
    setLoading(true);
    try {
      const response = await authFetch(`/map-api/place/${placeId}`, {}, 'GET');
      console.log(response);
      if (response && response.data.returnCode === 'SUCCESS') {
        const fetched = response.data.data.placeinfo; // ✅ 정확한 경로
        setPlaceInfo(fetched);
        setError(null);
        return fetched;
      } else {
        setError('장소 정보를 가져오는 데 실패했습니다.');
        return null;
      }
    } catch (err) {
      console.error('장소 정보를 가져오는 중 오류 발생:', err);
      setError('장소 정보를 가져오는 데 오류가 발생했습니다.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { placeInfo, fetchPlaceInfo, loading, error };
};
