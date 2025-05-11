// components/CommentModal.tsx
import React from "react";
import { X } from "lucide-react";

interface CommentModalProps {
    comments: { id: number; author: string; content: string }[];
    onClose: () => void;
}

const CommentModal: React.FC<CommentModalProps> = ({ comments, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
            <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-5 max-h-[80vh] min-h-[700px] flex flex-col">
                {/* 헤더 */}
                <div className="flex justify-between items-center border-b pb-2 mb-3">
                    <h3 className="font-semibold text-lg">댓글</h3>
                    <button onClick={onClose}>
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* 댓글 리스트 */}
                <div className="flex-1 overflow-y-auto space-y-3">
                    {comments.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center mt-4">아직 댓글이 없습니다.</p>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment.id} className="text-sm">
                                <span className="font-medium mr-1">{comment.author}</span>
                                <span>{comment.content}</span>
                            </div>
                        ))
                    )}
                </div>

                {/* 입력창 */}
                <div className="mt-4 border-t pt-2">
                    <input
                        type="text"
                        placeholder="댓글을 입력하세요..."
                        className="w-full border rounded px-3 py-2 text-sm focus:outline-none"
                    />
                </div>
            </div>
        </div>
    );
};

export default CommentModal;
