import React, { useRef, useEffect, useState } from 'react';

interface CommentModalProps {
    isOpen: boolean;
    closeModal: () => void;
    comments: string[];
    loadComments: (isOlder: boolean) => void;
    loading: boolean;
    hasMoreOlderComments: boolean;
}

const CommentModal: React.FC<CommentModalProps> = ({
                                                       isOpen,
                                                       closeModal,
                                                       comments,
                                                       loading,
                                                   }) => {
    const commentsRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const [translateY, setTranslateY] = useState('100%');
    const [isVisible, setIsVisible] = useState(false);
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
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

    useEffect(() => {
        if (!isVisible || !modalRef.current) return;

        const modal = modalRef.current;
        let startY = 0;
        let isDragging = false;
        let canDrag = false;
        let currentTranslateY = 0;

        const getY = (e: TouchEvent | MouseEvent) => {
            if ('touches' in e) {
                return e.touches[0]?.clientY ?? 0;
            } else {
                return e.clientY;
            }
        };

        const onStart = (e: TouchEvent | MouseEvent) => {
            startY = getY(e);
            if (commentsRef.current) {
                canDrag = commentsRef.current.scrollTop === 0;
            }
            isDragging = true;
        };

        const onMove = (e: TouchEvent | MouseEvent) => {
            if (!isDragging || !canDrag) return;
            const currentY = getY(e);
            const diffY = currentY - startY;

            if (diffY > 0) {
                setTranslateY(`${diffY}px`);
                currentTranslateY = diffY;
            }
        };

        const onEnd = () => {
            if (!isDragging) return;
            isDragging = false;

            if (canDrag && currentTranslateY > 100) {
                setTranslateY('100%');
                setTimeout(() => {
                    closeModal();
                }, 300);
            } else {
                setTranslateY('0%');
            }

            currentTranslateY = 0;
            canDrag = false;
        };

        modal.addEventListener('touchstart', onStart);
        modal.addEventListener('mousedown', onStart);
        window.addEventListener('touchmove', onMove);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('touchend', onEnd);
        window.addEventListener('mouseup', onEnd);

        return () => {
            modal.removeEventListener('touchstart', onStart);
            modal.removeEventListener('mousedown', onStart);
            window.removeEventListener('touchmove', onMove);
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('touchend', onEnd);
            window.removeEventListener('mouseup', onEnd);
        };
    }, [isVisible, closeModal]);

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
        setComment(e.target.value);
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
                className="bg-white w-full h-full rounded-t-2xl flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="flex justify-center items-center py-4 border-b border-gray-300 relative cursor-pointer">
                    <h2 className="text-lg font-semibold">댓글</h2>
                </div>

                {/* Comments List */}
                <div ref={commentsRef} className="flex-1 overflow-y-auto px-4 py-2">
                    {comments.map((comment, index) => (
                        <div key={index} className="p-2 border-b border-gray-300">
                            <p>{comment}</p>
                        </div>
                    ))}
                    {loading && (
                        <div className="text-center py-2 text-gray-500">로딩 중...</div>
                    )}
                </div>

                {/* Comment Input */}
                <div className="flex items-center p-2 border-t border-gray-300">
                    <img
                        src="src/assets/icons/user/user_1_line.svg"
                        alt="User Profile"
                        className="w-8 h-8 rounded-full ml-4"
                    />
                    <input
                        type="text"
                        placeholder="댓글을 입력하세요..."
                        value={comment}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 text-sm focus:outline-none"
                    />
                    {comment && (
                        <img
                            src="src/assets/icons/arrow/arrow_up_line.svg"
                            alt="Send Comment"
                            className="w-6 h-6 mr-4 cursor-pointer"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommentModal;
