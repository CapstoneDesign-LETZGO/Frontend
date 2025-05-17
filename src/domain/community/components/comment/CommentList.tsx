import React, { useState, useEffect, useRef } from 'react';
import { CommentDto } from '../../../../common/interfaces/CommunityInterface';
import CommentReplyList from './CommentReplyList';
import {formatDate} from "../../../../common/utils/formatDate.ts";

interface CommentListProps {
    comments: CommentDto[];
    postMemberId: number;
    onReplyClick: (superCommentId: number) => void;
    onLikeClick: (commentId: number) => void;
    onCancelLikeClick: (id: number) => void;
    onUpdateClick: (id: number, content: string) => void;
    onDeleteClick: (id: number) => void;
    memberId: number;
}

const CommentList: React.FC<CommentListProps> = ({
                                                     comments,
                                                     postMemberId,
                                                     onReplyClick,
                                                     onLikeClick,
                                                     onCancelLikeClick,
                                                     onDeleteClick,
                                                     memberId,
                                                 }) => {
    const [localComments, setLocalComments] = useState<CommentDto[]>(comments);
    const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
    const [repliesShownCount, setRepliesShownCount] = useState<{ [parentId: number]: number }>({});
    const menuRef = useRef<HTMLDivElement | null>(null);

    // props.comments가 바뀔 때 동기화
    useEffect(() => {
        setLocalComments(comments);
    }, [comments]);

    // 좋아요 토글 시 local state를 즉시 수정
    const handleLikeToggle = (comment: CommentDto) => {
        setLocalComments((prevComments) =>
            prevComments.map((c) =>
                c.id === comment.id
                    ? {
                        ...c,
                        liked: !c.liked,
                        likeCount: c.liked ? c.likeCount - 1 : c.likeCount + 1,
                    }
                    : c
            )
        );

        // 서버 업데이트는 기존 props 함수를 호출
        if (comment.liked) {
            onCancelLikeClick(comment.id);
        } else {
            onLikeClick(comment.id);
        }
    };

    const canEditOrDelete = (comment: CommentDto) => {
        return memberId === postMemberId || memberId === comment.memberId;
    };

    useEffect(() => {
        setLocalComments(comments);
        const initialCounts: { [parentId: number]: number } = {};
        comments.forEach((comment) => {
            if (!comment.superCommentId || comment.superCommentId === 0) {
                initialCounts[comment.id] = 0; // 부모 댓글의 초기 답글 개수는 10개
            }
        });
        setRepliesShownCount(initialCounts);
    }, [comments]);

    // 답글 더보기 클릭
    const handleShowMoreReplies = (parentId: number, totalReplies: number) => {
        setRepliesShownCount((prev) => {
            const currentShown = prev[parentId] || 0;
            const nextShown = currentShown + 10;
            return {
                ...prev,
                [parentId]: nextShown > totalReplies ? totalReplies : nextShown,
            };
        });
    };

    // 답글 간단히 클릭
    const handleCollapseReplies = (parentId: number) => {
        setRepliesShownCount((prev) => ({
            ...prev,
            [parentId]: 0,
        }));
    };

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
        <>
            {localComments
                .filter((comment) => !comment.superCommentId || comment.superCommentId === 0)
                .map((parent) => (
                    <div key={parent.id} className="p-2 text-xs relative">
                        {/* 댓글 헤더 */}
                        <div className="flex items-center mb-1">
                            <img
                                src={parent.profileImageUrl || '/icons/user/user_4_line.svg'}
                                alt="Profile"
                                className="w-6 h-6 rounded-full -ml-1 mr-2"
                            />
                            <span className="font-semibold mr-2">{parent.nickname}</span>
                            <span className="text-gray-400 text-[10px]">{formatDate(parent.createdAt)}</span>

                            {canEditOrDelete(parent) && (
                                <img
                                    src="/icons/system/more_2_line.svg"
                                    alt="More"
                                    className="w-4 h-4 ml-auto mb-1 cursor-pointer"
                                    onClick={() =>
                                        setMenuOpenId((prev) => (prev === parent.id ? null : parent.id))
                                    }
                                />
                            )}
                        </div>

                        {/* 댓글 내용 */}
                        <p className="text-xs mb-1">{parent.content}</p>

                        {/* 액션 */}
                        <div className="flex items-center space-x-4 mt-1">
                            <img
                                src={
                                    parent.liked
                                        ? '/icons/shape/heart_fill.svg'
                                        : '/icons/shape/heart_line.svg'
                                }
                                alt="Like"
                                className="w-4 h-4 cursor-pointer"
                                onClick={() => handleLikeToggle(parent)}
                            />
                            <span className="text-gray-500 text-xs">{parent.likeCount}</span>

                            <button className="text-gray-500 text-xs" onClick={() => onReplyClick(parent.id)}>
                                답글 달기
                            </button>
                        </div>

                        {/* 메뉴 */}
                        {menuOpenId === parent.id && (
                            <div
                                ref={menuRef}
                                className="absolute right-6 top-7 bg-white rounded shadow-lg p-1 space-y-1 z-10"
                            >
                                <button
                                    className="flex items-center text-xs w-full text-left p-1 hover:bg-gray-100"
                                    onClick={() => {
                                        setMenuOpenId(null);
                                        onDeleteClick(parent.id);
                                    }}
                                >
                                    <img src="/icons/system/delete_line.svg" alt="Delete" className="w-3.5 h-3.5 mr-1" />
                                    삭제
                                </button>
                            </div>
                        )}

                        {/* 답글 리스트 */}
                        <div className="ml-8 mt-2 space-y-2">
                            <CommentReplyList
                                parentId={parent.id}
                                replies={localComments.filter((reply) => reply.superCommentId === parent.id)}
                                repliesShownCount={repliesShownCount}
                                onDeleteClick={onDeleteClick}
                                canEditOrDelete={canEditOrDelete}
                                handleShowMoreReplies={handleShowMoreReplies}
                                handleCollapseReplies={handleCollapseReplies}
                                handleLikeToggle={handleLikeToggle}
                            />
                        </div>
                    </div>
                ))}
        </>
    );
};

export default CommentList;
