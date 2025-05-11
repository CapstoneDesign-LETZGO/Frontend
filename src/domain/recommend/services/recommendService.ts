import { PlaceDto } from "../../../common/interfaces/MapInterface.ts";
import { ApiResponse } from "../../../common/interfaces/response/ApiResponse";

// 추천 장소 조회
export const fetchRecommendApi = async (
    authFetch: <T>(
        url: string,
        data?: Record<string, unknown>,
        method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    ) => Promise<ApiResponse<T>>,
): Promise<{ places: PlaceDto[]; success: boolean }> => {
    try {
        const response = await authFetch<ApiResponse<{ data: PlaceDto[] }>>(
            `/rest-api/v1/recommend`,
            {},
            'GET'
        );
        console.log('Response Data:', response);
        const success = response?.returnCode === 'SUCCESS';
        if (success) {
            const places = response?.letzgoPage?.contents as unknown as PlaceDto[] ?? [];
            return { places, success };
        } else {
            console.error('추천 장소 불러오기 실패:', response?.returnMessage);
            return { places: [], success };
        }
    } catch (err) {
        console.error('추천 장소 호출 오류:', err);
        return { places: [], success: false };
    }
};
