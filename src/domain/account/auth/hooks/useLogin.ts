import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { authService } from "../services/authService";
import {toast} from "react-toastify";

export const useLogin = (setIsLoggedIn?: (value: boolean) => void) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get('accessToken');
        const refreshToken = params.get('refreshToken');

        if (accessToken && refreshToken) {
            const userData = { accessToken, refreshToken };
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userToken', JSON.stringify(userData));
            setIsLoggedIn?.(true);
            navigate('/community');
        }
    }, [navigate, setIsLoggedIn]);

    const handleSocialLogin = async (provider: 'naver' | 'kakao' | 'google') => {
        try {
            const response = await authService.getSocialRedirectUrl(provider);
            const redirectUrl = response.data?.data;
            if (redirectUrl) {
                window.location.href = redirectUrl;
            } else {
                console.error(`${provider} 로그인 실패: redirect URL 없음`);
                toast.error('소셜 로그인 실패: redirect URL이 없습니다.');
            }
        } catch (err) {
            console.error(`${provider} 로그인 중 에러 발생`, err);
            toast.error('소셜 로그인 요청 중 오류가 발생했습니다.');
        }
    };

    const handleLogin = async () => {
        try {
            const response = await authService.login(email, password);
            const tokens = response.data?.data;
            const userData = {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
            };
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userToken', JSON.stringify(userData));
            setIsLoggedIn?.(true);
            navigate('/community');
        } catch (error: unknown) {
            if (error instanceof AxiosError && error.response?.status === 401) {
                toast.error('로그인 실패: 이메일 또는 비밀번호를 확인해주세요.');
            } else {
                toast.error('로그인 요청 중 오류가 발생했습니다.');
            }
        }
    };

    return {
        email,
        password,
        setEmail,
        setPassword,
        handleSocialLogin,
        handleLogin,
    };
};

