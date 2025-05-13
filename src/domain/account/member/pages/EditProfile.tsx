import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DetailMemberDto, MemberForm } from "../../../../common/interfaces/MemberInterface";
import { useMemberActions } from "../hooks/useMemberActions";

const EditProfile: React.FC = () => {
    const navigate = useNavigate();
    const { detailMemberInfo, updateMember, refetch } = useMemberActions("detailMember");

    const [form, setForm] = useState<MemberForm>({
        name: "",
        nickname: "",
        phone: "",
        email: "",
        password: "",
        gender: "MALE",
        birthday: "",
    });
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        if (detailMemberInfo) {
            setForm({
                name: detailMemberInfo.name,
                nickname: detailMemberInfo.nickname,
                phone: detailMemberInfo.phone ?? "",
                email: detailMemberInfo.email,
                password: "",
                gender: detailMemberInfo.gender,
                birthday: detailMemberInfo.birthday,
            });
        }
    }, [detailMemberInfo]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setImageFile(file);
    };

    const handleSubmit = async () => {
        await updateMember(form, imageFile);
        await refetch();
        navigate("/profile");
    };

    const inputStyle = "w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm";
    const labelStyle = "text-sm font-semibold text-gray-700 mb-1 block";

    return (
        <div className="flex flex-col min-h-screen items-center bg-[#F5F5F5]">
            <div className="flex flex-col w-full max-w-md min-h-screen relative bg-white">
                <div className="flex flex-col min-h-screen bg-gray-100">
                    {/* 상단 타이틀 */}
                    <div className="bg-white shadow p-4 text-lg font-semibold text-center">프로필 수정</div>

                    {/* 폼 본문 */}
                    <div className="flex flex-col gap-3 p-4 flex-grow">
                        {/* 프로필 이미지 업로드 */}
                        <div className="flex flex-col items-center mt-6">
                            <label className="w-28 h-28 rounded-full bg-gray-200 overflow-hidden mb-2">
                                {imageFile ? (
                                    <img src={URL.createObjectURL(imageFile)} alt="preview" className="w-full h-full object-cover" />
                                ) : (
                                    <img
                                        src={detailMemberInfo?.profileImageUrl ?? "/src/assets/icons/user/user_4_line.svg"}
                                        alt="profile"
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </label>

                            {/* 숨겨진 input */}
                            <input
                                id="fileUpload"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />

                            {/* 커스텀 업로드 버튼 */}
                            <label
                                htmlFor="fileUpload"
                                className="mt-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-300 transition"
                            >
                                프로필 이미지 변경
                            </label>

                            {/* 파일 이름 표시 */}
                            {imageFile && (
                                <p className="text-xs text-gray-500 mt-1">{imageFile.name}</p>
                            )}
                        </div>

                        {/* 입력 필드들 */}
                        <div className="mb-4">
                            <label className={labelStyle}>이름</label>
                            <input name="name" value={form.name} onChange={handleChange} className={inputStyle} />
                        </div>

                        <div className="mb-4">
                            <label className={labelStyle}>닉네임</label>
                            <input name="nickname" value={form.nickname} onChange={handleChange} className={inputStyle} />
                        </div>

                        <div className="mb-4">
                            <label className={labelStyle}>전화번호</label>
                            <input name="phone" value={form.phone || ""} onChange={handleChange} className={inputStyle} />
                        </div>

                        <div className="mb-4">
                            <label className={labelStyle}>이메일</label>
                            <input name="email" value={form.email} onChange={handleChange} className={inputStyle} />
                        </div>

                        <div className="mb-4">
                            <label className={labelStyle}>비밀번호</label>
                            <input type="password" name="password" value={form.password} onChange={handleChange} className={inputStyle} />
                        </div>

                        <div className="mb-4">
                            <label className={labelStyle}>성별</label>
                            <select name="gender" value={form.gender} onChange={handleChange} className={inputStyle}>
                                <option value="MALE">남성</option>
                                <option value="FEMALE">여성</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className={labelStyle}>생년월일</label>
                            <input type="date" name="birthday" value={form.birthday} onChange={handleChange} className={inputStyle} />
                        </div>
                    </div>

                    {/* 하단 버튼 */}
                    <div className="p-4 bg-white shadow-md sticky bottom-0 flex gap-2 pb-16">
                        <button onClick={() => navigate(-1)} className="w-full py-3 bg-gray-200 rounded text-gray-700">취소</button>
                        <button onClick={handleSubmit} className="w-full py-3 bg-gray-700 text-white font-semibold rounded">변경사항 저장</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
