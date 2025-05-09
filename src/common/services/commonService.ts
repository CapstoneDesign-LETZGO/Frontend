import {ApiResponse} from "../interfaces/response/ApiResponse.ts";
import {PostForm} from "../interfaces/CommunityInterface.ts";
import {MemberDto} from "../interfaces/MemberInterface.ts";

// 본인 정보 조회
export const fetchUserInfoApi = async (
    authFetch: <T>(
        url: string,
        data?: Record<string, unknown>,
        method?: "GET" | "POST" | "PUT" | "DELETE"
    ) => Promise<ApiResponse<T>>
): Promise<{ user: MemberDto | null; success: boolean }> => {
    try {
        const response = await authFetch<MemberDto>(
            "/rest-api/v1/member",
            {},
            "GET"
        );
        console.log('Response Data:', response);
        const success = response?.returnCode === 'SUCCESS';
        if (success) {
            const user = response?.data ?? null;
            return { user, success };
        } else {
            console.error("사용자 정보 가져오기 실패:", response?.returnMessage);
            return { user: null, success: false };
        }
    } catch (err) {
        console.error("사용자 정보를 가져오는 중 오류:", err);
        return { user: null, success: false };
    }
};

// 게시글 생성
export const addPostApi = async (
    authFetch: <T>(
        url: string,
        data?: Record<string, unknown>,
        method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    ) => Promise<ApiResponse<T>>,
    form: PostForm,
    imageFile: File
): Promise<boolean> => {
    try {
        const formData = new FormData();
        formData.append('postForm', new Blob([JSON.stringify(form)], { type: 'application/json' }));
        formData.append('imageFile', imageFile);
        const response = await authFetch<ApiResponse<string>>(
            '/rest-api/v1/post',
            {
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            },
            'POST'
        );
        return response?.data?.returnCode === 'SUCCESS';
    } catch (err) {
        console.error('게시글 등록 중 오류 발생:', err);
        return false;
    }
};
