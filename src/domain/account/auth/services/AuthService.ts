import publicApi from "../../../../common/libs/publicApi.ts";

export const AuthService = {
    login: (email: string, password: string) =>
        publicApi.post('/rest-api/v1/auth/login', { email, password }),

    getSocialRedirectUrl: (provider: 'naver' | 'kakao' | 'google') =>
        publicApi.get(`/rest-api/v1/oauth2/redirect-url/${provider}`)
};
