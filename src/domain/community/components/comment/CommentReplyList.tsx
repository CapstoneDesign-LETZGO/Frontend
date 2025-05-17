import React, { useState, useEffect, useRef } from 'react';
import { CommentDto } from '../../../../common/interfaces/CommunityInterface';
import {formatDate} from "../../../../common/utils/formatDate.ts";

interface CommentReplyListProps {
    parentId: number;
    replies: CommentDto[];
    repliesShownCount: { [parentId: number]: number };
    onDeleteClick: (id: number) => void;
    canEditOrDelete: (comment: CommentDto) => boolean;
    handleShowMoreReplies: (parentId: number, totalReplies: number) => void;
    handleCollapseReplies: (parentId: number) => void;
    handleLikeToggle: (comment: CommentDto) => void;
}

const CommentReplyList: React.FC<CommentReplyListProps> = ({
                                                               parentId,
                                                               replies,
                                                               repliesShownCount,
                                                               onDeleteClick,
                                                               canEditOrDelete,
                                                               handleShowMoreReplies,
                                                               handleCollapseReplies,
                                                               handleLikeToggle
                                                           }) => {
    const menuRef = useRef<HTMLDivElement | null>(null);
    const [menuOpenId, setMenuOpenId] = useState<number | null>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent | TouchEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpenId(null);
            }
        };

        if (menuOpenId !== null) {
            document.addEventListener('pointerdown', handleClickOutside);
        } else {
            document.removeEventListener('pointerdown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('pointerdown', handleClickOutside);
        };
    }, [menuOpenId]);

    return (
        <div className="ml-8 mt-2 space-y-2">
            {replies.slice(0, repliesShownCount[parentId] || 0).map((reply) => {
                const isMenuOpen = menuOpenId === reply.id;
                return (
                    <div key={reply.id} className="relative">
                        {/* 답글 헤더 */}
                        <div className="flex items-center mb-1 justify-between">
                            <div className="flex items-center">
                                <img
                                    src={reply.profileImageUrl || '/icons/user/user_4_line.svg'}
                                    alt="Profile"
                                    className="w-5 h-5 rounded-full mr-2"
                                />
                                <span className="font-semibold mr-2">{reply.nickname}</span>
                                <span className="text-gray-400 text-[10px]">{formatDate(reply.createdAt)}</span>
                            </div>

                            {canEditOrDelete(reply) && (
                                <img
                                    src="/icons/system/more_2_line.svg"
                                    alt="More"
                                    className="w-4 h-4 ml-auto mb-1 cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setMenuOpenId((prev) => (prev === reply.id ? null : reply.id));
                                    }}
                                />
                            )}
                        </div>

                        {/* 답글 내용 */}
                        <p className="text-xs mb-1">{reply.content}</p>

                        {/* 액션 */}
                        <div className="flex items-center space-x-4 mt-1">
                            <img
                                src={
                                    reply.liked
                                        ? '/icons/shape/heart_fill.svg'
                                        : '/icons/shape/heart_line.svg'
                                }
                                alt="Like"
                                className="w-4 h-4 cursor-pointer"
                                onClick={() => handleLikeToggle(reply)}
                            />
                            <span className="text-gray-500 text-xs">{reply.likeCount}</span>
                        </div>

                        {/* 메뉴 */}
                        {isMenuOpen && (
                            <div
                                ref={menuRef}
                                className="absolute right-4 top-5 bg-white rounded shadow-lg p-1 space-y-1 z-50"
                            >
                                <button
                                    className="flex items-center text-xs w-full text-left p-1 hover:bg-gray-100"
                                    onClick={() => {
                                        setMenuOpenId(null);
                                        onDeleteClick(reply.id);
                                    }}
                                >
                                    <img src="/icons/system/delete_line.svg" alt="Delete" className="w-3.5 h-3.5 mr-1" />
                                    삭제
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}

            {/* 답글 더보기/간단히 */}
            {replies.length > 0 && (
                <button
                    className="text-gray-500 text-xs mt-1"
                    onClick={() =>
                        repliesShownCount[parentId] >= replies.length
                            ? handleCollapseReplies(parentId)
                            : handleShowMoreReplies(parentId, replies.length)
                    }
                >
                    {repliesShownCount[parentId] >= replies.length ? (
                        <div className="flex items-center text-xs text-gray-500 justify-start">
                            <div className="border-t border-gray-300 w-[30px] mr-2"></div> {/* 왼쪽에 30px 길이의 가로선 */}
                            <span>간단히</span>
                        </div>
                    ) : (
                        <div className="flex items-center text-xs text-gray-500 justify-start">
                            <div className="border-t border-gray-300 w-[30px] mr-2"></div> {/* 왼쪽에 30px 길이의 가로선 */}
                            <span>더보기</span>
                        </div>
                    )}
                </button>
            )}
        </div>
    );
};

export default CommentReplyList;
