import React from "react";
import { ArrowLeft } from "lucide-react";
import PostDetailCard from "../components/PostDetailCard";
import { DetailPostDto } from "../../../../common/interfaces/CommunityInterface";

interface Props {
    post: DetailPostDto;
    onClose: () => void;
    allPosts: DetailPostDto[];
}

const PostDetailOverlay: React.FC<Props> = ({ post, onClose, allPosts }) => {
    const startIndex = allPosts.findIndex((p) => p.id === post.id);
    const postList = allPosts.slice(startIndex).concat(allPosts.slice(0, startIndex));

    return (
        <div className="fixed inset-0 z-0 bg-black/40 flex justify-center items-start pt-0"> {/* pt-10 → pt-0 */}
            <div className="w-full max-w-md bg-white rounded-none shadow-lg h-screen overflow-y-auto relative pb-14">
                {/* rounded-t-xl → rounded-none, h-[90vh] → h-screen */}

                <div className="sticky top-0 bg-white z-10 border-b p-4 flex items-center">
                    <button onClick={onClose}>
                        <ArrowLeft className="w-6 h-6 text-gray-700" />
                    </button>
                    <span className="ml-3 font-semibold text-lg">게시물</span>
                </div>

                {postList.map((p) => (
                    <PostDetailCard key={p.id} post={p} />
                ))}
            </div>
        </div>
    );
};

export default PostDetailOverlay;
