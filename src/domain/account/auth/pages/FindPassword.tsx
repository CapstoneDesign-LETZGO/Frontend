import React, { useState } from "react";
import FindAccountHeader from "../components/FindPasswordHeader";

const FindAccountPage: React.FC = () => {
    const [step, setStep] = useState(1);
    const [emailOrPhoneOrName, setEmailOrPhoneOrName] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const handleNext = () => {
        if (step === 1) setStep(2);
        else if (step === 2) setStep(3);
        else console.log("비밀번호 재설정 완료");
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-white">
            <FindAccountHeader />
            <div className="mt-[64px] p-6 w-full max-w-md">
                {step === 1 && (
                    <>
                        <div className="flex flex-col items-center mb-10">
                            <img src="/icons/system/lock_line.svg" alt="lock" className="h-40 mb-4 mt-50" />
                            <h2 className="text-xl font-semibold">로그인이 안되시나요?</h2>
                            <p className="text-base text-gray-500 text-center mt-2 ">
                                비밀번호를 찾기 위해 이메일주소,<br /> 전화번호 또는 사용자 이름을 입력해주세요.
                            </p>
                        </div>
                        <input
                            value={emailOrPhoneOrName}
                            onChange={(e) => setEmailOrPhoneOrName(e.target.value)}
                            placeholder="이메일, 전화번호, 사용자 이름"
                            className="border rounded-md px-4 py-2 w-full mb-4"
                        />
                        <button
                            onClick={handleNext}
                            className="bg-black text-white w-full py-2 rounded-md"
                        >
                            다음
                        </button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <h2 className="text-xl font-semibold mb-2 mt-90 text-center">인증 코드 입력</h2>
                        <p className="text-base text-gray-600 mb-2 text-center">
                            t****@e***.com으로 전송된 인증 코드를 입력해주세요.
                        </p>
                        {/* 코드 재전송 버튼 */}
                        <div className="text-center">
                            <button
                                onClick={() => console.log("코드 재전송")}
                                className="text-blue-800 hover:underline text-base"
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
                        >
                            다음
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
                            onClick={() => console.log("비밀번호 설정 완료")}
                            className="bg-black text-white w-full py-2 rounded-md"
                        >
                            완료
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default FindAccountPage;
