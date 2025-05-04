import React, { useState } from "react";

interface ReviewFormProps {
  onSubmit: (formData: FormData) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    if (image) formData.append("image", image);
    formData.append("title", title);
    formData.append("rating", rating.toString());
    formData.append("content", content);

    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-50 p-4 rounded-xl shadow-sm mb-4"
    >
      <div className="mb-2">
        <label className="block font-semibold text-sm mb-1">사진 업로드</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="block w-full text-sm file:mr-4 file:py-2 file:px-4
                     file:rounded-lg file:border-0
                     file:text-sm file:font-semibold
                     file:bg-gray-200 file:text-gray-700
                     hover:file:bg-gray-300
                     cursor-pointer"
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">제목</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">평점</label>
        <input
          type="number"
          min={0}
          max={5}
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">내용</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          rows={4}
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 text-sm"
      >
        리뷰 제출
      </button>
    </form>
  );
};

export default ReviewForm;
