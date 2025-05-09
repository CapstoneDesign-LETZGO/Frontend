import { ApiResponse } from "../../../common/interfaces/response/ApiResponse.ts";
import { DetailPostDto } from "../../../common/interfaces/CommunityInterface.ts";

// 본인/팔로우한 유저 게시글 조회
export const fetchPostApi = async (
    authFetch: <T>(
        url: string,
        data?: Record<string, unknown>,
        method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    ) => Promise<ApiResponse<T>>
): Promise<{ posts: DetailPostDto[]; success: boolean }> => {
    try {
        const response = await authFetch<ApiResponse<DetailPostDto>>(
            '/rest-api/v1/post/main', {}, 'GET'
        );
        console.log('Response Data:', response);
        const success = response?.returnCode === 'SUCCESS';
        if (success) {
            const posts = response?.letzgoPage?.contents as unknown as DetailPostDto[] ?? [];
            return { posts, success };
        } else {
            console.error("게시글 목록 조회 실패:", response?.returnMessage);
            return { posts: [], success };
        }
    } catch (err) {
        console.error("게시글 목록 조회 중 오류:", err);
        return { posts: [], success: false };
    }
};
