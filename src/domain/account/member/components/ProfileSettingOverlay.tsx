import React from "react";
import {useLogin} from "../../auth/hooks/useLogin.ts";

interface Props {
    onClose: () => void;
}

const ProfileSettingOverlay: React.FC<Props> = ({ onClose }) => {
    const { logout } = useLogin();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="bg-white rounded-xl w-80 p-6 shadow-lg relative">
                <h3 className="text-lg font-semibold text-center mb-4">설정</h3>

                <button
                    onClick={handleLogout}
                    className="w-full bg-gray-200 text-gray-800 rounded-lg py-3 font-semibold"
                >
                    로그아웃
                </button>

                {/* 닫기 버튼 */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-3 text-gray-400 hover:text-black text-xl"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

export default ProfileSettingOverlay;
