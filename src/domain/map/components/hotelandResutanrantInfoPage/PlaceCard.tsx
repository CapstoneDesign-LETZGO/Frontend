import React from "react";

interface PlaceCardProps {
    image: string;
    title: string;
    rating: number;
    distance?: number | string;
    tags?: string[];         // 용도: category or 가격 정보
    address: string;
    isHotel?: boolean;       // true면 숙소, false면 식당
    onClose?: () => void;
}

const PlaceCard: React.FC<PlaceCardProps> = ({
    image,
    title,
    rating,
    distance,
    tags,
    address,
    isHotel = false,
    onClose,
}) => {
    const formattedDistance =
        typeof distance === "number"
            ? `${distance.toFixed(1)}km`
            : distance || "";

    return (
        <div className="flex items-start bg-white shadow-md rounded-lg p-3 mb-4 relative">
            {onClose && (
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-black text-sm"
                >
                    ✕
                </button>
            )}
            <img src={image} alt={title} className="w-20 h-20 rounded-md object-cover mr-3" />
            <div className="flex-1">
                <h3 className="text-base font-semibold mb-1">{title}</h3>
                <p className="text-xs text-gray-500 mb-1">{address}</p>
                <div className="flex items-center text-sm text-gray-600 mb-1">
                    <span className="text-yellow-500 mr-1">⭐</span>
                    <span>{rating}</span>
                    {formattedDistance && <span className="ml-2">{formattedDistance}</span>}
                </div>

                {isHotel ? (
                    <div className="text-xs text-gray-700">
                        {tags && tags.length >= 2 ? (
                            <>
                                숙박가격: {tags[0]}원, 대실가격: {tags[1]}원
                            </>
                        ) : (
                            "가격 정보 없음"
                        )}
                    </div>
                ) : (
                    <div className="text-xs text-gray-500 line-clamp-2">
                        {tags?.length ? (
                            tags.map((tag, idx) => (
                                <span key={idx} className="mr-1">#{tag}</span>
                            ))
                        ) : (
                            <span>카테고리 없음</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PlaceCard;
