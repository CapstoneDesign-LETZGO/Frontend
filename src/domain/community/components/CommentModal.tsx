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
    const headerRef = useRef<HTMLDivElement>(null);
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
        const header = headerRef.current;
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

        const onStart = (e: TouchEvent | MouseEvent, isHeader: boolean = false) => {
            startY = getY(e);
            if (isHeader) {
                canDrag = true; // 헤더는 항상 드래그 가능
                console.log('Dragging started on header');

            } else if (commentsRef.current) {
                canDrag = commentsRef.current.scrollTop === 0;
                console.log('Dragging started on body, canDrag:', canDrag);
            }
            isDragging = true;
            console.log('onStart:', { startY, isHeader, canDrag });
        };

        const onMove = (e: TouchEvent | MouseEvent) => {
            if (!isDragging || !canDrag) return;
            const currentY = getY(e);
            const diffY = currentY - startY;
            if (diffY > 0) {
                setTranslateY(`${diffY}px`);
                currentTranslateY = diffY;
                console.log('onMove: Dragging', { diffY, currentTranslateY });
            }
        };

        const onEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            console.log('onEnd: Drag ended, currentTranslateY:', currentTranslateY);
            if (canDrag && currentTranslateY > 100) {
                setTranslateY('100%');
                console.log('Closing modal');
                setTimeout(() => {
                    closeModal();
                }, 300);
            } else {
                setTranslateY('0%');
            }
            currentTranslateY = 0;
            canDrag = false;
        };

        // Modal Header에 대한 드래그 이벤트
        header?.addEventListener('touchstart', (e) => onStart(e, true));
        header?.addEventListener('mousedown', (e) => onStart(e, true));

        // Comments List 영역에 대한 드래그 이벤트
        modal.addEventListener('touchstart', (e) => {
            if (e.target !== header) {
                onStart(e, false);
            }
        });
        modal.addEventListener('mousedown', (e) => {
            if (e.target !== header) {
                onStart(e, false);
            }
        });

        window.addEventListener('touchmove', onMove);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('touchend', onEnd);
        window.addEventListener('mouseup', onEnd);

        return () => {
            header?.removeEventListener('touchstart', (e) => onStart(e, true));
            header?.removeEventListener('mousedown', (e) => onStart(e, true));
            modal.removeEventListener('touchstart', (e) => onStart(e));
            modal.removeEventListener('mousedown', (e) => onStart(e));
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
                        src="src/assets/icons/system/minimize_line.svg"
                        alt="Minimize"
                        className="w-16 h-5 rounded-full mb-1"
                    />
                    <h2 className="mb-2 text-sm font-semibold">댓글</h2>
                </div>

                {/* Comments List */}
                <div ref={commentsRef} className="flex-1 overflow-y-auto px-4 py-2">
                    {comments.map((comment, index) => (
                        <div key={index} className="p-2 border-b text-sm border-gray-300">
                            <p>{comment}</p>
                        </div>
                    ))}
                    {loading && (
                        <div className="text-center py-2 text-gray-500">로딩 중...</div>
                    )}
                </div>

                {/* Comment Input */}
                <div className="flex items-center p-2 border-t border-gray-300"
                     style={{ borderTop: '0.1px solid #D1D5DB' }}>
                    <img
                        src="src/assets/icons/user/user_2_line.svg"
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
