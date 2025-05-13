import React, { useEffect, useState } from "react";
import ProfileHeader from "../components/ProfileHeader";
import PostGrid from "../components/PostGrid";
import EditProfileOverlay from "../components/EditProfileOvelay";
import PostDetailOverlay from "../components/PostDetailOverlay";
import { DetailPostDto } from "../../../../common/interfaces/CommunityInterface";
import { usePost } from "../../../community/hooks/data/usePost.ts";
import { useMemberActions } from "../hooks/useMemberActions.ts";

const ProfilePage: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [selectedPost, setSelectedPost] = useState<DetailPostDto | null>(null);

    const { memberInfo, updateMember, refetch } = useMemberActions();
    const { posts, refetchPost } = usePost('member', memberInfo?.id);

    useEffect(() => {
        let startY = 0;
        let isDragging = false;
        let canDrag = false;
        let currentTranslateY = 0;

        const getY = (e: TouchEvent | MouseEvent) =>
            "touches" in e ? e.touches[0]?.clientY ?? 0 : e.clientY;

        const onStart = (e: TouchEvent | MouseEvent) => {
            canDrag = window.scrollY === 0 || document.documentElement.scrollTop === 0;
            if (!canDrag) return;
            startY = getY(e);
            isDragging = true;
        };

        const onMove = (e: TouchEvent | MouseEvent) => {
            if (!isDragging || !canDrag) return;
            const currentY = getY(e);
            const diffY = currentY - startY;

            if (diffY > 0) {
                currentTranslateY = Math.min(diffY, 100);
                document.body.style.transform = `translateY(${currentTranslateY}px)`;
                document.body.style.transition = "none";
            }
        };

        const onEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            document.body.style.transition = "transform 0.3s ease";
            document.body.style.transform = "none";

            if (canDrag && currentTranslateY >= 100) {
                refetch();
                if (memberInfo) {
                    refetchPost();
                }
            }
            currentTranslateY = 0;
            canDrag = false;
        };

        window.addEventListener("touchstart", onStart);
        window.addEventListener("mousedown", onStart);
        window.addEventListener("touchmove", onMove);
        window.addEventListener("mousemove", onMove);
        window.addEventListener("touchend", onEnd);
        window.addEventListener("mouseup", onEnd);

        return () => {
            window.removeEventListener("touchstart", onStart);
            window.removeEventListener("mousedown", onStart);
            window.removeEventListener("touchmove", onMove);
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("touchend", onEnd);
            window.removeEventListener("mouseup", onEnd);
        };
    }, [refetch, refetchPost]);

    return (
        <div className="flex flex-col min-h-screen items-center bg-[#F5F5F5]">
            <div className="flex flex-col w-full max-w-md min-h-screen relative bg-white">
                {memberInfo && (
                    <ProfileHeader onEditClick={() => setIsEditing(true)} member={memberInfo} />
                )}

                <section className="flex-grow overflow-y-auto scrollbar-hide mb-15">
                    <PostGrid posts={posts} onPostClick={(post) => setSelectedPost(post)} />
                </section>

                {isEditing && (
                    <EditProfileOverlay
                        onClose={() => setIsEditing(false)}
                    // onSubmit={async (name) => {
                    //     const success = await updateMember(name);
                    //     if (success) {
                    //         setIsEditing(false);
                    //         refetch();
                    //         if (memberInfo) {
                    //             refetchPost();
                    //         }
                    //     }
                    // }}
                    />
                )}

                {selectedPost && (
                    <PostDetailOverlay
                        post={selectedPost}
                        allPosts={posts}
                        onClose={() => setSelectedPost(null)}
                    />
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
