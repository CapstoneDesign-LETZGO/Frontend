import React from "react";
import { Share2, UserPlus, Settings } from "lucide-react";

interface ProfileHeaderProps {
    onEditClick: () => void;
    member?: {
        name: string;
        nickname: string;
        profileImageUrl: string | null;
        followMemberCount: number;
        followedMemberCount: number;
    };
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ onEditClick, member }) => {
    const profileImageSrc = member?.profileImageUrl || "/src/assets/icons/user/user_4_line.svg";

    return (
        <div className="bg-white rounded-2xl shadow p-4 relative">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-lg font-semibold">{member?.nickname ?? "사용자"}</h2>
                </div>
                <Settings className="w-5 h-5" />
            </div>

            <div className="flex justify-around items-center mt-4">
                <img
                    src={profileImageSrc}
                    alt="프로필 이미지"
                    className="w-10 h-10 rounded-full object-cover"
                />
                <div className="text-center">
                    <p className="text-sm font-medium">팔로워</p>
                    <p className="text-sm">{member?.followMemberCount ?? 0}</p>
                </div>
                <div className="text-center">
                    <p className="text-sm font-medium">팔로잉</p>
                    <p className="text-sm">{member?.followedMemberCount ?? 0}</p>
                </div>
            </div>

            <div className="flex justify-around mt-4">
                <button
                    className="flex items-center text-sm gap-1 cursor-pointer px-2 py-1 rounded transition active:bg-gray-200"
                    onClick={onEditClick}
                >
                    <img src="/src/assets/icons/user/user_4_line.svg" className="w-4 h-4" alt="편집 아이콘" />
                    편집
                </button>
                <button className="flex items-center text-sm gap-1 cursor-pointer px-2 py-1 rounded transition active:bg-gray-200">
                    <Share2 className="w-4 h-4" />
                    공유
                </button>
                <button className="flex items-center text-sm gap-1 cursor-pointer px-2 py-1 rounded transition active:bg-gray-200">
                    <UserPlus className="w-4 h-4" />
                    추가하기
                </button>
            </div>
        </div>
    );
};

export default React.memo(ProfileHeader);
