import React, {useState} from 'react';
import MainPostCard from '../components/MainPostCard.tsx';
import CommentModal from '../components/CommentModal';
import CommunityHeader from "../components/CommunityHeader.tsx";
import { usePost } from '../hooks/data/usePost.ts';
import {usePullToRefresh} from "../hooks/render/usePullToRefresh.ts";

const Community: React.FC = () => {
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
    const [selectedPostMemberId, setSelectedPostMemberId] = useState<number | null>(null);
    const [isCommentOpen, setIsCommentOpen] = useState(false);
    const { posts, refetchPost } = usePost();
    const { postSectionRef, showSpinner } = usePullToRefresh(refetchPost);

    const openCommentModal = (postId: number, postMemberId: number) => {
        setSelectedPostId(postId);
        setSelectedPostMemberId(postMemberId);
        setIsCommentOpen(true);
    };

    const closeCommentModal = () => {
        setIsCommentOpen(false);
        setSelectedPostId(null);
        setSelectedPostMemberId(null);
    };

    return (
        <div className="flex flex-col min-h-screen items-center bg-[#F5F5F5]">
            <div className="flex flex-col w-full max-w-md min-h-screen relative bg-[#F5F5F5]">
                {/* Header */}
                <CommunityHeader />

                {/* Main Post Cards */}
                <section
                    ref={postSectionRef}
                    className="flex-grow overflow-y-auto scrollbar-hide mt-14 mb-11"
                >
                    {/* Pull-to-Refresh Spinner */}
                    {showSpinner && (
                        <div className="flex justify-center items-center h-12 mt-[-12px] mb-10">
                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-black" />
                        </div>
                    )}

                    {/* posts가 배열일 때만 map을 사용 */}
                    {Array.isArray(posts) && posts.length > 0 ? (
                        posts.map((post) => (
                            <MainPostCard
                                key={`${post.id}-${post.likeCount}`}
                                openCommentModal={() => openCommentModal(post.id, post.memberId)}
                                post={post}
                            />
                        ))
                    ) : (
                        <div className="text-center">게시글이 없습니다.</div>
                    )}
                </section>

                {/* Comment Modal */}
                <CommentModal
                    isOpen={isCommentOpen}
                    closeModal={closeCommentModal}
                    postId={selectedPostId}
                    postMemberId={selectedPostMemberId}
                />
            </div>
        </div>
    );
};

export default Community;
