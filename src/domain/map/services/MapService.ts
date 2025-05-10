import {PlaceDto, Review} from '../../../common/interfaces/MapInterface.ts';
import { ApiResponse } from '../../../common/interfaces/response/ApiResponse';
import {AxiosRequestConfig} from "axios";

// 해당 장소 조회
export const fetchPlaceDtoApi = async (
    authFetch: <T>(
        url: string,
        data?: Record<string, unknown>,
        method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    ) => Promise<ApiResponse<T>>,
    placeId: string
): Promise<{ placedata: PlaceDto | null; reviews: Review[]; returnCode: string }> => {
  try {
    const response = await authFetch<{
      placeinfo: PlaceDto;
      reviews: Review[];
    }>(`/map-api/place/${placeId}`, {}, 'GET');
    console.log('장소 조회 Response:', response);
    const returnCode = response?.returnCode ?? '';
    if (returnCode === 'SUCCESS') {
      const placedata = response?.data?.placeinfo ?? null;
      const reviews = response?.data?.reviews ?? [];
      return { placedata, reviews, returnCode };
    } else {
      console.error('장소 조회 실패:', response?.returnMessage);
      return { placedata: null, reviews: [], returnCode };
    }
  } catch (err) {
    console.error('장소 조회 중 오류:', err);
    throw new Error('장소 조회 중 오류 발생');
  }
};

// 리뷰 생성
export const postReviewApi = async (
    authFetch: <T>(
        url: string,
        options?: AxiosRequestConfig,
        method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    ) => Promise<ApiResponse<T>>,
    placeId: string,
    formData: FormData
): Promise<boolean> => {
  try {
    const response = await authFetch<ApiResponse<string>>(
        `/map-api/review/${placeId}`,
        {
          data: formData,
          headers: { 'Content-Type': 'multipart/form-data' }
        },
        'POST'
    );
    return response?.data?.returnCode === 'SUCCESS';
  } catch (err) {
    console.error('리뷰 등록 중 오류:', err);
    return false;
  }
};

// 리뷰 삭제
export const deleteReviewApi = async (
    authFetch: <T>(
        url: string,
        options?: AxiosRequestConfig,
        method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    ) => Promise<ApiResponse<T>>,
    reviewId: number
): Promise<boolean> => {
  try {
    const response = await authFetch<ApiResponse<string>>(
        `/map-api/review/${reviewId}`,
        undefined, // DELETE에서는 body 필요 없음
        'DELETE'
    );
    return response?.data?.returnCode === 'SUCCESS';
  } catch (err) {
    console.error('리뷰 삭제 중 오류:', err);
    return false;
  }
};

// 장소 검색
export const fetchPlaceSearchApi = async (
    authFetch: <T>(
        url: string,
        data?: Record<string, unknown>,
        method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    ) => Promise<ApiResponse<T>>,
    query: string,
    lat: number,
    lng: number,
    radius = 1000,
    num = 10
): Promise<{ places: PlaceDto[]; success: boolean }> => {
  try {
    const response = await authFetch<ApiResponse<PlaceDto>>(
        `/map-api/places?query=${encodeURIComponent(query)}&lat=${lat}&lng=${lng}&radius=${radius}&num=${num}`,
        {},
        'GET'
    );
    console.log('Response Data:', response);
    const success = response?.returnCode === 'SUCCESS';
    if (success) {
      const places = response?.letzgoPage?.contents as unknown as PlaceDto[] ?? [];
      return { places, success };
    } else {
      console.error('장소 검색 실패:', response?.returnMessage);
      return { places: [], success };
    }
  } catch (err) {
    console.error('장소 검색 중 오류:', err);
    return { places: [], success: false };
  }
};
