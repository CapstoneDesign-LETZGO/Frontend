import React from 'react';

interface PostCardProps {
    openCommentModal: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ openCommentModal }) => {
    return (
        <div className="flex flex-col mb-1 w-full rounded-xl">
            <div className="w-full h-100 bg-gray-200 rounded-t-lg">
                <img src="your-image-source.jpg" alt="Post" className="w-full h-full object-cover rounded-t-lg" />
            </div>
            <div className="p-4 bg-white">
                <p>Your post content here</p>
            </div>
            <div className="flex justify-around items-center py-2 bg-white rounded-b-lg">
                <img src="/src/assets/icons/shape/heart_line.svg" alt="Like" className="w-5 h-5" />
                <img
                    src="/src/assets/icons/contact/message_1_line.svg"
                    alt="Message"
                    className="w-5 h-5 cursor-pointer"
                    onClick={openCommentModal}
                />
                <img src="/src/assets/icons/file/external_link_line.svg" alt="Share" className="w-5 h-5" />
                <img src="/src/assets/icons/education/bookmark_line.svg" alt="Save" className="w-5 h-5" />
                <img src="/src/assets/icons/map/location_line.svg" alt="Location" className="w-5 h-5" />
            </div>
        </div>
    );
};

export default PostCard;
