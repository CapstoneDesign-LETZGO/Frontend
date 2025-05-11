import React, { useState } from "react";
import { PostDto } from "../../../../common/interfaces/PostInterface";
import ImageSlider from "./ImageSlider";
import CommentModal from "./CommentModal";

interface Props {
    post: PostDto;
}

const PostDetailCard: React.FC<Props> = ({ post }) => {
    const [liked, setLiked] = useState(false);
    const [isCommentOpen, setIsCommentOpen] = useState(false);

    const handleLikeClick = () => setLiked((prev) => !prev);
    const openCommentModal = () => setIsCommentOpen(true);
    const closeCommentModal = () => setIsCommentOpen(false);

    // 예시 댓글
    const dummyComments = [
        { id: 1, author: "user1", content: "좋아요!" },
        { id: 2, author: "user2", content: "어디인가요?" },
    ];

    return (
        <div className="border-b">
            <ImageSlider imageUrls={post.imageUrls} />

            <div className="p-4">
                <p className="text-sm whitespace-pre-line text-gray-800">{post.content}</p>

                <div className="flex items-center gap-4 mt-3">
                    <img
                        src={liked ? "/src/assets/icons/shape/heart_fill.svg" : "/src/assets/icons/shape/heart_line.svg"}
                        alt="Like"
                        className="w-5 h-5 cursor-pointer"
                        onClick={handleLikeClick}
                    />
                    <span className="text-xs text-gray-700">{post.likeCount}</span>

                    <img
                        src="/src/assets/icons/contact/message_1_line.svg"
                        alt="Message"
                        className="w-5 h-5 cursor-pointer"
                        onClick={openCommentModal}
                    />
                    <span className="text-xs text-gray-700">{post.commentCount}</span>
                </div>
            </div>

            {isCommentOpen && (
                <CommentModal comments={dummyComments} onClose={closeCommentModal} />
            )}
        </div>
    );
};

export default PostDetailCard;
