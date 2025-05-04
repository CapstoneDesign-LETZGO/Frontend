import React from "react";
import { ImageIcon } from "lucide-react";

const dummyPosts = Array(6).fill(0); // 예시용

const PostGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-3 gap-2 p-4">
      {dummyPosts.map((_, index) => (
        <div key={index} className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center">
          <ImageIcon className="w-8 h-8 text-gray-400" />
        </div>
      ))}
    </div>
  );
};

export default React.memo(PostGrid);
