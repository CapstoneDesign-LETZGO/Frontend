import React, { useState } from 'react';
import { DetailPostDto } from "../../../common/interfaces/CommunityInterface.ts";

interface PostCardProps {
    post: DetailPostDto;
    openCommentModal: () => void;
}

const MainPostCard: React.FC<PostCardProps> = ({ post, openCommentModal }) => {
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);

    const handleLikeClick = () => setLiked(prev => !prev);
    const handleBookmarkClick = () => setBookmarked(prev => !prev);

    return (
        <div className="flex flex-col mb-1 w-full rounded-xl">
            <div className="w-full h-100 bg-gray-200 rounded-t-lg">
                <img
                    src={post.imageUrls[0] || 'default-image.jpg'}
                    alt="Post"
                    className="w-full h-full object-cover rounded-t-lg"
                    draggable={false}
                />
            </div>
            {/* Post Content */}
            <div className="p-4 bg-white">
                <p>{post.content}</p>
            </div>
            {/* Function Icons */}
            <div className="flex justify-around items-center py-2 bg-white rounded-b-lg">
                {/* Like Icon */}
                <img
                    src={liked ? "/src/assets/icons/shape/heart_fill.svg" : "/src/assets/icons/shape/heart_line.svg"}
                    alt="Like"
                    className="w-5 h-5 cursor-pointer"
                    onClick={handleLikeClick}
                />
                {/* Message Icon */}
                <img
                    src="/src/assets/icons/contact/message_1_line.svg"
                    alt="Message"
                    className="w-5 h-5 cursor-pointer"
                    onClick={openCommentModal}
                />
                {/* Share Icon */}
                <img
                    src="/src/assets/icons/file/external_link_line.svg"
                    alt="Share"
                    className="w-5 h-5"
                />
                {/* Save Icon */}
                <img
                    src={bookmarked ? "/src/assets/icons/education/bookmark_fill.svg" : "/src/assets/icons/education/bookmark_line.svg"}
                    alt="Save"
                    className="w-5 h-5 cursor-pointer"
                    onClick={handleBookmarkClick}
                />
                {/* Location Icon */}
                <img
                    src="/src/assets/icons/map/location_line.svg"
                    alt="Location"
                    className="w-5 h-5"
                />
            </div>
        </div>
    );
};

export default MainPostCard;
