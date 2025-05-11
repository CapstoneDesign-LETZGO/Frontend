import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageSliderProps {
  imageUrls: string[];
}

const ImageSlider: React.FC<ImageSliderProps> = ({ imageUrls }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    setCurrentIndex((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1));
  };

  const next = () => {
    setCurrentIndex((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1));
  };

  if (!imageUrls.length) return null;

  return (
    <div className="relative w-full aspect-square overflow-hidden">
      <img
        src={imageUrls[currentIndex]}
        alt={`slide-${currentIndex}`}
        className="w-full h-full object-cover transition-all duration-300"
      />
      {imageUrls.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/70 p-1 rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/70 p-1 rounded-full"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  );
};

export default ImageSlider;
