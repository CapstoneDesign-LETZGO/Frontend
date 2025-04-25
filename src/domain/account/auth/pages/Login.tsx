import {Link, useNavigate} from 'react-router-dom';
import {useEffect, useState} from 'react';
import api from "../../../../common/libs/api.ts";
import {AxiosError} from "axios";

interface LoginProps {
    setIsLoggedIn?: (value: (((prevState: boolean) => boolean) | boolean)) => void;
}

const Login = ({ setIsLoggedIn }: LoginProps) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // 소셜 로그인 리디렉션 처리
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get('accessToken');
        const refreshToken = params.get('refreshToken');

        if (accessToken && refreshToken) {
            const userData = {
                accessToken,
                refreshToken,
            };
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userToken', JSON.stringify(userData));
            setIsLoggedIn?.(true);
            navigate('/community');
        }
    }, [navigate, setIsLoggedIn]);

    const handleSocialLogin = async (provider: 'naver' | 'kakao' | 'google') => {
        try {
            const response = await api.get(`/rest-api/v1/oauth2/redirect-url/${provider}`);
            const redirectUrl = response.data?.data;

            if (redirectUrl) {
                window.location.href = redirectUrl;
            } else {
                console.error(`${provider} 로그인 실패: redirect URL 없음`);
            }
        } catch (err) {
            console.error(`${provider} 로그인 중 에러 발생`, err);
        }
    };

    const handleLogin = async () => {
        try {
            const response = await api.post('/rest-api/v1/auth/login', {
                email,
                password,
            });

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
                alert('로그인 실패: 이메일 또는 비밀번호를 확인해주세요.');
            } else {
                alert('로그인 요청 중 오류가 발생했습니다.');
            }
        }
    };

    return (
        <div className="max-w-sm mx-auto mt-20 px-4 flex flex-col items-center">
            {/* 로고 + 앱 이름 */}
            <img src="/src/assets/icons/logo/logo-simple.png" alt="logo" className="w-16 h-16 mb-3" />
            <h1 className="text-2xl font-bold mb-8">Letzgo</h1>

            {/* 소셜 로그인 버튼 */}
            <button
                onClick={() => handleSocialLogin('naver')}
                className="w-full py-3 mb-3 rounded-lg font-bold text-white bg-[#03C75A] relative"
            >
                <img
                    src="/src/assets/icons/logo/naver-simple.png"
                    alt="Naver logo"
                    className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2"
                />
                <span className="block text-center">네이버 로그인</span>
            </button>
            <button
                onClick={() => handleSocialLogin('kakao')}
                className="w-full py-3 mb-3 rounded-lg font-bold text-[#3C1E1E] bg-[#FEE500] relative"
            >
                <img
                    src="/src/assets/icons/logo/kakaotalk-simple.png"
                    alt="Kakao logo"
                    className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2"
                />
                <span className="block text-center">카카오 로그인</span>
            </button>
            <button
                onClick={() => handleSocialLogin('google')}
                className="w-full py-3 mb-3 rounded-lg font-bold text-[#3C1E1E] bg-[#F5F5F5] relative"
            >
                <img
                    src="/src/assets/icons/logo/google-simple.png"
                    alt="Google logo"
                    className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2"
                />
                <span className="block text-center">구글 로그인</span>
            </button>
            <p className="text-gray-500 mt-3 mb-6 text-sm">또는</p>

            {/* 일반 로그인 */}
            <input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-2 px-3 mb-3 border border-gray-300 rounded-lg text-base"
            />
            <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-2 px-3 mb-3 border border-gray-300 rounded-lg text-base"
            />

            {/* 비밀번호 찾기 */}
            <p className="self-end mb-6 text-sm text-gray-500">
                <Link to="/find-password" className="underline">비밀번호를 잊으셨나요? 비밀번호 찾기</Link>
            </p>

            {/* 로그인 / 회원가입 버튼 */}
            <button onClick={handleLogin} className="w-full py-3 mb-3 rounded-lg font-bold text-white bg-black">로그인</button>
            <Link to="/signup" className="w-full py-3 mb-3 rounded-lg font-bold text-white bg-black text-center block">
                새 계정 만들기
            </Link>
        </div>
    );
};

export default Login;
