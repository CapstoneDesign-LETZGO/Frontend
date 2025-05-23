import { useState, useCallback } from 'react';
import { fetchPlaceDtoApi, postReviewApi, deleteReviewApi, fetchPlaceSearchApi } from '../services/MapService';
import { useAuthFetch } from '../../../common/hooks/useAuthFetch';
import {PlaceDto, Review} from "../../../common/interfaces/MapInterface.ts";
import {toast} from "react-toastify";
import { RestaurantInfo, HotelInfo, fetchRestaurantInfoApi, fetchHotelInfoApi } from '../services/MapService';

export const usePlaceInfo = () => {
  const [placeDto, setPlaceDto] = useState<PlaceDto | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchResults, setSearchResults] = useState<PlaceDto[]>([]);
  const [loading, setLoading] = useState(false);
  const { authFetch } = useAuthFetch();
  const [restaurantList, setRestaurantList] = useState<RestaurantInfo[]>([]);
  const [hotelList, setHotelList] = useState<HotelInfo[]>([]);


  // 해당 장소 조회
  const fetchPlaceDto = async (placeId: string) => {
    setLoading(true);
    try {
      const { placedata, reviews, success } = await fetchPlaceDtoApi(authFetch, placeId);
      if (success) {
        setPlaceDto(placedata);
        setReviews(reviews);
        return { placeDto: placedata, reviews };
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
    console.log(placeId, formData);
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

  const fetchRegionRestaurant = async (region: string) => {
  setLoading(true);
  try {
    const data = await fetchRestaurantInfoApi(authFetch, region);
    setRestaurantList(data);
  } catch {
    setRestaurantList([]);
  } finally {
    setLoading(false);
  }
};

const fetchRegionHotel = async (region: string) => {
  setLoading(true);
  try {
    const data = await fetchHotelInfoApi(authFetch, region);
    setHotelList(data);
  } catch {
    setHotelList([]);
  } finally {
    setLoading(false);
  }
};

  return {
    placeDto,
    reviews,
    searchResults,
    fetchPlaceDto,
    postReview,
    fetchPlaceSearch,
    deleteReview,
    loading,
    fetchRegionRestaurant,
    fetchRegionHotel,
    restaurantList,
    hotelList
  };
};
