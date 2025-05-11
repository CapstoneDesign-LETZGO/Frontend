import React from "react";
import { ImageIcon } from "lucide-react";
import { PostDto } from "../../../../common/interfaces/PostInterface";

interface Props {
  posts: PostDto[];
  onPostClick: (post: PostDto) => void;
}

const PostGrid: React.FC<Props> = ({ posts, onPostClick }) => {
  if (!posts.length) {
    return <div className="p-4 text-center text-gray-400">게시글이 없습니다.</div>;
  }

  return (
    <div className="grid grid-cols-3 gap-2 p-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-pointer"
          onClick={() => onPostClick(post)}
        >
          {post.imageUrls.length > 0 ? (
            <img
              src={post.imageUrls[0]}
              alt="post"
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-400">
              <ImageIcon className="w-8 h-8" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default React.memo(PostGrid);
