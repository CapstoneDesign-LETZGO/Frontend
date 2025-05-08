import React, { useEffect, useState } from "react";
import ProfileHeader from "../components/ProfileHeader";
import NavigationBar from "../../../../common/components/NavigationBar";
import PostGrid from "../components/PostGrid";
import EditProfileOverlay from "../components/EditProfileOvelay";
import { useMyPost } from "../hooks/useMyPost.ts";

const ProfilePage: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const { handleFetchMemberInfo, updateName, memberInfo, userLoading, userError } = useMyPost();

    useEffect(() => {
        handleFetchMemberInfo(); // 회원 정보가 로드되면 호출
    }, [handleFetchMemberInfo]);

    // 로딩 상태 처리
    if (userLoading) {
        return <div>로딩 중...</div>;
    }

    // 에러 처리
    if (userError) {
        return <div>{userError}</div>;
    }

    return (
        <div className="flex flex-col min-h-screen items-center bg-[#F5F5F5]">
            <div className="flex flex-col w-full max-w-md min-h-screen relative bg-white">
                {memberInfo && (
                    <ProfileHeader onEditClick={() => setIsEditing(true)} member={memberInfo} />
                )}

                <PostGrid />
                <div className="absolute bottom-0 left-0 right-0 z-40">
                    <NavigationBar />
                </div>

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
