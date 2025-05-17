import React, { useState, useEffect } from 'react';
import { X } from "lucide-react";
import { SimpleMember } from "../../../../common/interfaces/MemberInterface";
import { useMemberActions } from "../hooks/useMemberActions";

interface FollowListOverlayProps {
    type: "팔로워" | "팔로우";
    members: SimpleMember[];
    onClose: () => void;
    onMemberClick: (memberId: number) => void;
    followRecList?: SimpleMember[];
    isOwnProfile?: boolean;
}

const FollowListOverlay: React.FC<FollowListOverlayProps> = ({
    type,
    members,
    onClose,
    onMemberClick,
    followRecList = [],
    isOwnProfile
}) => {
    const { acceptFollowRequest, rejectFollowRequest } = useMemberActions();
    const [localFollowRecList, setLocalFollowRecList] = useState<SimpleMember[]>([]);

    useEffect(() => {
        setLocalFollowRecList(followRecList);
    }, [followRecList]);

    const handleAccept = async (id: number) => {
        const success = await acceptFollowRequest(id);
        if (success) {
            setLocalFollowRecList(prev => prev.filter(m => m.userId !== id));
        }
    };

    const handleReject = async (id: number) => {
        const success = await rejectFollowRequest(id);
        if (success) {
            setLocalFollowRecList(prev => prev.filter(m => m.userId !== id));
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-white flex justify-center items-stretch">
            <div className="w-full max-w-md h-screen shadow-xl flex flex-col">
                {/* 헤더 */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold">{type} 목록</h2>
                    <button onClick={onClose}>
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {/* 받은 팔로우 요청 */}
                    {type === "팔로워" && isOwnProfile && localFollowRecList.length > 0 && (
                        <div className="bg-gray-50 px-4 py-2 text-sm text-gray-700 font-semibold">
                            받은 팔로우 요청
                        </div>
                    )}
                    {type === "팔로워" && isOwnProfile && localFollowRecList.map((member) => (
                        <div
                            key={`followReq-${member.userId}`}
                            className="w-full p-3 bg-white text-sm relative flex items-start justify-between hover:bg-gray-50"
                        >
                            <div
                                className="flex items-start"
                                onClick={() => onMemberClick(member.userId)}
                            >
                                <img
                                    src={member.profileImageUrl || '/src/assets/icons/user/user_4_line.svg'}
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full mr-3 ml-1 mt-[2px]"
                                />
                                <div className="flex flex-col">
                                    <span className="font-semibold text-xs mb-[2px]">{member.userName}</span>
                                    <span className="text-xs text-gray-500">{member.userNickname}</span>
                                </div>
                            </div>

                            <div className="flex gap-2 items-center mt-1">
                                <button
                                    className="text-xs text-blue-600 border border-blue-600 px-2 py-1 rounded hover:bg-blue-200 transition"
                                    onClick={() => handleAccept(member.userId)}
                                >
                                    수락
                                </button>
                                <button
                                    className="text-xs text-red-500 border border-red-500 px-2 py-1 rounded hover:bg-red-200 transition"
                                    onClick={() => handleReject(member.userId)}
                                >
                                    거절
                                </button>

                            </div>
                        </div>
                    ))}

                    {/* 일반 목록 */}
                    {members.length > 0 && (
                        <div className="bg-gray-50 px-4 py-2 text-sm text-gray-700 font-semibold">
                            {type} 목록
                        </div>
                    )}
                    {members.map((member) => (
                        <div
                            key={`member-${member.userId}`}
                            className="w-full p-3 bg-white text-sm relative flex items-start justify-between hover:bg-gray-50"
                            onClick={() => onMemberClick(member.userId)}
                        >
                            <div className="flex items-start">
                                <img
                                    src={member.profileImageUrl || '/icons/user/user_4_line.svg'}
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full mr-3 ml-1 mt-[2px]"
                                />
                                <div className="flex flex-col">
                                    <span className="font-semibold text-xs mb-[2px]">{member.userName}</span>
                                    <span className="text-xs text-gray-500">{member.userNickname}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FollowListOverlay;
