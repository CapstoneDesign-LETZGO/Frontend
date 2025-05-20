import NotificationHeader from "../components/NotificationHeader.tsx";
import NotificationCard from "../components/NotificationCard.tsx";
import { useEffect } from "react";
import { useNotificationStore } from "../../../common/hooks/useNotificationStore.ts";
import {useNotification} from "../hooks/useNotification.ts";

const Notificate = () => {
    const notifications = useNotificationStore(state => state.notifications);
    const { readNotification } = useNotification();

    useEffect(() => {
        if (notifications.length > 0) {
            const unreadIds = notifications
                .filter((n) => !n.isRead)
                .map((n) => n.id);
            if (unreadIds.length > 0) {
                readNotification(unreadIds);
            }
        }
    }, [notifications]);

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
