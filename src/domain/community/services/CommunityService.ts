import { ApiResponse } from "../../../common/interfaces/response/ApiResponse.ts";
import { DetailPostDto } from "../../../common/interfaces/CommunityInterface.ts";

export const getPosts = async (
    authFetch: <T>(
        url: string,
        data?: Record<string, unknown>,
        method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    ) => Promise<ApiResponse<T>>
): Promise<{ posts: DetailPostDto[]; returnCode: string }> => {
    try {
        const response = await authFetch<{
            letzgoPage: { contents: DetailPostDto[] };
            returnCode: string;
            returnMessage: string;
        }>(
            '/rest-api/v1/post/main',
            {},
            'GET'
        );
        console.log('Response Data:', response);
        const returnCode = response?.returnCode ?? '';
        if (returnCode === "SUCCESS") {
            const posts= response?.letzgoPage?.contents as unknown as DetailPostDto[] ?? [];
            return {
                posts,
                returnCode,
            };
        } else {
            console.error("게시글 목록 조회 실패:", response?.returnMessage);
            return { posts: [], returnCode };
        }
    } catch (err) {
        console.error("게시글 목록 조회 중 오류:", err);
        throw new Error("게시글 목록 조회 중 오류 발생");
    }
};
