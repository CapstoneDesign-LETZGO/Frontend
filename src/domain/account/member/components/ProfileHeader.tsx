import React, { useEffect, useState } from "react";
import { Share2, UserPlus, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProfileSettingOverlay from "./ProfileSettingOverlay";
import { useMemberActions } from "../hooks/useMemberActions";
import { toast } from "react-toastify";

interface SimpleMember {
    userId: number;
    userName: string;
    userNickname: string;
    profileImageUrl: string | null;
}

interface ProfileHeaderProps {
    member?: {
        id: number;
        name: string;
        nickname: string;
        profileImageUrl: string | null;
        followMemberCount: number;
        followedMemberCount: number;
    };
    onFollowClick?: () => void;
    onFollowerClick?: () => void;
    isOtherProfile?: boolean;
    currentUserFollowList?: number[];
    followReqList?: SimpleMember[];
    hasFollowRequest?: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
    member,
    onFollowClick,
    onFollowerClick,
    isOtherProfile,
    currentUserFollowList,
    followReqList,
    hasFollowRequest
}) => {
    const navigate = useNavigate();
    const [showOverlay, setShowOverlay] = useState(false);
    const { followRequest, followRequestCancel, cancelFollow } = useMemberActions();
    const profileImageSrc = member?.profileImageUrl || "/src/assets/icons/user/user_4_line.svg";

    const isFollowing = currentUserFollowList?.includes(member?.id ?? -1);

    const [isRequesting, setIsRequesting] = useState<boolean>(false);

    useEffect(() => {
        const initiallyRequesting = followReqList?.some((m) => m.userId === member?.id) ?? false;
        setIsRequesting(initiallyRequesting);
    }, [followReqList, member?.id]);

    const handleFollowRequest = async () => {
        if (!member) return;
        const success = await followRequest(member.id);
        if (success) {
            toast.success("팔로우 요청을 보냈습니다.");
            setIsRequesting(true);
        } else {
            toast.error("팔로우 요청에 실패했습니다.");
        }
    };

    const handleFollowCancel = async () => {
        if (!member) return;
        const success = await followRequestCancel(member.id);
        if (success) {
            toast.success("팔로우 요청을 취소했습니다.");
            setIsRequesting(false);
        } else {
            toast.error("요청 취소에 실패했습니다.");
        }
    };

    const handleCancelFollow = async () => {
        if (!member) return;
        const success = await cancelFollow(member.id);
        if (success) {
            toast.success("팔로우를 취소했습니다.");
        } else {
            toast.error("팔로우 취소에 실패했습니다.");
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow p-4 relative">
            {/* 닉네임 + 톱니바퀴 */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-lg font-semibold">{member?.nickname ?? "사용자"}</h2>
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
                    className="w-10 h-10 rounded-full object-cover"
                />
                <div className="text-center cursor-pointer relative" onClick={onFollowerClick}>
                    <p className="text-sm font-medium">팔로워</p>
                    <p className="text-sm">{member?.followedMemberCount ?? 0}</p>
                    {hasFollowRequest && !isOtherProfile && (
                        <span className="absolute top-0 left-11 w-2 h-2 bg-red-500 rounded-full" />
                    )}
                </div>
                <div className="text-center cursor-pointer" onClick={onFollowClick}>
                    <p className="text-sm font-medium">팔로잉</p>
                    <p className="text-sm">{member?.followMemberCount ?? 0}</p>
                </div>
            </div>

            {/* 하단 버튼 */}
            <div className="flex justify-around mt-4">
                {!isOtherProfile && (
                    <button
                        className="flex items-center text-sm gap-1 cursor-pointer px-2 py-1 rounded transition active:bg-gray-200"
                        onClick={() => navigate("/edit-profile")}
                    >
                        <img src="/src/assets/icons/user/user_4_line.svg" className="w-4 h-4" alt="편집 아이콘" />
                        편집
                    </button>
                )}

                {isOtherProfile && (
                    isFollowing ? (
                        <button
                            className="flex items-center text-sm gap-1 cursor-pointer px-2 py-1 rounded transition hover:bg-gray-200"
                            onClick={handleCancelFollow}
                        >
                            <UserPlus className="w-4 h-4" />
                            팔로우 취소
                        </button>
                    ) : isRequesting ? (
                        <button
                            className="flex items-center text-sm gap-1 cursor-pointer px-2 py-1 rounded transition hover:bg-gray-200"
                            onClick={handleFollowCancel}
                        >
                            <UserPlus className="w-4 h-4" />
                            팔로우 요청 취소
                        </button>
                    ) : (
                        <button
                            className="flex items-center text-sm gap-1 cursor-pointer px-2 py-1 rounded transition hover:bg-gray-200"
                            onClick={handleFollowRequest}
                        >
                            <UserPlus className="w-4 h-4" />
                            팔로우
                        </button>
                    )
                )}

                <button className="flex items-center text-sm gap-1 cursor-pointer px-2 py-1 rounded transition active:bg-gray-200">
                    <Share2 className="w-4 h-4" />
                    공유
                </button>
            </div>

            {showOverlay && <ProfileSettingOverlay onClose={() => setShowOverlay(false)} />}
        </div>
    );
};

export default React.memo(ProfileHeader);
