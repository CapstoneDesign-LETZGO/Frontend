import React, { useState } from "react";
import { MemberForm } from "../../../../common/interfaces/MemberInterface";

interface Props {
  onClose: () => void;
  onSubmit?: (form: MemberForm, imageFile: File | null) => void;
  initialValue?: MemberForm;
}

const EditProfileOverlay: React.FC<Props> = ({ onClose, onSubmit, initialValue }) => {
  const [form, setForm] = useState<MemberForm>(
    initialValue ?? {
      name: "",
      nickname: "",
      phone: "",
      email: "",
      password: "",
      gender: "MALE",
      birthday: "",
    }
  );

  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  };

  const handleSubmit = () => {
    onSubmit?.(form, imageFile);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-[420px] p-6 relative max-h-[95vh] overflow-y-auto text-base">
        <h3 className="text-xl font-semibold mb-4 text-center">회원정보 수정</h3>

        <div className="space-y-3">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="이름"
            className="w-full px-3 py-2 border border-gray-300 rounded placeholder-gray-400"
          />
          <input
            name="nickname"
            value={form.nickname}
            onChange={handleChange}
            placeholder="닉네임"
            className="w-full px-3 py-2 border border-gray-300 rounded placeholder-gray-400"
          />
          <input
            name="phone"
            value={form.phone ?? ""}
            onChange={handleChange}
            placeholder="전화번호"
            className="w-full px-3 py-2 border border-gray-300 rounded placeholder-gray-400"
          />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="이메일"
            className="w-full px-3 py-2 border border-gray-300 rounded placeholder-gray-400"
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="비밀번호"
            className="w-full px-3 py-2 border border-gray-300 rounded placeholder-gray-400"
          />
          <input
            name="birthday"
            value={form.birthday}
            onChange={handleChange}
            placeholder="생일 (YYYY-MM-DD)"
            className="w-full px-3 py-2 border border-gray-300 rounded placeholder-gray-400"
          />
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded text-gray-700"
          >
            <option value="MALE">남성</option>
            <option value="FEMALE">여성</option>
          </select>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">프로필 이미지</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="bg-gray-800 text-white px-4 py-2 rounded"
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
