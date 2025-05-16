import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MemberForm } from "../../../../common/interfaces/MemberInterface";
import { useMemberActions } from "../../member/hooks/useMemberActions";

const SignUp: React.FC = () => {
    const navigate = useNavigate();
    const { signup } = useMemberActions({ mode: 'none' });

    const [form, setForm] = useState<MemberForm>({
        name: "",
        nickname: "",
        phone: "",
        email: "",
        password: "",
        gender: "MALE",
        birthday: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        const success = await signup(form);
        if (success) {
            alert("회원가입이 완료되었습니다.");
            navigate("/login");
        } else {
            alert("회원가입에 실패했습니다.");
        }
    };

    const inputStyle = "w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm";
    const labelStyle = "text-sm font-semibold text-gray-700 mb-1 block";

    return (
        <div className="flex flex-col min-h-screen items-center bg-[#F5F5F5]">
            <div className="flex flex-col w-full max-w-md min-h-screen relative bg-white">
                <div className="bg-white shadow p-4 text-lg font-semibold text-center">회원가입</div>

                <div className="flex flex-col gap-3 p-4 flex-grow mt-5">
                    {[
                        { name: "name", label: "이름", type: "text" },
                        { name: "nickname", label: "닉네임", type: "text" },
                        { name: "phone", label: "전화번호", type: "text" },
                        { name: "email", label: "이메일", type: "email" },
                        { name: "password", label: "비밀번호", type: "password" },
                        { name: "birthday", label: "생년월일", type: "date" },
                    ].map(({ name, label, type }) => (
                        <div key={name} className="mb-6">
                            <label className={labelStyle}>{label}</label>
                            <input
                                type={type}
                                name={name}
                                value={form[name as keyof MemberForm] as string}
                                onChange={handleChange}
                                className={inputStyle}
                            />
                        </div>
                    ))}

                    <div className="mb-40">
                        <label className={labelStyle}>성별</label>
                        <select name="gender" value={form.gender} onChange={handleChange} className={inputStyle}>
                            <option value="MALE">남성</option>
                            <option value="FEMALE">여성</option>
                        </select>
                    </div>
                </div>

                <div className="p-4 bg-white shadow-md sticky bottom-0 flex gap-2 pb-5">
                    <button onClick={() => navigate(-1)} className="w-full py-3 bg-gray-200 rounded text-gray-700">취소</button>
                    <button onClick={handleSubmit} className="w-full py-3 bg-gray-700 text-white font-semibold rounded">가입하기</button>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
