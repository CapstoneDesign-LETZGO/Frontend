import { ApiResponse } from "../../../../common/interfaces/response/ApiResponse.ts";
import {AuthFetch, isSuccess} from "../../../../common/utils/fetchUtils.ts";
import { PostDto } from "../../../../common/interfaces/PostInterface.ts";

// 이름 수정
export const updateNameApi = async (
    authFetch: AuthFetch,
    newName: string
): Promise<{ success: boolean }> => { // ApiResponse를 반환
    try {
        const response = await authFetch<ApiResponse<string>>(
            "/rest-api/v1/member",
            { data: { name: newName }, headers: { "Content-Type": "application/json" } },
            "PUT"
        );
        console.log('Update Name Response:', response);
        return { success: isSuccess(response) };
    } catch (err) {
        console.error("이름 변경 중 오류:", err);
        return { success: false };
    }
};
