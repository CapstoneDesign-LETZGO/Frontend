import React, { useEffect, useRef } from 'react';
import AddCard from './AddCard';
import AddImage from './AddImage';
import { usePlaceStore } from '../../../../common/libs/placeStore';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePost } from '../../hooks/data/usePost';
import { PostForm } from '../../../../common/interfaces/CommunityInterface.ts';
import { toast } from 'react-toastify';
import {useManagePostImages} from "../../hooks/render/useManagePostImages.ts";

const ManagePostForm: React.FC = () => {
    const {
        content,
        setContent,
        imageDataList,
        setImageDataList,
        handleImageSelect,
        clearStorage,
        MAX_IMAGES,
    } = useManagePostImages();
    const { selectedPlace, clearSelectedPlace } = usePlaceStore();
    const navigate = useNavigate();
    const location = useLocation();
    const prevLocationRef = useRef(location);
    const { addPost } = usePost('all');

    // 페이지 이동 감지 후 상태 정리
    useEffect(() => {
        const prev = prevLocationRef.current;
        const curr = location;
        const movedAway =
            (prev.pathname === '/managePostForm' || prev.pathname === '/manage') &&
            !(curr.pathname === '/map' && curr.state?.from === 'manage') &&
            curr.pathname !== '/placePage';
        if (movedAway) {
            clearStorage();
            clearSelectedPlace();
        }
        prevLocationRef.current = curr;
    }, [location, clearSelectedPlace, clearStorage]);

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleImageSelect(e.target.files);
        e.target.value = ''; // reset input to allow same file selection
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedPlace) {
            alert('장소를 선택해주세요.');
            return;
        }

        if (imageDataList.length < 1) {
            alert('사진을 최소 1장 이상 업로드해야 합니다.');
            return;
        }

        const postForm: PostForm = {
            mapX: selectedPlace.lng,
            mapY: selectedPlace.lat,
            content,
        };

        const files = imageDataList.map((img) => img.file);

        try {
            await addPost(postForm, files);
            await clearStorage();
            clearSelectedPlace();
            toast.success('게시글이 등록되었습니다.');
            navigate('/community');
        } catch (error) {
            console.error('게시글 등록 실패:', error);
            toast.error('게시글 등록에 실패했습니다.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 mt-15 space-y-2">
            {/* 이미지 리스트 + 삭제 버튼 영역 */}
            <AddImage images={imageDataList} setImages={setImageDataList} />

            {/* 이미지 추가 버튼 */}
            <div
                onClick={() => {
                    if (imageDataList.length >= MAX_IMAGES) {
                        alert(`이미지는 최대 ${MAX_IMAGES}장까지 업로드할 수 있습니다.`);
                        return;
                    }
                    document.getElementById('hidden-file-input')?.click();
                }}
            >
                <AddCard iconSrc="/icons/file/pic_line.svg" label="사진 추가" />
            </div>
            <input
                id="hidden-file-input"
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={onFileChange}
            />

            {/* 장소 추가 */}
            <div onClick={() => navigate('/map', { state: { from: 'manage' } })}>
                <AddCard
                    iconSrc="/icons/map/location_line.svg"
                    label="장소 추가"
                    subLabel={selectedPlace ? `${selectedPlace.name} · ${selectedPlace.address}` : undefined}
                />
            </div>

            {/* 게시글 내용 입력 */}
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

            {/* 고정된 하단 버튼 */}
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
