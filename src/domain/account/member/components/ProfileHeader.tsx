import React, { useState } from "react";
import { Share2, UserPlus, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProfileSettingOverlay from "./ProfileSettingOverlay";

interface ProfileHeaderProps {
    member?: {
        name: string;
        nickname: string;
        profileImageUrl: string | null;
        followMemberCount: number;
        followedMemberCount: number;
    };
    onFollowClick?: () => void;
    onFollowerClick?: () => void;
    isOtherProfile?: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
    member,
    onFollowClick,
    onFollowerClick,
    isOtherProfile
}) => {
    const navigate = useNavigate();
    const [showOverlay, setShowOverlay] = useState(false);
    const profileImageSrc = member?.profileImageUrl || "/icons/user/user_4_line.svg";

    return (
        <div className="bg-white rounded-2xl shadow p-4 relative">
            {/* 닉네임 + 톱니바퀴 */}
            <div className="flex items-center justify-between mb-7">
                <div>
                    <h2 className="text-lg font-semibold ml-3">{member?.nickname ?? "사용자"}</h2>
                </div>
                <button onClick={() => setShowOverlay(true)}>
                    <Settings className="w-5 h-5 cursor-pointer" />
                </button>
            </div>

            {/* 프로필 + 팔로워/팔로잉 */}
            <div className="flex justify-around items-center mt-4">
                <img
                    src={profileImageSrc}
                    alt="프로필 이미지"
                    className="w-15 h-15 rounded-full object-cover"
                />
                <div className="text-center cursor-pointer" onClick={onFollowerClick}>
                    <p className="text-sm font-medium">팔로워</p>
                    <p className="text-sm">{member?.followMemberCount ?? 0}</p>
                </div>
                <div className="text-center cursor-pointer" onClick={onFollowClick}>
                    <p className="text-sm font-medium">팔로잉</p>
                    <p className="text-sm">{member?.followedMemberCount ?? 0}</p>
                </div>
            </div>

            {/* 하단 버튼 */}
            <div className="flex justify-around mt-4">
                {!isOtherProfile && (
                    <button
                        className="flex items-center text-sm gap-1 cursor-pointer px-2 py-1 rounded transition active:bg-gray-200"
                        onClick={() => navigate("/edit-profile")}
                    >
                        <img src="/icons/user/user_4_line.svg" className="w-4 h-4" alt="편집 아이콘" />
                        편집
                    </button>
                )}

                {isOtherProfile && (
                    <button className="flex items-center text-sm gap-1 cursor-pointer px-2 py-1 rounded transition active:bg-gray-200">
                        <UserPlus className="w-4 h-4" />
                        추가하기
                    </button>
                )}

                <button className="flex items-center text-sm gap-1 cursor-pointer px-2 py-1 rounded transition active:bg-gray-200">
                    <Share2 className="w-4 h-4" />
                    공유
                </button>
            </div>

            {/* 오버레이 분리된 컴포넌트 사용 */}
            {showOverlay && <ProfileSettingOverlay onClose={() => setShowOverlay(false)} />}
        </div>
    );
};

export default React.memo(ProfileHeader);
