import { Link } from "react-router-dom";

interface LoginFormProps {
    email: string;
    password: string;
    setEmail: (value: string) => void;
    setPassword: (value: string) => void;
    handleSocialLogin: (provider: 'naver' | 'kakao' | 'google') => void;
    handleLogin: () => void;
}

const LoginForm = ({
                       email,
                       password,
                       setEmail,
                       setPassword,
                       handleSocialLogin,
                       handleLogin
                   }: LoginFormProps) => {
    return (
        <div className="flex flex-col min-h-screen w-full max-w-md mx-auto px-4">
            <div className="flex-1 flex flex-col items-center justify-center mt-10">
                <img src="/src/assets/icons/logo/logo-simple.png" alt="logo" className="w-16 h-16 mb-3" />
                <h1 className="text-2xl font-bold mb-8">Letzgo</h1>
                <div className="w-full">
                    <button
                        onClick={() => handleSocialLogin('naver')}
                        className="w-full py-3 mb-3 rounded-lg font-bold text-white bg-[#03C75A] relative hover:brightness-95"
                    >
                        <img src="/src/assets/icons/logo/naver-simple.png" alt="Naver logo" className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2" />
                        <span className="block text-center">네이버 로그인</span>
                    </button>
                    <button
                        onClick={() => handleSocialLogin('kakao')}
                        className="w-full py-3 mb-3 rounded-lg font-bold text-[#3C1E1E] bg-[#FEE500] relative hover:brightness-95"
                    >
                        <img src="/src/assets/icons/logo/kakaotalk-simple.png" alt="Kakao logo" className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2" />
                        <span className="block text-center">카카오 로그인</span>
                    </button>
                    <button
                        onClick={() => handleSocialLogin('google')}
                        className="w-full py-3 mb-3 rounded-lg font-bold text-[#3C1E1E] bg-[#F5F5F5] relative hover:brightness-95"
                    >
                        <img src="/src/assets/icons/logo/google-simple.png" alt="Google logo" className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2" />
                        <span className="block text-center">구글 로그인</span>
                    </button>
                </div>
                <p className="text-gray-500 mt-6 mb-6 text-sm">또는</p>
                <div className="w-full">
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
                </div>
                <div className="w-full flex justify-center mb-6">
                    <Link to="/find-password" className="text-sm text-gray-500 underline">
                        비밀번호를 잊으셨나요? 비밀번호 찾기
                    </Link>
                </div>
                <div className="w-full">
                    <button
                        onClick={handleLogin}
                        className="w-full py-3 mb-3 rounded-lg font-bold text-white bg-black hover:brightness-70"
                    >
                        로그인
                    </button>
                    <Link
                        to="/signup"
                        className="w-full py-3 mb-3 rounded-lg font-bold text-white bg-black text-center block hover:brightness-70"
                    >
                        새 계정 만들기
                    </Link>
                </div>
            </div>
            <div className="h-10" />
        </div>
    );
};

export default LoginForm;
