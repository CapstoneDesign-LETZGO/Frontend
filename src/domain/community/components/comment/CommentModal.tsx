import React, { useRef, useEffect, useState } from 'react';
import CommentList from './CommentList.tsx';
import {useDraggableModal} from "../../hooks/render/useDraggableModal.ts";
import {useComment} from "../../hooks/data/useComment.ts";
import { CommentDto } from '../../../../common/interfaces/CommunityInterface.ts';
import { MemberDto } from '../../../../common/interfaces/MemberInterface.ts';

interface CommentModalProps {
    isOpen: boolean;
    closeModal: () => void;
    postId: number | null;
    postMemberId: number | null;
    member: MemberDto | null;
}

const CommentModal: React.FC<CommentModalProps> = ({isOpen, closeModal, postId, postMemberId, member}) => {
    const commentsRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const [translateY, setTranslateY] = useState('100%');
    const [isVisible, setIsVisible] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_comment, setComment] = useState<CommentDto[]>([]);
    const [commentInput, setCommentInput] = useState<string>('');
    const [superCommentId, setSuperCommentId] = useState<number | null>(null); // 댓글 or 답글 구분
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const { comments, addComment, updateComment, deleteComment, likeComment, cancelLikeComment, refetchComment } = useComment(postId || 0);
    const inputRef = useRef<HTMLInputElement>(null);

    const fetchAndSetComments = async () => {
        const { data } = await refetchComment();  // 최신 데이터 바로 가져옴
        if (data) {
            setComment(data);  // 바로 최신 데이터로 갱신
        }
    };

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            fetchAndSetComments();
        } else {
            setTranslateY('100%');
            setTimeout(() => {
                setIsVisible(false);
            }, 300);
        }
    }, [isOpen]);

    useEffect(() => {
        if (isVisible) {
            requestAnimationFrame(() => {
                setTranslateY('0%');
            });
        }
    }, [isVisible]);

    useDraggableModal({
        isVisible,
        modalRef,
        headerRef,
        commentsRef,
        closeModal,
        setTranslateY,
    });

    useEffect(() => {
        if (isVisible) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isVisible]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCommentInput(e.target.value);
    };

    const handleSubmit = async () => {
        if (editingCommentId !== null) {
            // 댓글 수정
            await updateComment(editingCommentId, commentInput);
            setEditingCommentId(null); // 수정 모드 해제
            await fetchAndSetComments();
        } else if (superCommentId !== null && superCommentId !== 0) {
            // 답글 작성 (superCommentId가 1 이상일 때만 답글로 취급)
            await addComment(postId ?? 0, commentInput, superCommentId);
            await fetchAndSetComments();
        } else {
            // 일반 댓글 작성
            await addComment(postId ?? 0, commentInput, 0);
            await fetchAndSetComments();
        }
        setCommentInput(''); // 입력창 비우기
        setSuperCommentId(null); // 답글 모드 해제
    };

    const handleReplyClick = (id: number) => {
        setSuperCommentId(id);  // 해당 댓글의 superCommentId 설정
        inputRef.current?.focus(); // 입력창 포커스 이동
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-end z-50">
            <div
                ref={modalRef}
                style={{
                    transform: `translateY(${translateY})`,
                    transition: 'transform 0.3s ease-in-out',
                }}
                className="bg-white w-full max-w-md h-full rounded-t-2xl flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div
                    ref={headerRef}
                    className="flex flex-col items-center py-0.5 border-b border-gray-300 relative cursor-pointer"
                    style={{ borderBottom: '0.1px solid #D1D5DB' }}
                >
                    {/* Drag Handle Bar */}
                    <img
                        src="/icons/system/minimize_line.svg"
                        alt="Minimize"
                        className="w-16 h-5 rounded-full mb-1"
                    />
                    <h2 className="mb-2 text-xs font-semibold">댓글</h2>
                </div>

                {/* Comments List */}
                <div ref={commentsRef} className="flex-1 overflow-y-auto px-4 py-2">
                    <CommentList
                        comments={comments}
                        postMemberId={postMemberId!}
                        onReplyClick={handleReplyClick}
                        onLikeClick={(id) => likeComment(id)}
                        onCancelLikeClick={(id) => cancelLikeComment(id)}
                        onUpdateClick={(id, content) => {
                            setEditingCommentId(id);  // 수정할 댓글 ID 저장
                            setCommentInput(content);      // 입력창에 기존 댓글 내용 채우기
                            inputRef.current?.focus(); // 입력창 포커스
                        }}
                        onDeleteClick={async (id) => {
                            if (window.confirm('댓글을 삭제하시겠습니까?')) {
                                await deleteComment(id);
                                await fetchAndSetComments();
                            }
                        }}
                        memberId={member?.id ?? 0}
                    />
                </div>

                {/* Comment Input */}
                <div className="flex items-center p-2 border-t border-gray-300"
                     style={{ borderTop: '0.1px solid #D1D5DB' }}>

                    {/* Profile Image */}
                    <img
                        src={member?.profileImageUrl || "/icons/user/user_4_line.svg"}
                        alt="User Profile"
                        className="w-8 h-8 rounded-full ml-2 object-cover flex-shrink-0"
                    />

                    {/* Input Field */}
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="댓글을 입력하세요..."
                        value={commentInput}
                        onChange={handleInputChange}
                        className="flex-grow px-4 py-2 text-xs focus:outline-none mx-2"
                    />

                    {/* Send Button (conditionally rendered) */}
                    {commentInput.trim() && (
                        <img
                            src="/icons/arrow/arrow_up_line.svg"
                            alt="Send Comment"
                            className="w-6 h-6 mr-2 cursor-pointer flex-shrink-0"
                            onClick={handleSubmit}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommentModal;
