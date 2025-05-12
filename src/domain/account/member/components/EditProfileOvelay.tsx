import React, {useEffect, useState } from "react";
import {DetailMemberDto, MemberForm} from "../../../../common/interfaces/MemberInterface";

interface Props {
  onClose: () => void;
  onSubmit?: (form: MemberForm, imageFile: File | null) => void;
  member: DetailMemberDto;
}

const EditProfileOverlay: React.FC<Props> = ({ onClose, onSubmit, member }) => {
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
    setForm({
      name: member.name,
      nickname: member.nickname,
      phone: member.phone ?? "",
      email: member.email,
      password: "", // 비번은 보통 비워두고 새로 입력하도록
      gender: member.gender,
      birthday: member.birthday,
    });
  }, [member]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
  };

  const handleSubmit = () => {
    onSubmit?.(form, imageFile);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-80 p-6 relative">
        <h3 className="text-lg font-semibold mb-4 text-center">이름 수정</h3>
        {/** 이름 */}
        <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 w-full mb-3"
            placeholder="이름"
        />

        {/** 닉네임 */}
        <input
            type="text"
            name="nickname"
            value={form.nickname}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 w-full mb-3"
            placeholder="닉네임"
        />

        {/** 전화번호 */}
        <input
            type="tel"
            name="phone"
            value={form.phone ?? ""}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 w-full mb-3"
            placeholder="전화번호"
        />

        {/** 이메일 */}
        <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 w-full mb-3"
            placeholder="이메일"
        />

        {/** 비밀번호 */}
        <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 w-full mb-3"
            placeholder="비밀번호"
        />

        {/** 성별 */}
        <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 w-full mb-3"
        >
          <option value="MALE">남성</option>
          <option value="FEMALE">여성</option>
        </select>

        {/** 생년월일 */}
        <input
            type="date"
            name="birthday"
            value={form.birthday}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 w-full mb-3"
        />

        {/** 프로필 이미지 업로드 */}
        <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-4"
        />

        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-100 text-gray-700 px-3 py-1 rounded"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="bg-gray-800 text-white px-3 py-1 rounded"
            onClick={handleSubmit}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileOverlay;
