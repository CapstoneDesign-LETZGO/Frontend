import React from 'react';
import { CommentDto } from '../../../common/interfaces/CommunityInterface';

interface CommentListProps {
    comments: CommentDto[];
    onReplyClick: (superCommentId: number) => void;
    onLikeClick: (commentId: number) => void;
    onCancelLikeClick: (id: number) => void;
    onUpdateClick: (id: number, content: string) => void;
    onDeleteClick: (id: number) => void;
}

const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString();
};

const CommentList: React.FC<CommentListProps> = ({ comments, onReplyClick, onLikeClick }) => {
    return (
        <>
            {comments
                .filter(comment => !comment.superCommentId || comment.superCommentId === 0)
                .map((parent) => (
                    <div key={parent.id} className="p-2 border-b text-xs border-gray-300">

                        {/* 댓글 헤더 */}
                        <div className="flex items-center mb-1">
                            <img src={parent.profileImageUrl} alt="Profile" className="w-6 h-6 rounded-full mr-2" />
                            <span className="font-semibold mr-2">{parent.nickname}</span>
                            <span className="text-gray-400 text-[10px]">{formatDate(parent.createdAt)}</span>
                        </div>

                        {/* 댓글 내용 */}
                        <p className="text-sm mb-1">{parent.content}</p>

                        {/* 액션 */}
                        <div className="flex items-center space-x-4 mt-1">
                            <img
                                src="src/assets/icons/shape/heart_line.svg"
                                alt="Like"
                                className="w-4 h-4 cursor-pointer"
                                onClick={() => onLikeClick(parent.id)}
                            />
                            <span className="text-gray-500 text-xs">{parent.likeCount}</span>

                            <button className="text-gray-500 text-xs" onClick={() => onReplyClick(parent.id)}>
                                답글 달기
                            </button>
                        </div>

                        {/* 답글 */}
                        <div className="ml-8 mt-2 space-y-2">
                            {comments
                                .filter(reply => reply.superCommentId === parent.id)
                                .map((reply) => (
                                    <div key={reply.id}>
                                        <div className="flex items-center mb-1">
                                            <img src={reply.profileImageUrl} alt="Profile" className="w-5 h-5 rounded-full mr-2" />
                                            <span className="font-semibold mr-2">{reply.nickname}</span>
                                            <span className="text-gray-400 text-[10px]">{formatDate(reply.createdAt)}</span>
                                        </div>
                                        <p className="text-sm mb-1">{reply.content}</p>
                                        <div className="flex items-center space-x-4 mt-1">
                                            <img
                                                src="src/assets/icons/shape/heart_line.svg"
                                                alt="Like"
                                                className="w-4 h-4 cursor-pointer"
                                                onClick={() => onLikeClick(reply.id)}
                                            />
                                            <span className="text-gray-500 text-xs">{reply.likeCount}</span>
                                        </div>
                                    </div>
                                ))}
                        </div>

                    </div>
                ))}
        </>
    );
};

export default CommentList;
