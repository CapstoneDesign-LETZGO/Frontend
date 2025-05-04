import NavigationBar from "../../../../common/components/NavigationBar.tsx";

const Profile = () => {
    return (
        <div className="flex flex-col min-h-screen items-center bg-[#F5F5F5]">
            <div className="flex flex-col w-full max-w-md min-h-screen relative">


                {/* NavigationBar */}
                <NavigationBar />
            </div>
        </div>
    );
};

export default Profile;
