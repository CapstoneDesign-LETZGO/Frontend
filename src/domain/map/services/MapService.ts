import { PlaceDto, Review } from '../../../common/interfaces/MapInterface.ts';
import { ApiResponse } from '../../../common/interfaces/response/ApiResponse';
import { AuthFetch, isSuccess } from '../../../common/utils/fetch.ts';

export interface RestaurantInfo {
  name: string;
  region: string;
  location: string;
  rating: number;
  category: string;
  imagePath: string;
  lat: number;
  lng: number;
}

export interface HotelInfo {
  name: string;
  region: string;
  location: string;
  rating: number;
  sukbakPrice: number;
  daesilPrice: number;
  imagePath: string;
  lat: number;
  lng: number;
}

// 해당 장소 조회
export const fetchPlaceDtoApi = async (
    authFetch: AuthFetch,
    placeId: string
): Promise<{ placedata: PlaceDto | null; reviews: Review[]; success: boolean }> => {
  try {
    const response = await authFetch<{ placeinfo: PlaceDto; reviews: Review[] }>(
        `/map-api/place/${placeId}`,
        {},
        'GET'
    );
    console.log('장소 조회 Response:', response);
    const success = isSuccess(response);
    if (success) {
      return {
        placedata: response?.data?.placeinfo ?? null,
        reviews: response?.data?.reviews ?? [],
        success: true
      };
    } else {
      console.error('장소 조회 실패:', response?.returnMessage);
      return { placedata: null, reviews: [], success: false };
    }
  } catch (err) {
    console.error('장소 조회 중 오류:', err);
    return { placedata: null, reviews: [], success: false };
  }
};

// 리뷰 생성
export const postReviewApi = async (
  authFetch: AuthFetch,
  placeId: string,
  formData: FormData
): Promise<boolean> => {
  try {
    const response = await authFetch<ApiResponse<string>>(
      `/map-api/review/${placeId}`,
      formData,
      'POST'
    );
    console.log('Post Review Response:', response);
    return isSuccess(response);
  } catch (err) {
    console.error('리뷰 등록 중 오류:', err);
    return false;
  }
};

// 리뷰 삭제
export const deleteReviewApi = async (
    authFetch: AuthFetch,
    reviewId: number
): Promise<boolean> => {
  try {
    const response = await authFetch<ApiResponse<string>>(
        `/map-api/review/${reviewId}`,
        undefined,
        'DELETE'
    );
    return isSuccess(response);
  } catch (err) {
    console.error('리뷰 삭제 중 오류:', err);
    return false;
  }
};

// 장소 검색
export const fetchPlaceSearchApi = async (
    authFetch: AuthFetch,
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
    const success = isSuccess(response);
    return success
        ? { places: response?.letzgoPage?.contents as unknown as PlaceDto[] ?? [], success: true }
        : { places: [], success: false };
  } catch (err) {
    console.error('장소 검색 중 오류:', err);
    return { places: [], success: false };
  }
};

// 지역별 식당 조회
export const fetchRestaurantInfoApi = async (
  authFetch: AuthFetch,
  region: string
): Promise<RestaurantInfo[]> => {
  try {
    const response: ApiResponse<RestaurantInfo[]> = await authFetch(
      `/restaurant/info?region=${encodeURIComponent(region)}`,
      {},
      'GET'
    );
    return response.data ?? [];
  } catch (err) {
    console.error("식당 정보 불러오기 실패:", err);
    return [];
  }
};


// 지역별 호텔 조회
export const fetchHotelInfoApi = async (
  authFetch: AuthFetch,
  region: string
): Promise<HotelInfo[]> => {
  try {
    const response: ApiResponse<HotelInfo[]> = await authFetch(
      `/hotel/info?region=${encodeURIComponent(region)}`,
      {},
      'GET'
    );
    return response.data ?? [];
  } catch (err) {
    console.error("호텔 정보 불러오기 실패:", err);
    return [];
  }
};
