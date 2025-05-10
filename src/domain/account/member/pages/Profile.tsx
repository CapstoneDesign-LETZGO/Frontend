import React, { useEffect, useState } from "react";
import ProfileHeader from "../components/ProfileHeader";
import PostGrid from "../components/PostGrid";
import EditProfileOverlay from "../components/EditProfileOvelay";
import { useMyProfile } from "../hooks/useMyProfile.ts";

const ProfilePage: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const { updateName, memberInfo, loading: loadingProfile, refetch } = useMyProfile();

    useEffect(() => {
        let startY = 0;
        let isDragging = false;
        let canDrag = false;
        let currentTranslateY = 0;

        const getY = (e: TouchEvent | MouseEvent) => {
            if ('touches' in e) {
                return e.touches[0]?.clientY ?? 0;
            } else {
                return e.clientY;
            }
        };

        const onStart = (e: TouchEvent | MouseEvent) => {
            // 스크롤이 최상단일 때만 시작
            canDrag = window.scrollY === 0 || document.documentElement.scrollTop === 0;
            if (!canDrag) return;
            startY = getY(e);
            isDragging = true;
            console.log('onStart:', { startY, canDrag });
        };

        const onMove = (e: TouchEvent | MouseEvent) => {
            if (!isDragging || !canDrag) return;
            const currentY = getY(e);
            const diffY = currentY - startY;

            if (diffY > 0) { // 아래로 당기는 중
                const limitedDiffY = Math.min(diffY, 100);
                currentTranslateY = limitedDiffY;
                document.body.style.transform = `translateY(${currentTranslateY}px)`;
                document.body.style.transition = 'none';
                console.log('onMove: Dragging', { diffY });
            }
        };

        const onEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            console.log('onEnd: Drag ended, currentTranslateY:', currentTranslateY);

            // 원위치 애니메이션
            document.body.style.transition = 'transform 0.3s ease';
            document.body.style.transform = 'none';

            // 100px 이상 당겼을 때 새로고침
            if (canDrag && currentTranslateY >= 100) {
                console.log('🔄 Refreshing posts');
                refetch();
            }
            currentTranslateY = 0;
            canDrag = false;
        };

        // 이벤트 등록
        window.addEventListener('touchstart', onStart);
        window.addEventListener('mousedown', onStart);
        window.addEventListener('touchmove', onMove);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('touchend', onEnd);
        window.addEventListener('mouseup', onEnd);

        return () => {
            window.removeEventListener('touchstart', onStart);
            window.removeEventListener('mousedown', onStart);
            window.removeEventListener('touchmove', onMove);
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('touchend', onEnd);
            window.removeEventListener('mouseup', onEnd);
        };
    }, [refetch]);

    if (loadingProfile){
        return <div className="flex justify-center items-center min-h-screen">로딩 중...</div>;
    }

    return (
        <div className="flex flex-col min-h-screen items-center bg-[#F5F5F5]">
            <div className="flex flex-col w-full max-w-md min-h-screen relative bg-white">
                {memberInfo && (
                    <ProfileHeader onEditClick={() => setIsEditing(true)} member={memberInfo} />
                )}

                {/* 스크롤 영역을 PostGrid만 적용 */}
                <section className="flex-grow overflow-y-auto scrollbar-hide mb-15">
                    <PostGrid />
                </section>

                {isEditing && (
                    <EditProfileOverlay
                        onClose={() => setIsEditing(false)}
                        onSubmit={async (name) => {
                            const success = await updateName(name);
                            if (success) setIsEditing(false);
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
