import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { DetailPostDto } from "../../../../common/interfaces/CommunityInterface";
import MainPostCard from "../../../community/components/MainPostCard";
import CommentModal from "../../../community/components/comment/CommentModal";

interface Props {
    post: DetailPostDto;
    onClose: () => void;
    allPosts: DetailPostDto[];
}

const PostDetailOverlay: React.FC<Props> = ({ post, onClose, allPosts }) => {
    const startIndex = allPosts.findIndex((p) => p.id === post.id);
    const postList = allPosts.slice(startIndex).concat(allPosts.slice(0, startIndex));

    const [isCommentOpen, setIsCommentOpen] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
    const [selectedPostMemberId, setSelectedPostMemberId] = useState<number | null>(null);

    const openCommentModal = (postId: number, memberId: number) => {
        setSelectedPostId(postId);
        setSelectedPostMemberId(memberId);
        setIsCommentOpen(true);
    };

    const closeCommentModal = () => {
        setIsCommentOpen(false);
        setSelectedPostId(null);
        setSelectedPostMemberId(null);
    };

    const isSinglePost = allPosts.length === 1;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center">
            <div
                className={
                    isSinglePost
                        ? "bg-white rounded-xl shadow-xl w-full max-w-md mx-4 relative overflow-hidden"
                        : "w-full max-w-md bg-white rounded-none shadow-lg h-screen overflow-y-auto relative pb-14"
                }
            >

                <div className="sticky top-0 bg-white z-10 border-b p-4 flex items-center">
                    <button onClick={onClose}>
                        <ArrowLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <span className="ml-3 font-semibold text-lg">게시물</span>
                </div>
                {/*게시물이 한개뿐이라면 중앙에 오버레이, 여러개면 스크롤방식*/}
                {isSinglePost ? (
                    <div className="overflow-y-auto max-h-[calc(100vh-60px)]">
                        <MainPostCard
                            post={post}
                            openCommentModal={() => openCommentModal(post.id, post.memberId)}
                        />
                    </div>
                ) : (
                    postList.map((p) => (
                        <MainPostCard
                            key={p.id}
                            post={p}
                            openCommentModal={() => openCommentModal(p.id, p.memberId)}
                        />
                    ))
                )}
            </div>

            <CommentModal
                isOpen={isCommentOpen}
                closeModal={closeCommentModal}
                postId={selectedPostId}
                postMemberId={selectedPostMemberId}
            />
        </div>
    );
};

export default PostDetailOverlay;
