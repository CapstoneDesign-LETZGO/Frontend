import React, {useEffect, useState} from 'react';
import AddCard from './AddCard';
import AddImage from './AddImage';
import { usePlaceStore } from '../../../../common/libs/placeStore';
import {useNavigate} from "react-router-dom";

const MAX_IMAGES = 5;

const ManagePostForm: React.FC = () => {
    const [content, setContent] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const { setSelectedPlace } = usePlaceStore();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (images.length < 1) {
            alert('사진을 최소 1장 이상 업로드해야 합니다.');
            return;
        }
        console.log({ content, images });
    };

    useEffect(() => {
        const storedPlace = sessionStorage.getItem("selectedPlace");
        if (storedPlace) {
            setSelectedPlace(JSON.parse(storedPlace));
            sessionStorage.removeItem("selectedPlace"); // 선택 후 바로 제거해도 됨
        }
    }, []);

    useEffect(() => {
        // 컴포넌트 마운트 시 sessionStorage에서 데이터 복원
        const savedContent = sessionStorage.getItem("postContent");
        const savedImages = sessionStorage.getItem("postImages");

        if (savedContent) setContent(savedContent);
        if (savedImages) setImages(JSON.parse(savedImages));
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem("postContent", content);
            localStorage.setItem("postImages", JSON.stringify(images));
        } catch (e) {
            if (e instanceof DOMException && e.name === "QuotaExceededError") {
                alert("저장 용량이 초과되었습니다. 이미지를 서버에 업로드해주세요.");
                // 대체 저장소 사용 또는 서버 업로드 로직 추가 가능
            } else {
                console.error("알 수 없는 오류 발생:", e);
            }
        }
    }, [content, images]);

    return (
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 mt-15 space-y-2">
            {/* 이미지 리스트 + 삭제 버튼 영역 분리 */}
            <AddImage images={images} setImages={setImages} />

            {/* 이미지 추가 버튼은 여기서 그대로 유지 */}
            <div onClick={() => {
                if (images.length >= MAX_IMAGES) {
                    alert(`이미지는 최대 ${MAX_IMAGES}장까지 업로드할 수 있습니다.`);
                    return;
                }
                document.getElementById('hidden-file-input')?.click();
            }}>
                <AddCard iconSrc="/icons/file/pic_line.svg" label="사진 추가" />
            </div>
            <input
                id="hidden-file-input"
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    if (images.length + files.length > MAX_IMAGES) {
                        alert(`이미지는 최대 ${MAX_IMAGES}장까지만 업로드할 수 있습니다.`);
                        e.target.value = '';
                        return;
                    }
                    const selectedImages = files.slice(0, MAX_IMAGES - images.length);
                    Promise.all(
                        selectedImages.map((file) => {
                            return new Promise<string>((resolve) => {
                                const reader = new FileReader();
                                reader.onloadend = () => resolve(reader.result as string);
                                reader.readAsDataURL(file);
                            });
                        })
                    ).then((newImages) => {
                        setImages((prev) => [...prev, ...newImages]);
                    });
                    e.target.value = '';
                }}
            />

            <div onClick={() => navigate('/map')}>
                <AddCard iconSrc="/icons/map/location_line.svg" label="장소 추가" />
            </div>

            <textarea
                placeholder="내용을 입력하세요"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={3000}
                className="w-full h-60 p-2 text-xs rounded-md resize-none focus:outline-none"
            />
            <div className="-mt-[2px] mr-3 text-right text-xs text-gray-400">
                {content.length} / 3000 자
            </div>

            <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md p-4 bg-white">
                <button
                    type="submit"
                    className="w-full py-3 text-black bg-gray-200 rounded-xl font-semibold hover:bg-gray-300 transition"
                >
                    추가하기
                </button>
            </div>
        </form>
    );
};

export default ManagePostForm;
