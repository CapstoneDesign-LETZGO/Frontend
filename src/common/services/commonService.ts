import { MemberDto } from "../interfaces/MemberInterface.ts";
import { isSuccess } from "../../common/utils/fetchUtils.ts";
import { AuthFetch } from "../../common/utils/fetchUtils.ts";

// 본인 정보 조회
export const fetchUserInfoApi = async (
    authFetch: AuthFetch
): Promise<{ user: MemberDto | null; success: boolean }> => {
    try {
        const response = await authFetch<MemberDto>("/rest-api/v1/member", {}, "GET");
        console.log('Response Data:', response);

        if (isSuccess(response)) {
            return { user: response.data ?? null, success: true };
        } else {
            console.error("사용자 정보 가져오기 실패:", response?.returnMessage);
            return { user: null, success: false };
        }
    } catch (err) {
        console.error("사용자 정보를 가져오는 중 오류:", err);
        return { user: null, success: false };
    }
};
