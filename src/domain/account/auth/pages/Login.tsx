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
        <LoginForm
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            handleSocialLogin={handleSocialLogin}
            handleLogin={handleLogin}
        />
    );
};

export default Login;
