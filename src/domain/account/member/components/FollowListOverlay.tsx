import React from 'react';
import { X } from "lucide-react";
import { SimpleMember } from "../../../../common/interfaces/MemberInterface";

interface FollowListOverlayProps {
    type: "팔로워" | "팔로우";
    members: SimpleMember[];
    onClose: () => void;
    onMemberClick: (memberId: number) => void;
}

const FollowListOverlay: React.FC<FollowListOverlayProps> = ({
    type,
    members,
    onClose,
    onMemberClick
}) => {
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

                {/* 멤버 목록 */}
                <div className="flex-1 overflow-y-auto">
                    {members.map((member) => (
                        <div
                            key={member.userId}
                            className="w-full p-3 bg-white text-sm relative flex items-start justify-between hover:bg-gray-50 cursor-pointer"
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
