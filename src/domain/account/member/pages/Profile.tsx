import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProfileHeader from "../components/ProfileHeader";
import PostGrid from "../components/PostGrid";
import PostDetailOverlay from "../components/PostDetailOverlay";
import FollowListOverlay from "../components/FollowListOverlay";
import { DetailPostDto } from "../../../../common/interfaces/CommunityInterface";
import { usePost } from "../../../community/hooks/data/usePost";
import { useMemberActions } from "../hooks/useMemberActions";

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const { memberId } = useParams();
    const isOtherProfile = !!memberId;
    const parsedId = memberId ? parseInt(memberId) : undefined;

    const {
        detailMember,
        otherDetailMember,
        refetchMember
    } = useMemberActions(
        isOtherProfile
            ? { mode: "otherDetailMember", memberIdForOther: parsedId }
            : { mode: "detailMember" }
    );

    const { detailMember: loginUser } = useMemberActions({ mode: "detailMember" })

    const currentUserFollowIds = loginUser?.followList?.map((m) => m.userId) ?? []; //로그인유저의 팔로우중인 유저들의 id리스트(profile header에서 추가/팔로우중 표시 위함)

    const memberInfo = isOtherProfile ? otherDetailMember : detailMember;
    const { posts, refetchPost } = usePost("member", parsedId ?? memberInfo?.id);

    const [selectedPost, setSelectedPost] = useState<DetailPostDto | null>(null);
    const [showFollowList, setShowFollowList] = useState<"팔로워" | "팔로우" | null>(null);


    useEffect(() => {
        let startY = 0;
        let isDragging = false;
        let canDrag = false;
        let currentTranslateY = 0;

        const getY = (e: TouchEvent | MouseEvent) =>
            "touches" in e ? e.touches[0]?.clientY ?? 0 : e.clientY;

        const onStart = (e: TouchEvent | MouseEvent) => {
            //PostDetailOverlay가 열려 있다면 새로고침 차단
            if (selectedPost) return;

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
                refetchMember();
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
    }, [refetchMember, refetchPost, selectedPost]);

    return (
        <div className="flex flex-col min-h-screen items-center bg-[#F5F5F5]">
            <div className="flex flex-col w-full max-w-md min-h-screen relative bg-white">
                {memberInfo && (
                    <ProfileHeader
                        member={memberInfo}
                        onFollowerClick={() => setShowFollowList("팔로워")}
                        onFollowClick={() => setShowFollowList("팔로우")}
                        isOtherProfile={isOtherProfile}
                        currentUserFollowList={currentUserFollowIds}
                    />
                )}

                <section className="flex-grow overflow-y-auto scrollbar-hide mb-15">
                    <PostGrid posts={posts} onPostClick={(post) => setSelectedPost(post)} />
                </section>

                {selectedPost && (
                    <PostDetailOverlay
                        post={selectedPost}
                        allPosts={posts}
                        onClose={() => setSelectedPost(null)}
                    />
                )}

                {memberInfo && showFollowList && (
                    <FollowListOverlay
                        type={showFollowList}
                        members={
                            showFollowList === "팔로워"
                                ? memberInfo.followedList
                                : memberInfo.followList
                        }
                        onClose={() => setShowFollowList(null)}
                        onMemberClick={(id) => {
                            setShowFollowList(null);
                            navigate(`/profile/${id}`);
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
