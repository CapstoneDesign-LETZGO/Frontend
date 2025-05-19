import publicApi from "../../../../common/libs/publicApi.ts";
import {AuthFetch, isSuccess} from "../../../../common/utils/fetch.ts";
import {ApiResponse} from "../../../../common/interfaces/response/ApiResponse.ts";

// 로그인
export const AuthService = {
    login: (email: string, password: string) =>
        publicApi.post('/rest-api/v1/auth/login', { email, password }),

    getSocialRedirectUrl: (provider: 'naver' | 'kakao' | 'google') =>
        publicApi.get(`/rest-api/v1/oauth2/redirect-url/${provider}`)
};

// 로그아웃
export const logoutApi = async (
    authFetch: AuthFetch
): Promise<boolean> => {
    try {
        const response = await authFetch<ApiResponse<string>>(
            "/rest-api/v1/auth/logout", {}, "POST"
        );
        console.log("Logout Response:", response);
        return isSuccess(response);
    } catch (err) {
        console.error("로그아웃 중 오류 발생:", err);
        return false;
    }
};
