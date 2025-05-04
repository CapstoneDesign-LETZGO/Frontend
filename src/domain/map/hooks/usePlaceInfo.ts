import { useState, useCallback, useMemo } from 'react';
import { useAuthFetch } from '../../../common/hooks/useAuthFetch';
import { PlaceInfo, Review } from '../types/MapTypes';

export const usePlaceInfo = () => {
  const [placeInfo, setPlaceInfo] = useState<PlaceInfo | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchResults, setSearchResults] = useState<PlaceInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { authFetch } = useAuthFetch();

  // ✅ 장소 및 리뷰 정보 가져오기
  const fetchPlaceInfo = useCallback(
    async (placeId: string): Promise<{ placeInfo: PlaceInfo; reviews: Review[] } | null> => {
      setLoading(true);
      try {
        const response = await authFetch(`/map-api/place/${placeId}`, {}, 'GET');
        if (response?.data?.returnCode === 'SUCCESS') {
          const fetchedPlace = response.data.data?.placeinfo;
          const fetchedReviews = response.data.data?.reviews ?? [];

          setPlaceInfo(fetchedPlace);
          setReviews(fetchedReviews);
          setError(null);
          return { placeInfo: fetchedPlace, reviews: fetchedReviews };
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
    },
    [authFetch]
  );

  // ✅ 장소 검색
  const fetchPlaceSearch = useCallback(
    async (query: string, lat: number, lng: number, radius = 1000, num = 10) => {
      if (!query) return;

      setLoading(true);
      try {
        const response = await authFetch(
          `/map-api/places?query=${encodeURIComponent(query)}&lat=${lat}&lng=${lng}&radius=${radius}&num=${num}`,
          {},
          'GET'
        );

        if (response?.data?.returnCode === 'SUCCESS') {
          const results = response.data.data.map((item: any) => ({
            name: item.name,
            address: item.address,
            placeId: item.placeId,
            lat: item.lat,
            lng: item.lng,
          })) as PlaceInfo[];

          setSearchResults(results);
        } else {
          console.error('검색 실패:', response?.data?.returnMessage);
          setSearchResults([]);
        }
      } catch (err) {
        console.error('검색 중 오류 발생:', err);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    },
    [authFetch]
  );

  // ✅ 리뷰 작성
  const postReview = useCallback(
    async (placeId: string, formData: FormData): Promise<boolean> => {
      try {
        const response = await authFetch(
          `/map-api/review/${placeId}`,
          { data: formData },
          'POST'
        );

        if (response?.data?.returnCode === 'SUCCESS') {
          return true;
        } else {
          console.error('리뷰 등록 실패:', response?.data?.returnMessage);
          return false;
        }
      } catch (err) {
        console.error('리뷰 등록 중 오류 발생:', err);
        return false;
      }
    },
    [authFetch]
  );

  // ✅ useMemo로 반환값 고정
  return useMemo(() => ({
    placeInfo,
    reviews,
    searchResults,
    fetchPlaceInfo,
    postReview,
    fetchPlaceSearch,
    loading,
    error,
  }), [
    placeInfo,
    reviews,
    searchResults,
    fetchPlaceInfo,
    postReview,
    fetchPlaceSearch,
    loading,
    error,
  ]);
};
