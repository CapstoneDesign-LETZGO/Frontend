import { useLogin } from "../hooks/useLogin";
import LoginForm from "../components/LoginForm";

interface LoginProps {
    setIsLoggedIn?: (value: (((prevState: boolean) => boolean) | boolean)) => void;
}

const Login = ({ setIsLoggedIn }: LoginProps) => {
    const {
        email,
        password,
        setEmail,
        setPassword,
        handleSocialLogin,
        handleLogin
    } = useLogin(setIsLoggedIn);

    return (
        <div className="flex min-h-screen bg-[#F5F5F5]">
            <div className="flex flex-col min-h-screen w-full max-w-md mx-auto px-4 bg-white">
                <LoginForm
                    email={email}
                    password={password}
                    setEmail={setEmail}
                    setPassword={setPassword}
                    handleSocialLogin={handleSocialLogin}
                    handleLogin={handleLogin}
                />
            </div>
        </div>
    );
};

export default Login;
