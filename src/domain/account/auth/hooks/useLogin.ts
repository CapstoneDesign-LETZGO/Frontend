import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import {toast} from "react-toastify";
import {AuthService, logoutApi} from "../services/AuthService";
import { authFetch } from "../../../../common/services/authFetchService";
import {useNotification} from "../../../notification/hooks/useNotification.ts";
import { firebaseApp } from "../../../../common/libs/firebase.tsx";
import {getMessaging, getToken} from "firebase/messaging";

export const useLogin = (setIsLoggedIn?: (value: boolean) => void) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { saveFcmToken, deleteFcmToken } = useNotification();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get('accessToken');
        const refreshToken = params.get('refreshToken');

        if (accessToken && refreshToken) {
            (async () => {
                const userData = { accessToken, refreshToken };
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userToken', JSON.stringify(userData));
                setIsLoggedIn?.(true);
                await issueAndSaveFcmToken(); // FCM 저장이 끝난 후 이동
                navigate('/community');
            })();
        }
    }, [navigate, setIsLoggedIn]);

    const handleSocialLogin = async (provider: 'naver' | 'kakao' | 'google') => {
        try {
            const response = await AuthService.getSocialRedirectUrl(provider);
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
            const response = await AuthService.login(email, password);
            const tokens = response.data?.data;
            const userData = {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
            };
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userToken', JSON.stringify(userData));
            setIsLoggedIn?.(true);
            await issueAndSaveFcmToken();
            navigate('/community');
        } catch (error: unknown) {
            if (error instanceof AxiosError && error.response?.status === 401) {
                toast.error('로그인 실패: 이메일 또는 비밀번호를 확인해주세요.');
            } else {
                toast.error('로그인 요청 중 오류가 발생했습니다.');
            }
        }
    };

    // 실제 FCM 토큰 발급 및 서버 저장
    const issueAndSaveFcmToken = async (): Promise<void> => {
        try {
            const messaging = getMessaging(firebaseApp);
            const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY!;
            const currentToken = await getToken(messaging, { vapidKey });
            if (currentToken) {
                await saveFcmToken(currentToken);
            } else {
                console.warn("FCM 토큰 발급 불가: 사용자가 권한을 거부했거나 지원하지 않습니다.");
            }
        } catch (err) {
            console.error("FCM 토큰 발급/저장 중 오류:", err);
        }
    };

    const logout = async () => {
        try {
            await deleteFcmToken();
            const success = await logoutApi(authFetch);
            if (success) {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userToken');
                setIsLoggedIn?.(false);
                toast.success("로그아웃 되었습니다.");
                navigate('/login'); // 로그아웃 후 리디렉션 경로는 상황에 맞게 수정 가능
            } else {
                toast.error("로그아웃에 실패했습니다.");
            }
        } catch (err) {
            console.error("로그아웃 중 오류:", err);
            toast.error("로그아웃 중 오류가 발생했습니다.");
        }
    };

    return {
        email,
        password,
        setEmail,
        setPassword,
        handleSocialLogin,
        handleLogin,
        logout
    };
};

