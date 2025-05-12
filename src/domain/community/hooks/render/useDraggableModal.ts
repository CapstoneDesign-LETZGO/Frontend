import { useEffect, useRef } from 'react';

export const useDraggableModal = ({
                                      isVisible,
                                      modalRef,
                                      headerRef,
                                      commentsRef,
                                      closeModal,
                                      setTranslateY,
                                  }: {
    isVisible: boolean;
    modalRef: React.RefObject<HTMLDivElement | null>;
    headerRef: React.RefObject<HTMLDivElement | null>;
    commentsRef: React.RefObject<HTMLDivElement | null>;
    closeModal: () => void;
    setTranslateY: (y: string) => void;
}) => {
    const startYRef = useRef(0);
    const canDragRef = useRef(false);
    const currentTranslateYRef = useRef(0);
    const isDraggingRef = useRef(false);

    useEffect(() => {
        if (!isVisible || !modalRef.current) return;

        const modal = modalRef.current;
        const header = headerRef.current;
        const commentsSection = commentsRef.current;

        const getY = (e: TouchEvent | MouseEvent) =>
            'touches' in e ? e.touches[0]?.clientY ?? 0 : e.clientY;

        const onStart = (e: TouchEvent | MouseEvent, isHeader = false) => {
            startYRef.current = getY(e);
            if (isHeader) {
                canDragRef.current = true;
            } else if (commentsSection?.scrollTop === 0) {
                canDragRef.current = true;
            } else {
                canDragRef.current = false;
            }
            isDraggingRef.current = true;
        };

        const onMove = (e: TouchEvent | MouseEvent) => {
            if (!isDraggingRef.current || !canDragRef.current) return;

            const currentY = getY(e);
            const diffY = currentY - startYRef.current;

            if (diffY > 0) {
                currentTranslateYRef.current = diffY;
                setTranslateY(`${diffY}px`);
            }
        };

        const onEnd = () => {
            if (!isDraggingRef.current) return;
            isDraggingRef.current = false;

            if (canDragRef.current && currentTranslateYRef.current > 100) {
                setTranslateY('100%');
                setTimeout(() => {
                    closeModal();
                }, 300);
            } else {
                setTranslateY('0%');
            }

            currentTranslateYRef.current = 0;
            canDragRef.current = false;
        };

        header?.addEventListener('touchstart', (e) => onStart(e, true));
        header?.addEventListener('mousedown', (e) => onStart(e, true));

        modal.addEventListener('touchstart', (e) => {
            if (e.target !== header) onStart(e, false);
        });
        modal.addEventListener('mousedown', (e) => {
            if (e.target !== header) onStart(e, false);
        });

        window.addEventListener('touchmove', onMove, { passive: false });
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
};
