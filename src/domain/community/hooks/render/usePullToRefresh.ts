import { useEffect, useRef, useState } from 'react';

export const usePullToRefresh = (refetchCallback: () => void) => {
    const startYRef = useRef(0);
    const canDragRef = useRef(false);
    const currentTranslateYRef = useRef(0);
    const isDraggingRef = useRef(false);
    const [showSpinner, setShowSpinner] = useState(false);

    const postSectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const getY = (e: TouchEvent | MouseEvent) =>
            'touches' in e ? e.touches[0]?.clientY ?? 0 : e.clientY;

        const isScrollAtTop = () => {
            const el = postSectionRef.current;
            return el?.scrollTop === 0;
        };

        const onStart = (e: TouchEvent | MouseEvent) => {
            if (!isScrollAtTop()) return;

            const y = getY(e);
            startYRef.current = y;
            canDragRef.current = true;
            isDraggingRef.current = true;
        };

        const onMove = (e: TouchEvent | MouseEvent) => {
            if (!isDraggingRef.current || !canDragRef.current || !postSectionRef.current) return;

            const currentY = getY(e);
            const diffY = currentY - startYRef.current;

            if (diffY > 0 && isScrollAtTop()) {
                // 오직 최상단에서 아래로 당길 때만
                if ('touches' in e && e.cancelable) {
                    e.preventDefault(); // 이 조건 없으면 iOS에서 scroll 막힘
                }
                const limitedDiffY = Math.min(diffY, 100);
                currentTranslateYRef.current = limitedDiffY;

                const el = postSectionRef.current;
                el.style.transform = `translateY(${limitedDiffY}px)`;
                el.style.transition = 'none';

                setShowSpinner(limitedDiffY >= 30);
            }
        };

        const onEnd = () => {
            const el = postSectionRef.current;
            if (!isDraggingRef.current || !el) return;

            isDraggingRef.current = false;
            canDragRef.current = false;

            el.style.transition = 'transform 0.3s ease';
            el.style.transform = 'none';

            if (currentTranslateYRef.current >= 100) {
                refetchCallback();
            }

            setShowSpinner(false);
            currentTranslateYRef.current = 0;
        };

        const el = postSectionRef.current;

        el?.addEventListener('touchstart', onStart, { passive: true });
        el?.addEventListener('mousedown', onStart);

        window.addEventListener('touchmove', onMove, { passive: false });
        window.addEventListener('mousemove', onMove);
        window.addEventListener('touchend', onEnd);
        window.addEventListener('mouseup', onEnd);
        window.addEventListener('touchcancel', onEnd);
        window.addEventListener('mouseleave', onEnd);

        return () => {
            el?.removeEventListener('touchstart', onStart);
            el?.removeEventListener('mousedown', onStart);

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
