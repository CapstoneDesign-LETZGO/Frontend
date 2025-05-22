import React, { useEffect, useRef, useState } from "react";
import { DetailPostDto } from "../../../../common/interfaces/CommunityInterface.ts";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import MainPostUtil from "./MainPostUtil";
import { MemberDto } from "../../../../common/interfaces/MemberInterface.ts";

interface PostCardProps {
    post: DetailPostDto;
    openCommentModal: () => void;
    member: MemberDto | null;
    deletePost: (postId: number) => void;
    refetchPost: () => void;
}

const MainPostCard: React.FC<PostCardProps> = ({ post, openCommentModal, member, deletePost, refetchPost }) => {
    const [liked, setLiked] = useState(post.liked || false);
    const [likeCount, setLikeCount] = useState(post.likeCount);
    const [saved, setSaved] = useState(post.saved || false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setLiked(post.liked || false);
        setSaved(post.saved || false);
        setLikeCount(post.likeCount);
    }, [post]);

    const handleToggleExpand = () => setIsExpanded((prev) => !prev);
    const maxChars = 70;
    const nicknameLength = post.nickname.length;
    const availableChars = maxChars - nicknameLength - 3;
    const shouldTruncate = post.content.length > availableChars;
    const displayedText =
        isExpanded || !shouldTruncate
            ? post.content + " "
            : post.content.slice(0, availableChars) + "... ";

    const handleLikeChange = (newLiked: boolean, newLikeCount: number) => {
        setLiked(newLiked);
        setLikeCount(newLikeCount);
    };

    const handleSaveChange = (newSaved: boolean) => {
        setSaved(newSaved);
    };

    return (
        <div className="flex flex-col mb-1 w-full shadow-lg rounded-xl relative">
            {/* Image Slider */}
            <div className="relative w-full aspect-[9/16] max-h-[500px] bg-gray-200 rounded-t-lg overflow-hidden">
                <Swiper
                    modules={[Pagination]}
                    loop={true}
                    className="h-full"
                    direction="horizontal"
                    pagination={{
                        clickable: true,
                        dynamicBullets: true,
                        type: "bullets",
                    }}
                    touchStartPreventDefault={false}
                    touchMoveStopPropagation={false}
                    onTouchStart={(_, event) => {
                        event.stopPropagation();
                    }}
                >
                    {post.imageUrls.map((url, index) => (
                        <SwiperSlide key={index}>
                            <img
                                src={url || "default-image.jpg"}
                                alt={`Post ${index}`}
                                className="w-full h-full object-cover"
                                draggable={false}
                                onDragStart={(e) => e.preventDefault()}
                                style={{ pointerEvents: "auto" }}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Toggle Button */}
                {member?.id === post.memberId && (
                    <>
                        <button
                            onClick={() => setMenuOpen((prev) => !prev)}
                            className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center"
                            aria-label="Toggle options"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 12 30"
                                className="w-8 h-8 text-gray-200"
                            >
                                <circle cx="12" cy="5" r="1.5" />
                                <circle cx="12" cy="12" r="1.5" />
                                <circle cx="12" cy="19" r="1.5" />
                            </svg>
                        </button>

                        {menuOpen && (
                            <div
                                ref={menuRef}
                                className="absolute right-6 top-9 bg-white rounded shadow-lg p-1 space-y-1 z-20"
                            >
                                <button
                                    className="flex items-center text-xs w-full text-left p-1 hover:bg-gray-100"
                                    onClick={async () => {
                                        setMenuOpen(false);
                                        await deletePost(post.id);
                                        refetchPost();
                                    }}
                                >
                                    <img
                                        src="/icons/system/delete_line.svg"
                                        alt="Delete"
                                        className="w-3.5 h-3.5 mr-1"
                                    />
                                    삭제
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Post Content */}
            <div className="p-4 bg-white">
                <div className="overflow-hidden">
                    <img
                        src={post.profileImageUrl || "/icons/user/user_4_line.svg"}
                        alt="Profile"
                        className="w-9 h-9 rounded-full object-cover float-left mr-2 align-top"
                    />
                    <p className="text-xs leading-relaxed">
                        <span className="font-medium mr-1">{post.nickname}</span>
                        {displayedText}
                        {shouldTruncate && !isExpanded && (
                            <button onClick={handleToggleExpand} className="text-gray-500">
                                더보기
                            </button>
                        )}
                        {isExpanded && (
                            <button onClick={handleToggleExpand} className="text-gray-500">
                                간단히
                            </button>
                        )}
                    </p>
                </div>
            </div>

            <MainPostUtil
                postId={post.id}
                mapX={post.mapX}
                mapY={post.mapY}
                liked={liked}
                likeCount={likeCount}
                saved={saved}
                commentCount={post.commentCount}
                onLikeChange={handleLikeChange}
                onSaveChange={handleSaveChange}
                openCommentModal={openCommentModal}
            />
        </div>
    );
};

export default MainPostCard;
