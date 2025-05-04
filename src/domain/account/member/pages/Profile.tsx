import React, { useEffect, useState } from "react";
import ProfileHeader from "../components/ProfileHeader";
import NavigationBar from "../../../../common/components/NavigationBar";
import PostGrid from "../components/PostGrid";
import EditProfileOverlay from "../components/EditProfileOvelay";
import { useProfile } from "../hooks/useProfile";

const ProfilePage: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const { fetchMemberInfo, updateName, memberInfo } = useProfile();

    useEffect(() => {
        fetchMemberInfo();
    }, []);

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