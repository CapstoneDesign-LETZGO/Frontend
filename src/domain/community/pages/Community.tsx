import React, {useState, useEffect, useRef} from 'react';
import MainPostCard from '../components/MainPostCard.tsx';
import CommentModal from '../components/CommentModal';
import NavigationBar from '../../../common/components/NavigationBar.tsx';
import CommunityHeader from "../components/CommunityHeader.tsx";
import { useMainPost } from '../hooks/useMainPost.ts';

const Community: React.FC = () => {
    const [isCommentOpen, setIsCommentOpen] = useState(false);
    const [comments, setComments] = useState<string[]>([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [hasMoreOlderComments, setHasMoreOlderComments] = useState(true);
    const { posts, loading: loadingPosts, refetch } = useMainPost();
    const postSectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
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
            // 스크롤이 최상단일 때만 시작
            canDrag = postSectionRef.current?.scrollTop === 0;
            if (!canDrag) return;
            startY = getY(e);
            isDragging = true;
            console.log('onStart:', { startY, canDrag });
        };

        const onMove = (e: TouchEvent | MouseEvent) => {
            if (!isDragging || !canDrag || !postSectionRef.current) return;
            const currentY = getY(e);
            const diffY = currentY - startY;

            if (diffY > 0) {  // 아래로 당기는 중
                const limitedDiffY = Math.min(diffY, 100);
                currentTranslateY = limitedDiffY;
                postSectionRef.current.style.transform = `translateY(${currentTranslateY}px)`;
                postSectionRef.current.style.transition = 'none';
                console.log('onMove: Dragging', { diffY });
            }
        };

        const onEnd = () => {
            if (!isDragging || !postSectionRef.current) return;
            isDragging = false;
            console.log('onEnd: Drag ended, currentTranslateY:', currentTranslateY);

            // 원위치 애니메이션
            postSectionRef.current.style.transition = 'transform 0.3s ease';
            postSectionRef.current.style.transform = 'none';

            // 100px 이상 당겼을 때만 게시글 새로고침
            if (canDrag && currentTranslateY >= 100) {
                console.log('🔄 Refreshing posts');
                refetch();
            }
            currentTranslateY = 0;
            canDrag = false;
        };

        // 이벤트 등록
        const sectionEl = postSectionRef.current;
        if (sectionEl) {
            sectionEl.addEventListener('touchstart', onStart);
            sectionEl.addEventListener('mousedown', onStart);
            sectionEl.addEventListener('touchmove', onMove);
            sectionEl.addEventListener('mousemove', onMove);
        }

        // 드래그 종료는 화면 어디서든 감지
        window.addEventListener('touchend', onEnd);
        window.addEventListener('mouseup', onEnd);

        return () => {
            if (sectionEl) {
                sectionEl.removeEventListener('touchstart', onStart);
                sectionEl.removeEventListener('mousedown', onStart);
                sectionEl.removeEventListener('touchmove', onMove);
                sectionEl.removeEventListener('mousemove', onMove);
            }
            window.removeEventListener('touchend', onEnd);
            window.removeEventListener('mouseup', onEnd);
        };
    }, [refetch]);

    const loadComments = (isOlder: boolean) => {
        if (loadingComments) return;
        setLoadingComments(true);

        setTimeout(() => {
            const newComments = isOlder
                ? ['이전 댓글 1', '이전 댓글 2']
                : ['최신 댓글 1', '최신 댓글 2'];

            if (isOlder) {
                if (comments.length > 6) {
                    setHasMoreOlderComments(false);
                }
                setComments([...newComments, ...comments]);
            } else {
                setComments([...comments, ...newComments]);
            }
            setLoadingComments(false);
        }, 1000);
    };

    const openCommentModal = () => {
        setIsCommentOpen(true);
        setComments([]);
        setHasMoreOlderComments(true);
        loadComments(false);
    };

    const closeCommentModal = () => {
        setIsCommentOpen(false);
    };

    if (loadingPosts) {
        return <div className="flex justify-center items-center min-h-screen">로딩 중...</div>;
    }

    return (
        <div className="flex flex-col min-h-screen items-center bg-[#F5F5F5]">
            <div className="flex flex-col w-full max-w-md min-h-screen relative bg-[#F5F5F5]">
                {/* Header */}
                <CommunityHeader />

                {/* Main Post Cards */}
                <section
                    ref={postSectionRef}
                    className="flex-grow overflow-y-auto scrollbar-hide mt-18 mb-15"
                >
                    {/* posts가 배열일 때만 map을 사용 */}
                    {Array.isArray(posts) && posts.length > 0 ? (
                        posts.map((post) => (
                            <MainPostCard key={post.id} openCommentModal={openCommentModal} post={post} />
                        ))
                    ) : (
                        <div className="text-center">게시글이 없습니다.</div>
                    )}
                </section>

                {/* Comment Modal */}
                <CommentModal
                    isOpen={isCommentOpen}
                    closeModal={closeCommentModal}
                    comments={comments}
                    loadComments={loadComments}
                    loading={loadingComments}
                    hasMoreOlderComments={hasMoreOlderComments}
                />

                {/* NavigationBar */}
                <NavigationBar />
            </div>
        </div>
    );
};

export default Community;
