import React from "react";
import { useUtils } from "../../hooks/data/useUtils.ts";
import {useNavigate} from "react-router-dom";

interface MainPostUtilProps {
    postId: number;
    mapX: number;
    mapY: number;
    liked: boolean;
    likeCount: number;
    saved: boolean;
    commentCount: number;
    onLikeChange: (liked: boolean, newLikeCount: number) => void;
    onSaveChange: (saved: boolean) => void;
    openCommentModal: () => void;
}

const MainPostUtil: React.FC<MainPostUtilProps> = ({
                                                       postId,
                                                       mapX,
                                                       mapY,
                                                       liked,
                                                       likeCount,
                                                       saved,
                                                       commentCount,
                                                       onLikeChange,
                                                       onSaveChange,
                                                       openCommentModal,
                                                   }) => {
    const { likePost, cancelLikePost, savePost, cancelSavePost } = useUtils();
    const navigate = useNavigate();

    const formatNumber = (num: number) => {
        if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
        if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
        return num.toString();
    };

    const handleLikeClick = async () => {
        const newLiked = !liked;
        const newLikeCount = newLiked ? likeCount + 1 : likeCount - 1;

        onLikeChange(newLiked, newLikeCount);

        if (newLiked) {
            await likePost(postId);
        } else {
            await cancelLikePost(postId);
        }
    };

    const handleBookmarkClick = async () => {
        const newSaved = !saved;
        onSaveChange(newSaved);

        if (newSaved) {
            await savePost(postId);
        } else {
            await cancelSavePost(postId);
        }
    };

    const handleLocationClick = () => {
        navigate("/map", {
            state: {
                lat: mapY,
                lng: mapX,
            },
        });
    };

    return (
        <div className="flex justify-between items-center -mt-4 py-2 bg-white rounded-b-lg px-6">
            {/* Like Icon */}
            <div className="flex items-center">
                <img
                    src={liked ? "/icons/shape/heart_fill.svg" : "/icons/shape/heart_line.svg"}
                    alt="Like"
                    className="w-5 h-5 cursor-pointer"
                    onClick={handleLikeClick}
                />
                <span className="ml-1.5 text-xs min-w-[28px] text-center">{formatNumber(likeCount)}</span>
            </div>

            {/* Comment Icon */}
            <div className="flex items-center -ml-10">
                <img
                    src="/icons/contact/message_1_line.svg"
                    alt="Message"
                    className="w-5 h-5 cursor-pointer"
                    onClick={openCommentModal}
                />
                <span className="ml-1.5 text-xs min-w-[28px] text-center">{formatNumber(commentCount)}</span>
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
                className="w-5 h-5 cursor-pointer"
                onClick={handleLocationClick}
            />
        </div>
    );
};

export default MainPostUtil;
