import React, { useState } from "react";

interface Props {
  onClose: () => void;
  onSubmit?: (newName: string) => void;
}

const EditProfileOverlay: React.FC<Props> = ({ onClose, onSubmit }) => {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    onSubmit?.(name);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-80 p-6 relative">
        <h3 className="text-lg font-semibold mb-4 text-center">이름 수정</h3>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
          placeholder="새 이름 입력"
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
