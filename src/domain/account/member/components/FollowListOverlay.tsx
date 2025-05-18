import React, { useState, useEffect } from 'react';
import { X } from "lucide-react";
import { SimpleMember } from "../../../../common/interfaces/MemberInterface";
import { useMemberFollow } from "../hooks/useMemberFollow";
import { useMemberActions } from "../hooks/useMemberActions";

interface FollowListOverlayProps {
    type: "팔로워" | "팔로우";
    members: SimpleMember[];
    onClose: () => void;
    onMemberClick: (memberId: number) => void;
    followRecList?: SimpleMember[];
    isOwnProfile?: boolean;
    refetchMember: () => void;
    followList: SimpleMember[];
    followedList: SimpleMember[];
}

const FollowListOverlay: React.FC<FollowListOverlayProps> = ({
    onClose,
    onMemberClick,
    followRecList = [],
    isOwnProfile,
    refetchMember,
    followList,
    followedList
}) => {
    const { acceptFollowRequest, rejectFollowRequest } = useMemberFollow();
    const { searchMember } = useMemberActions();
    const [localFollowRecList, setLocalFollowRecList] = useState<SimpleMember[]>([]);
    const [activeTab, setActiveTab] = useState<"팔로워" | "팔로우" | "검색">("팔로워");
    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const [searchResults, setSearchResults] = useState<SimpleMember[]>([]);

    useEffect(() => {
        setLocalFollowRecList(followRecList);
    }, [followRecList]);

    const handleAccept = async (id: number) => {
        const success = await acceptFollowRequest(id);
        if (success) {
            setLocalFollowRecList(prev => prev.filter(m => m.userId !== id));
            refetchMember();
        }
    };

    const handleReject = async (id: number) => {
        const success = await rejectFollowRequest(id);
        if (success) {
            setLocalFollowRecList(prev => prev.filter(m => m.userId !== id));
            refetchMember();
        }
    };

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const keyword = e.target.value;
        setSearchKeyword(keyword);

        if (keyword.trim()) {
            const results = await searchMember(keyword.trim());

            if (results) {
                const simpleResults = results.map((m) => ({
                    userId: m.id,
                    userName: m.name,
                    userNickname: m.nickname,
                    profileImageUrl: m.profileImageUrl ?? null,
                }));
                setSearchResults(simpleResults);
            } else {
                setSearchResults([]);
            }
        } else {
            setSearchResults([]);
        }
    };

    const displayedMembers =
        activeTab === "팔로워"
            ? followedList
            : activeTab === "팔로우"
                ? followList
                : searchResults;

    return (
        <div className="fixed inset-0 z-50 bg-white flex justify-center items-stretch">
            <div className="w-full max-w-md h-screen shadow-xl flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold">팔로우</h2>
                    <button onClick={onClose}>
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="flex justify-center border-b border-gray-200">
                    {["팔로워", "팔로우", "검색"].map(tab => (
                        <button
                            key={tab}
                            className={`w-1/3 py-2 text-sm font-medium ${activeTab === tab ? "border-b-2 border-black" : "text-gray-400"
                                }`}
                            onClick={() => setActiveTab(tab as any)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {activeTab === "검색" && (
                    <div className="p-3">
                        <input
                            type="text"
                            value={searchKeyword}
                            onChange={handleSearch}
                            placeholder="사용자 검색..."
                            className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300"
                        />
                    </div>
                )}

                <div className="flex-1 overflow-y-auto">
                    {activeTab === "팔로워" && isOwnProfile && localFollowRecList.length > 0 && (
                        <>
                            <div className="bg-gray-50 px-4 py-2 text-sm text-gray-700 font-semibold">
                                받은 팔로우 요청
                            </div>
                            {localFollowRecList.map((member) => (
                                <div
                                    key={`followReq-${member.userId}`}
                                    className="w-full p-3 bg-white text-sm relative flex items-start justify-between hover:bg-gray-50"
                                >
                                    <div
                                        className="flex items-start"
                                        onClick={() => onMemberClick(member.userId)}
                                    >
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
                        </>
                    )}

                    {displayedMembers.length > 0 && (
                        <div className="bg-gray-50 px-4 py-2 text-sm text-gray-700 font-semibold">
                            {activeTab} 목록
                        </div>
                    )}
                    {displayedMembers.map((member) => (
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