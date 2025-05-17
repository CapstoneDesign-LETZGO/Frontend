import { useEffect, useRef, useState } from 'react';

export const usePullToRefresh = (refetchCallback: () => void) => {
    const startYRef = useRef(0);
    const canDragRef = useRef(false);
    const currentTranslateYRef = useRef(0);
    const isDraggingRef = useRef(false);
    const [showSpinner, setShowSpinner] = useState(false);

    const postSectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const getY = (e: TouchEvent | MouseEvent) => {
            return 'touches' in e ? e.touches[0]?.clientY ?? 0 : e.clientY;
        };

        const isScrollAtTop = () => {
            const el = postSectionRef.current;
            return el ? el.scrollTop <= 0 : false;
        };

        const onStart = (e: TouchEvent | MouseEvent) => {
            if (!isScrollAtTop()) return;
            canDragRef.current = postSectionRef.current?.scrollTop === 0;
            if (!canDragRef.current) return;
            startYRef.current = getY(e);
            isDraggingRef.current = true;
        };

        const onMove = (e: TouchEvent | MouseEvent) => {
            if (!isDraggingRef.current || !canDragRef.current || !postSectionRef.current) return;
            if (!isScrollAtTop()) return;

            const currentY = getY(e);
            const diffY = currentY - startYRef.current;

            if (diffY > 0) {
                e.preventDefault();
                const limitedDiffY = Math.min(diffY, 100);
                currentTranslateYRef.current = limitedDiffY;
                postSectionRef.current.style.transform = `translateY(${limitedDiffY}px)`;
                postSectionRef.current.style.transition = 'none';

                setShowSpinner(limitedDiffY >= 30);
            }
        };

        const onEnd = () => {
            if (!isDraggingRef.current || !postSectionRef.current) return;
            isDraggingRef.current = false;

            postSectionRef.current.style.transition = 'transform 0.3s ease';
            postSectionRef.current.style.transform = 'none';

            if (canDragRef.current && currentTranslateYRef.current >= 100) {
                refetchCallback();
            }

            setShowSpinner(false);

            currentTranslateYRef.current = 0;
            canDragRef.current = false;
        };

        const sectionEl = postSectionRef.current;
        if (sectionEl) {
            sectionEl.addEventListener('touchstart', onStart);
            sectionEl.addEventListener('mousedown', onStart);
        }

        window.addEventListener('touchmove', onMove, { passive: false });
        window.addEventListener('mousemove', onMove);
        window.addEventListener('touchend', onEnd);
        window.addEventListener('mouseup', onEnd);
        window.addEventListener('touchcancel', onEnd);
        window.addEventListener('mouseleave', onEnd);

        return () => {
            if (sectionEl) {
                sectionEl.removeEventListener('touchstart', onStart);
                sectionEl.removeEventListener('mousedown', onStart);
            }
            window.removeEventListener('touchmove', onMove);
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('touchend', onEnd);
            window.removeEventListener('mouseup', onEnd);
            window.removeEventListener('touchcancel', onEnd);
            window.removeEventListener('mouseleave', onEnd);
        };
    }, [refetchCallback]);

    return { postSectionRef, showSpinner };
};
