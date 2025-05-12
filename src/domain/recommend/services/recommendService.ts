import { PlaceDto } from "../../../common/interfaces/MapInterface.ts";
import { ApiResponse } from "../../../common/interfaces/response/ApiResponse";
import {AuthFetch, isSuccess} from "../../../common/utils/fetchUtils.ts";

// 추천 장소 조회
export const fetchRecommendApi = async (
    authFetch: AuthFetch
): Promise<{ places: PlaceDto[]; success: boolean }> => {
    try {
        const response = await authFetch<ApiResponse<PlaceDto>>(
            "/rest-api/v1/recommend", {}, "GET"
        );
        console.log('Response Data:', response);

        if (isSuccess(response)) {
            const places = response?.letzgoPage?.contents as unknown as PlaceDto[] ?? [];
            return { places, success: true };
        } else {
            console.error("추천 장소 불러오기 실패:", response?.returnMessage);
            return { places: [], success: false };
        }
    } catch (err) {
        console.error("추천 장소 호출 오류:", err);
        return { places: [], success: false };
    }
};
