import { useState, useCallback } from 'react';
import { fetchPlaceDtoApi, postReviewApi, deleteReviewApi, fetchPlaceSearchApi } from '../services/MapService';
import { useAuthFetch } from '../../../common/hooks/useAuthFetch';
import {PlaceDto, Review} from "../../../common/interfaces/MapInterface.ts";
import {toast} from "react-toastify";

export const usePlaceInfo = () => {
  const [placeDto, setPlaceDto] = useState<PlaceDto | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchResults, setSearchResults] = useState<PlaceDto[]>([]);
  const [loading, setLoading] = useState(false);
  const { authFetch } = useAuthFetch();

  // 해당 장소 조회
  const fetchPlaceDto = async (placeId: string): Promise<{ placeDto: PlaceDto; reviews: Review[] } | null> => {
    setLoading(true);
    try {
      const response = await fetchPlaceDtoApi(authFetch, placeId);
      if (response.returnCode === 'SUCCESS' && response.placedata) {
        setPlaceDto(response.placedata);
        setReviews(response.reviews);
        return {
          placeDto: response.placedata,
          reviews: response.reviews,
        };
      } else {
        return null;
      }
    } catch (err) {
      console.error('장소 정보를 가져오는 중 오류 발생:', err);
      toast.error("장소 정보를 가져오는 중 오류가 발생했습니다.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 리뷰 생성
  const postReview = async (placeId: string, formData: FormData) => {
    setLoading(true);
    try {
      const success = await postReviewApi(authFetch, placeId, formData);
      if (success) {
        await fetchPlaceDto(placeId); // 등록 후 새로고침
      }
      return success;
    } catch (err) {
      console.error('리뷰 등록 중 오류 발생:', err);
      toast.error("리뷰 등록 중 오류가 발생했습니다.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 리뷰 삭제
  const deleteReview = async (reviewId: number) => {
    setLoading(true);
    try {
      const success = await deleteReviewApi(authFetch, reviewId);
      if (success) {
        setReviews((prev) => prev.filter((review) => review.id !== reviewId));
      }
      return success;
    } catch (err) {
      console.error('리뷰 삭제 중 오류 발생:', err);
      toast.error("리뷰 삭제 중 오류가 발생했습니다.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 장소 검색
  const fetchPlaceSearch = useCallback(
      async (query: string, lat: number, lng: number, radius = 1000) => {
        if (!query) return;
        setLoading(true);
        try {
          const { places, success } = await fetchPlaceSearchApi(authFetch, query, lat, lng, radius);
          if (success) {
            setSearchResults(places);
          } else {
            setSearchResults([]);
          }
        } catch (err) {
          console.error('검색 중 오류 발생:', err);
          toast.error("검색 중 오류가 발생했습니다.");
          setSearchResults([]);
        } finally {
          setLoading(false);
        }
      },
      [authFetch]
  );

  return {
    placeDto,
    reviews,
    searchResults,
    fetchPlaceDto,
    postReview,
    fetchPlaceSearch,
    deleteReview,
    loading,
  };
};
