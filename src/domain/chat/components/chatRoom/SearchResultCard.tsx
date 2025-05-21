import React from 'react';
import { MemberDto } from "../../../../common/interfaces/MemberInterface.ts";

interface SearchResultCardProps {
    results: MemberDto[];
    selectedMemberIds: number[];
    onToggleMember: (memberId: number) => void;
    onMemberClick: (memberId: number) => void;
    showCheckboxes: boolean;
}

const SearchResultCard: React.FC<SearchResultCardProps> = ({
                                                               results,
                                                               selectedMemberIds,
                                                               onToggleMember,
                                                               onMemberClick,
                                                               showCheckboxes
    }) => {
    return (
        <div>
            {results.map((member) => {
                const isChecked = selectedMemberIds.includes(member.id);
                return (
                    <div
                        key={member.id}
                        className="w-full p-3 bg-white text-sm relative flex items-start justify-between"
                    >
                        <div
                            className="flex items-start cursor-pointer"
                            onClick={() => {
                                if (showCheckboxes) return; // 체크박스 상태일 땐 클릭 무효화
                                onMemberClick(member.id);   // 기본 상태에서만 채팅방 생성
                            }}
                        >
                            <img
                                src={member.profileImageUrl || '/icons/user/user_4_line.svg'}
                                alt="Profile"
                                className="w-8 h-8 rounded-full mr-3 ml-1 mt-[2px]"
                            />
                            <div className="flex flex-col">
                                <span className="font-semibold text-xs mb-[2px]">{member.name}</span>
                                <span className="text-xs text-gray-500">{member.nickname}</span>
                            </div>
                        </div>
                        {showCheckboxes && (
                            <input
                                type="checkbox"
                                className="mt-2 mr-2"
                                checked={isChecked}
                                onChange={(e) => {
                                    e.stopPropagation(); // 카드 클릭과 이벤트 분리
                                    onToggleMember(member.id);
                                }}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default SearchResultCard;
