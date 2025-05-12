import React, { useState, useEffect } from 'react';
import { CommentDto } from '../../../common/interfaces/CommunityInterface';
import { useMemberActions } from '../../account/member/hooks/useMemberActions';

interface CommentListProps {
    comments: CommentDto[];
    postMemberId: number;
    onReplyClick: (superCommentId: number) => void;
    onLikeClick: (commentId: number) => void;
    onCancelLikeClick: (id: number) => void;
    onUpdateClick: (id: number, content: string) => void;
    onDeleteClick: (id: number) => void;
}

const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();

    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffWeek = Math.floor(diffDay / 7);

    if (diffSec < 60) return `${diffSec}초`;
    if (diffMin < 60) return `${diffMin}분`;
    if (diffHour < 24) return `${diffHour}시간`;
    if (diffDay < 7) return `${diffDay}일`;
    return `${diffWeek}주`;
};

const CommentList: React.FC<CommentListProps> = ({
                                                     comments,
                                                     postMemberId,
                                                     onReplyClick,
                                                     onLikeClick,
                                                     onCancelLikeClick,
                                                     onUpdateClick,
                                                     onDeleteClick,
                                                 }) => {
    const [localComments, setLocalComments] = useState<CommentDto[]>(comments);
    const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
    const [repliesShownCount, setRepliesShownCount] = useState<{ [parentId: number]: number }>({});
    const { memberInfo } = useMemberActions();
    const memberId = memberInfo?.id;

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

    return (
        <>
            {localComments
                .filter((comment) => !comment.superCommentId || comment.superCommentId === 0)
                .map((parent) => (
                    <div key={parent.id} className="p-2 text-xs relative">
                        {/* 댓글 헤더 */}
                        <div className="flex items-center mb-1">
                            <img
                                src={parent.profileImageUrl || '/src/assets/icons/user/user_4_line.svg'}
                                alt="Profile"
                                className="w-6 h-6 rounded-full -ml-1 mr-2"
                            />
                            <span className="font-semibold mr-2">{parent.nickname}</span>
                            <span className="text-gray-400 text-[10px]">{formatDate(parent.createdAt)}</span>

                            {/* 토글 버튼 */}
                            {canEditOrDelete(parent) && (
                                <img
                                    src="/src/assets/icons/system/more_2_line.svg"
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
                                        ? 'src/assets/icons/shape/heart_fill.svg'
                                        : 'src/assets/icons/shape/heart_line.svg'
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

                        {/* 메뉴 (수정/삭제) */}
                        {menuOpenId === parent.id && (
                            <div className="absolute right-6 top-7 bg-white border rounded shadow p-1 space-y-1 z-10">
                                <button
                                    className="text-xs w-full text-left p-1 hover:bg-gray-100"
                                    onClick={() => {
                                        setMenuOpenId(null);
                                        onUpdateClick(parent.id, parent.content);
                                    }}
                                >
                                    수정
                                </button>
                                <button
                                    className="text-xs w-full text-left p-1 hover:bg-gray-100"
                                    onClick={() => {
                                        setMenuOpenId(null);
                                        onDeleteClick(parent.id);
                                    }}
                                >
                                    삭제
                                </button>
                            </div>
                        )}

                        {/* 답글 */}
                        <div className="ml-8 mt-2 space-y-2">
                            {(() => {
                                const replies = localComments.filter((reply) => reply.superCommentId === parent.id);
                                const shownCount = repliesShownCount[parent.id] || 0;
                                const shownReplies = replies.slice(0, shownCount);

                                return (
                                    <>
                                        {shownReplies.map((reply) => {
                                            const isMenuOpen = menuOpenId === reply.id;
                                            return (
                                                <div key={reply.id} className="relative">
                                                    <div className="flex items-center mb-1 justify-between">
                                                        <div className="flex items-center">
                                                            <img
                                                                src={reply.profileImageUrl || '/src/assets/icons/user/user_4_line.svg'}
                                                                alt="Profile"
                                                                className="w-5 h-5 rounded-full mr-2"
                                                            />
                                                            <span className="font-semibold mr-2">{reply.nickname}</span>
                                                            <span className="text-gray-400 text-[10px]">{formatDate(reply.createdAt)}</span>
                                                        </div>

                                                        {canEditOrDelete(reply) && (
                                                            <img
                                                                src="/src/assets/icons/system/more_2_line.svg"
                                                                alt="More"
                                                                className="w-4 h-4 ml-auto mb-1 cursor-pointer"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setMenuOpenId((prev) => (prev === reply.id ? null : reply.id));
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                    <p className="text-xs mb-1">{reply.content}</p>
                                                    <div className="flex items-center space-x-4 mt-1">
                                                        <img
                                                            src={
                                                                reply.liked
                                                                    ? 'src/assets/icons/shape/heart_fill.svg'
                                                                    : 'src/assets/icons/shape/heart_line.svg'
                                                            }
                                                            alt="Like"
                                                            className="w-4 h-4 cursor-pointer"
                                                            onClick={() => handleLikeToggle(reply)}
                                                        />
                                                        <span className="text-gray-500 text-xs">{reply.likeCount}</span>
                                                    </div>

                                                    {isMenuOpen && (
                                                        <div className="absolute right-4 top-5 bg-white border rounded shadow p-1 space-y-1 z-50">
                                                            <button
                                                                className="text-xs w-full text-left p-1 hover:bg-gray-100"
                                                                onClick={() => {
                                                                    setMenuOpenId(null);
                                                                    onUpdateClick(reply.id, reply.content);
                                                                }}
                                                            >
                                                                수정
                                                            </button>
                                                            <button
                                                                className="text-xs w-full text-left p-1 hover:bg-gray-100"
                                                                onClick={() => {
                                                                    setMenuOpenId(null);
                                                                    onDeleteClick(reply.id);
                                                                }}
                                                            >
                                                                삭제
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}

                                        {replies.length > 0 && (
                                            <button
                                                className="text-gray-500 text-xs mt-1"
                                                onClick={() =>
                                                    shownCount >= replies.length
                                                        ? handleCollapseReplies(parent.id)
                                                        : handleShowMoreReplies(parent.id, replies.length)
                                                }
                                            >
                                                {shownCount >= replies.length ? (
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
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                ))}
        </>
    );
};

export default CommentList;
