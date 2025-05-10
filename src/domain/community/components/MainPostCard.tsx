import React, { useState } from 'react';
import { DetailPostDto } from "../../../common/interfaces/CommunityInterface.ts";

interface PostCardProps {
    post: DetailPostDto;
    openCommentModal: () => void;
}

const MainPostCard: React.FC<PostCardProps> = ({ post, openCommentModal }) => {
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleLikeClick = () => setLiked(prev => !prev);
    const handleBookmarkClick = () => setBookmarked(prev => !prev);
    const handleToggleExpand = () => setIsExpanded(prev => !prev);

    const formatNumber = (num: number) => {
        if (num >= 1_000_000) {
            return (num / 1_000_000).toFixed(1) + 'M'; // 1M 단위로 표시
        } else if (num >= 1_000) {
            return (num / 1_000).toFixed(1) + 'K'; // 1K 단위로 표시
        } else {
            return num.toString(); // 그 외에는 그대로 표시
        }
    };

    // 텍스트 자르기 (한글 기준 약 50자는 2줄 분량)
    const maxChars = 72;
    const shouldTruncate = post.content.length > maxChars;
    const displayedText = isExpanded || !shouldTruncate
        ? post.content+ ' '
        : post.content.slice(0, maxChars) + '... ';

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
                <div className="overflow-hidden">
                    {/* 프로필 이미지 (왼쪽에 띄우기) */}
                    <img
                        src={post.profileImageUrl || "/src/assets/icons/user/user_4_line.svg"}
                        alt="Profile"
                        className="w-9 h-9 rounded-full object-cover float-left mr-2 align-top"
                    />
                    {/* 닉네임 + 내용 */}
                    <p className="text-xs leading-relaxed">
                        <span className="font-medium mr-1">{post.nickname}</span>
                        {displayedText}
                        {shouldTruncate && !isExpanded && (
                            <button
                                onClick={handleToggleExpand}
                                className="text-gray-500"
                            >
                                더보기
                            </button>
                        )}
                        {isExpanded && (
                            <button
                                onClick={handleToggleExpand}
                                className="text-gray-500"
                            >
                                접기
                            </button>
                        )}
                    </p>
                </div>
            </div>
            {/* Function Icons */}
            <div className="flex justify-around items-center -mt-4 py-2 bg-white rounded-b-lg">
                {/* Like Icon */}
                <div className="flex items-center">
                    <img
                        src={liked ? "/src/assets/icons/shape/heart_fill.svg" : "/src/assets/icons/shape/heart_line.svg"}
                        alt="Like"
                        className="w-5 h-5 cursor-pointer"
                        onClick={handleLikeClick}
                    />
                    <span className="ml-1.5 text-xs">{formatNumber(post.likeCount)}</span> {/* Like Count 표시 */}
                </div>
                <div className="flex items-center">
                    <img
                        src="/src/assets/icons/contact/message_1_line.svg"
                        alt="Message"
                        className="w-5 h-5 cursor-pointer"
                        onClick={openCommentModal}
                    />
                    <span className="ml-1.5 text-xs">{formatNumber(post.commentCount)}</span> {/* Comment Count 표시 */}
                </div>
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
