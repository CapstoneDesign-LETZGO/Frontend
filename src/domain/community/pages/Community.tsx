import React, { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
import CommentModal from '../components/CommentModal';
import CommunityHeader from '../../../common/components/CommunityHeader';
import NavigationBar from '../../../common/components/NavigationBar.tsx';
import { useUserInfo } from '../../../common/hooks/useUserInfo';

const Community: React.FC = () => {
    const [isCommentOpen, setIsCommentOpen] = useState(false);
    const [comments, setComments] = useState<string[]>([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [hasMoreOlderComments, setHasMoreOlderComments] = useState(true);
    const { userInfo, loading: loadingUserInfo, error: userInfoError } = useUserInfo();

    // useEffect를 사용하여 한 번만 사용자 정보를 가져오도록 변경
    useEffect(() => {
    }, [userInfo]); // userInfo가 변경되면 한 번만 실행

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

    if (loadingUserInfo) {
        return <div className="flex justify-center items-center min-h-screen">로딩 중...</div>;
    }

    if (userInfoError) {
        return <div className="flex justify-center items-center min-h-screen text-red-500">{userInfoError}</div>;
    }

    return (
        <div className="flex flex-col min-h-screen items-center bg-[#F5F5F5]">
            <div className="flex flex-col w-full max-w-md min-h-screen relative">
                {/* Header */}
                <CommunityHeader />

                {/* Post Cards */}
                <section className="flex-grow overflow-y-auto mt-18 mb-15">
                    {[...Array(4)].map((_, index) => (
                        <PostCard key={index} openCommentModal={openCommentModal} />
                    ))}
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
