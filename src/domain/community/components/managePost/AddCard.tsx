interface ManagePostCardProps {
    iconSrc: string; // 왼쪽 아이콘
    label: string;   // 가운데 텍스트 ("사진 추가" / "장소 추가")
    subLabel?: string;
}

const AddCard: React.FC<ManagePostCardProps> = ({ iconSrc, label, subLabel }) => {
    return (
        <div className="w-full p-2 bg-white text-sm relative cursor-pointer hover:bg-gray-200 transition-colors rounded-md">
            <div className="flex items-center">
                {/* 왼쪽 아이콘 */}
                <img
                    src={iconSrc}
                    alt="icon"
                    className="w-6 h-6 rounded-full mr-3"
                />
                {/* 텍스트 */}
                <div className="flex-1 min-w-0">
                    <span className="font-semibold text-xs block">{label}</span>
                    {subLabel && (
                        <span className="text-[10px] text-gray-500 break-words text-wrap block">
                            {subLabel}
                        </span>
                    )}
                </div>
                {/* 오른쪽 화살표 */}
                <img
                    src="/icons/arrow/right_line.svg"
                    alt="arrow"
                    className="w-6 h-6 ml-auto"
                />
            </div>
        </div>
    );
};

export default AddCard;
