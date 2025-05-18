import { AuthFetch } from "../../../../common/utils/fetch";
import { ApiResponse } from "../../../../common/interfaces/response/ApiResponse";

export const followRequestApi = async (
  authFetch: AuthFetch,
  memberId: number
): Promise<{ success: boolean }> => {
  try {
    const response = await authFetch<ApiResponse<string>>(
      `/rest-api/v1/member/follow/${memberId}`,
      {},
      "POST"
    );
    return { success: response.returnCode === "SUCCESS" };
  } catch (err) {
    console.error("팔로우 요청 실패:", err);
    return { success: false };
  }
};

export const followRequestCancelApi = async (
  authFetch: AuthFetch,
  memberId: number
): Promise<{ success: boolean }> => {
  try {
    const response = await authFetch<ApiResponse<string>>(
      `/rest-api/v1/member/follow/${memberId}`,
      {},
      "DELETE"
    );
    return { success: response.returnCode === "SUCCESS" };
  } catch (err) {
    console.error("팔로우 요청취소 실패:", err);
    return { success: false };
  }
};

export const acceptFollowApi = async (
  authFetch: AuthFetch,
  memberId: number
): Promise<{ success: boolean }> => {
  try {
    const response = await authFetch<ApiResponse<string>>(
      `/rest-api/v1/member/followReq/${memberId}`,
      {},
      "POST"
    );
    return { success: response.returnCode === "SUCCESS" };
  } catch (err) {
    console.error("팔로우 수락 실패:", err);
    return { success: false };
  }
};

export const rejectFollowApi = async (
  authFetch: AuthFetch,
  memberId: number
): Promise<{ success: boolean }> => {
  try {
    const response = await authFetch<ApiResponse<string>>(
      `/rest-api/v1/member/followReq/${memberId}`,
      {},
      "DELETE"
    );
    return { success: response.returnCode === "SUCCESS" };
  } catch (err) {
    console.error("팔로우 거절 실패:", err);
    return { success: false };
  }
};

export const cancelFollowApi = async (
  authFetch: AuthFetch,
  memberId: number
): Promise<{ success: boolean }> => {
  try {
    const response = await authFetch<ApiResponse<string>>(
      `/rest-api/v1/member/followMember/${memberId}`,
      {},
      "DELETE"
    );
    return { success: response.returnCode === "SUCCESS" };
  } catch (err) {
    console.error("팔로우 취소 실패:", err);
    return { success: false };
  }
};

export const deleteFollowerApi = async (
  authFetch: AuthFetch,
  memberId: number
): Promise<{ success: boolean }> => {
  try {
    const response = await authFetch<ApiResponse<string>>(
      `/rest-api/v1/member/followed/${memberId}`,
      {},
      "DELETE"
    );
    return { success: response.returnCode === "SUCCESS" };
  } catch (err) {
    console.error("팔로워 삭제 실패:", err);
    return { success: false };
  }
};
