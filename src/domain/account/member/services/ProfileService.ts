import {ApiResponse} from "../../../../common/interfaces/response/ApiResponse.ts";

// 이름 수정
export const updateNameApi = async (
    authFetch: <T>(
        url: string,
        data?: Record<string, unknown>,
        method?: "GET" | "POST" | "PUT" | "DELETE"
    ) => Promise<ApiResponse<T>>,
    newName: string
): Promise<boolean> => { // 성공 여부를 boolean이 아닌 ApiResponse로 반환
    try {
        const response = await authFetch<ApiResponse<string>>(
            "/rest-api/v1/member",
            { data: { name: newName }, headers: { "Content-Type": "application/json" } },
            "PUT"
        );
        return response?.data?.returnCode === 'SUCCESS';
    } catch (err) {
        console.error("이름 변경 중 오류:", err);
        return false;
    }
};
