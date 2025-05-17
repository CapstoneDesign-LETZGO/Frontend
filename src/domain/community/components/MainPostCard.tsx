import React, {useEffect, useState} from 'react';
import { DetailPostDto } from "../../../common/interfaces/CommunityInterface.ts";
import {Swiper, SwiperSlide} from "swiper/react";
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import {useUtils} from "../hooks/data/useUtils.ts";

interface PostCardProps {
    post: DetailPostDto;
    openCommentModal: () => void;
}

const MainPostCard: React.FC<PostCardProps> = ({ post, openCommentModal }) => {
    const { likePost, cancelLikePost, savePost, cancelSavePost } = useUtils();
    const [liked, setLiked] = useState(post.liked || false);
    const [likeCount, setLikeCount] = useState(post.likeCount);
    const [saved, setSaved] = useState(post.saved || false);
    const [isExpanded, setIsExpanded] = useState(false);
    const handleToggleExpand = () => setIsExpanded(prev => !prev);

    useEffect(() => {
        setLiked(post.liked || false);
        setSaved(post.saved || false);
        setLikeCount(post.likeCount);
    }, [post]);

    const handleLikeClick = async () => {
        const newLiked = !liked;
        setLiked(newLiked);

        // 좋아요 숫자만 +1 또는 -1 (서버에서 실제 좋아요 상태를 처리한다고 가정)
        const newLikeCount = newLiked ? likeCount + 1 : likeCount - 1;
        setLikeCount(newLikeCount);

        // 서버로 실제 좋아요 상태를 반영하는 API 호출 (예시)
        if (newLiked) {
            await likePost(post.id); // 좋아요 추가
        } else {
            await cancelLikePost(post.id); // 좋아요 취소
        }
    };

    const handleBookmarkClick = async () => {
        const newSaved = !saved;
        setSaved(newSaved);

        // 서버로 실제 저장 상태를 반영하는 API 호출
        if (newSaved) {
            await savePost(post.id); // 저장 API 호출
        } else {
            await cancelSavePost(post.id); // 저장 취소 API 호출
        }
    };

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
    const maxChars = 77; // 기본 최대 문자 수
    const nicknameLength = post.nickname.length;
    const availableChars = maxChars - nicknameLength - 3; // 닉네임 길이와 "..." 을 고려하여 표시할 텍스트 길이 계산
    const shouldTruncate = post.content.length > availableChars;
    const displayedText = isExpanded || !shouldTruncate
        ? post.content + ' '
        : post.content.slice(0, availableChars) + '... ';

    return (
        <div className="flex flex-col mb-1 w-full shadow-lg rounded-xl">
            {/* Image Slider */}
            <div className="w-full aspect-[9/16] max-h-[500px] bg-gray-200 rounded-t-lg overflow-hidden">
                <Swiper
                    modules={[Pagination]}
                    loop={true}
                    className="h-full"
                    direction="horizontal"
                    pagination={{
                        clickable: true,
                        dynamicBullets: true,
                        type: 'bullets',
                    }}
                    touchStartPreventDefault={false}
                    touchMoveStopPropagation={false}
                    onTouchStart={(_, event)=> {
                        event.stopPropagation();  // stopPropagation 무력화
                    }}
                >
                    {post.imageUrls.map((url, index) => (
                        <SwiperSlide key={index}>
                            <img
                                src={url || 'default-image.jpg'}
                                alt={`Post ${index}`}
                                className="w-full h-full object-cover"
                                draggable={false}
                                onDragStart={(e) => e.preventDefault()}
                                style={{ pointerEvents: 'auto' }}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Post Content */}
            <div className="p-4 bg-white">
                <div className="overflow-hidden">
                    {/* 프로필 이미지 (왼쪽에 띄우기) */}
                    <img
                        src={post.profileImageUrl || "/icons/user/user_4_line.svg"}
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
                                간단히
                            </button>
                        )}
                    </p>
                </div>
            </div>

            {/* Util Icons */}
            <div className="flex justify-between items-center -mt-4 py-2 bg-white rounded-b-lg px-6">
                {/* Like Icon */}
                <div className="flex items-center">
                    <img
                        src={liked ? "/icons/shape/heart_fill.svg" : "/icons/shape/heart_line.svg"}
                        alt="Like"
                        className="w-5 h-5 cursor-pointer"
                        onClick={handleLikeClick}
                    />
                    <span className="ml-1.5 text-xs min-w-[28px] text-center">{formatNumber(likeCount)}</span> {/* Like Count 표시 */}
                </div>
                {/* Comment Icon */}
                <div className="flex items-center -ml-10">
                    <img
                        src="/icons/contact/message_1_line.svg"
                        alt="Message"
                        className="w-5 h-5 cursor-pointer"
                        onClick={openCommentModal}
                    />
                    <span className="ml-1.5 text-xs min-w-[28px] text-center">{formatNumber(post.commentCount)}</span> {/* Comment Count 표시 */}
                </div>
                {/* Share Icon */}
                <img
                    src="/icons/file/external_link_line.svg"
                    alt="Share"
                    className="w-5 h-5 -ml-6"
                />
                {/* Save Icon */}
                <img
                    src={saved ? "/icons/education/bookmark_fill.svg" : "/icons/education/bookmark_line.svg"}
                    alt="Save"
                    className="w-5 h-5 cursor-pointer"
                    onClick={handleBookmarkClick}
                />
                {/* Location Icon */}
                <img
                    src="/icons/map/location_line.svg"
                    alt="Location"
                    className="w-5 h-5"
                />
            </div>
        </div>
    );
};

export default MainPostCard;
