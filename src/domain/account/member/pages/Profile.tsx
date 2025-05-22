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
        refetchMember: refetchTargetMember,
    } = useMemberActions(
        isOtherProfile
            ? { mode: "otherDetailMember", memberIdForOther: parsedId }
            : { mode: "detailMember" }
    );

    const { detailMember: loginUser, refetchMember: refetchLoginUser } =
        useMemberActions({ mode: "detailMember" });

    const { member } = useMemberActions();

    const followRecList = loginUser?.followRecList ?? [];

    const [memberInfo, setMemberInfo] = useState(
        isOtherProfile ? otherDetailMember : detailMember
    );

    const { posts, refetchPost, deletePost } = usePost("member", parsedId ?? memberInfo?.id);

    const [selectedPost, setSelectedPost] = useState<DetailPostDto | null>(null);
    const [showFollowList, setShowFollowList] = useState<"팔로워" | "팔로우" | null>(null);

    useEffect(() => {
        setMemberInfo(isOtherProfile ? otherDetailMember : detailMember);
    }, [detailMember, otherDetailMember, isOtherProfile]);

    const refetchMember = async () => {
        await refetchTargetMember();
        await refetchLoginUser();
    };

    useEffect(() => {
        let startY = 0;
        let isDragging = false;
        let canDrag = false;
        let currentTranslateY = 0;

        const getY = (e: TouchEvent | MouseEvent) =>
            "touches" in e ? e.touches[0]?.clientY ?? 0 : e.clientY;

        const onStart = (e: TouchEvent | MouseEvent) => {
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

        const onEnd = async () => {
            if (!isDragging) return;
            isDragging = false;
            document.body.style.transition = "transform 0.3s ease";
            document.body.style.transform = "none";

            if (canDrag && currentTranslateY >= 100) {
                await refetchMember();
                refetchPost();
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
                        refetchMember={refetchMember}
                        currentUser={isOtherProfile ? loginUser ?? undefined : undefined}
                    />
                )}

                <section className="flex-grow overflow-y-auto scrollbar-hide mb-15">
                    <PostGrid posts={posts} onPostClick={(post) => setSelectedPost(post)} />
                </section>

                {selectedPost && (
                    <PostDetailOverlay
                        post={selectedPost}
                        allPosts={posts}
                        member={member}
                        refetchPost={refetchPost}
                        deletePost={deletePost}
                        onClose={() => setSelectedPost(null)}
                    />
                )}

                {memberInfo && showFollowList && (
                    <FollowListOverlay
                        type={showFollowList}
                        members={showFollowList === "팔로워" ? memberInfo.followedList : memberInfo.followList}
                        followList={memberInfo.followList}
                        followedList={memberInfo.followedList}
                        onClose={() => setShowFollowList(null)}
                        onMemberClick={(id) => {
                            setShowFollowList(null);
                            navigate(`/profile/${id}`);
                        }}
                        isOwnProfile={!isOtherProfile}
                        refetchMember={refetchMember}
                        followRecList={followRecList}
                    />
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
