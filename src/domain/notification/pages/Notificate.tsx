import NotificationHeader from "../components/NotificationHeader.tsx";
import {useNotification} from "../hooks/useNotification.ts";
import NotificationCard from "../components/NotificationCard.tsx";

const Notificate = () => {
    const { notifications, fetchNotifications, readNotification } = useNotification();

    return (
        <div className="flex flex-col min-h-screen items-center bg-[#F5F5F5]">
            <div className="flex flex-col w-full max-w-md min-h-screen relative bg-white">
                <NotificationHeader />
                <div className="mt-13">
                    <NotificationCard notifications={notifications} />
                </div>
            </div>
        </div>
    );
};

export default Notificate;
