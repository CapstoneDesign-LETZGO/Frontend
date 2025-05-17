import React, { useState } from "react";
import FindAccountHeader from "../components/FindPasswordHeader";
import { useMemberActions } from "../../member/hooks/useMemberActions";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const FindAccountPage: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState(""); // 이메일만 사용
    const [verificationCode, setVerificationCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [token, setToken] = useState(""); // 인증코드를 토큰으로 저장

    const {
        sendEmailCode,
        verifyEmailCode,
        resetPassword,
        loading,
    } = useMemberActions();

    const handleNext = async () => {
        if (step === 1) {
            const success = await sendEmailCode(email);
            if (success) {
                toast.success("인증코드가 이메일로 전송되었습니다.");
                setStep(2);
            } else {
                toast.error("이메일 전송에 실패했습니다.");
            }
        } else if (step === 2) {
            const result = await verifyEmailCode(email, verificationCode);
            if (result.success) {
                toast.success("인증이 완료되었습니다.");
                setToken(result.token!);
                setStep(3);
            } else {
                toast.error("인증코드가 올바르지 않습니다.");
            }
        } else if (step === 3) {
            const success = await resetPassword(email, token, newPassword);
            if (success) {
                toast.success("비밀번호가 성공적으로 변경되었습니다.");
                navigate("/login");
            } else {
                toast.error("비밀번호 재설정에 실패했습니다.");
            }
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-white">
            <FindAccountHeader />
            <div className="mt-[64px] p-6 w-full max-w-md">
                {step === 1 && (
                    <>
                        <div className="flex flex-col items-center mb-10">
                            <img src="/src/assets/icons/system/lock_line.svg" alt="lock" className="h-40 mb-4 mt-50" />
                            <h2 className="text-xl font-semibold">로그인이 안되시나요?</h2>
                            <p className="text-base text-gray-500 text-center mt-2">
                                비밀번호를 찾기 위해 가입시 입력한 이메일주소를 입력해주세요.
                            </p>
                        </div>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="이메일 주소"
                            className="border rounded-md px-4 py-2 w-full mb-4"
                        />
                        <button
                            onClick={handleNext}
                            className="bg-black text-white w-full py-2 rounded-md"
                            disabled={loading}
                        >
                            {loading ? "전송 중..." : "다음"}
                        </button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <h2 className="text-xl font-semibold mb-2 mt-90 text-center">인증 코드 입력</h2>
                        <p className="text-base text-gray-600 mb-2 text-center">
                            {email} 으로 전송된 인증 코드를 입력해주세요.
                        </p>
                        <div className="text-center">
                            <button
                                onClick={() => sendEmailCode(email)}
                                className="text-blue-800 hover:underline text-base"
                                disabled={loading}
                            >
                                코드 재전송
                            </button>
                        </div>
                        <input
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            placeholder="인증 코드"
                            className="border rounded-md px-4 py-2 w-full mb-4 mt-10"
                        />
                        <button
                            onClick={handleNext}
                            className="bg-black text-white w-full py-2 rounded-md"
                            disabled={loading}
                        >
                            {loading ? "확인 중..." : "다음"}
                        </button>
                    </>
                )}

                {step === 3 && (
                    <>
                        <h2 className="text-center text-xl font-semibold mb-2 mt-90">새 비밀번호 입력</h2>
                        <p className="text-base text-gray-600 mb-10 text-center">
                            보안을 위해 특수문자를 포함한 6자 이상의<br />비밀번호를 만들어주세요.
                        </p>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="비밀번호"
                            className="border rounded-md px-4 py-2 w-full mb-4"
                        />
                        <button
                            onClick={handleNext}
                            className="bg-black text-white w-full py-2 rounded-md"
                            disabled={loading}
                        >
                            {loading ? "변경 중..." : "완료"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default FindAccountPage;
