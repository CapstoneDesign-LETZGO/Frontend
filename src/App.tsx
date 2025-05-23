import {JSX, useEffect, useState} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './domain/account/auth/pages/Login';
import SignUp from './domain/account/auth/pages/Signup.tsx';
import Profile from './domain/account/member/pages/Profile';
import EditProfile from './domain/account/member/pages/EditProfile.tsx';
import ChatMessage from './domain/chat/pages/ChatMessage';
import Community from './domain/community/pages/Community';
import Map from './domain/map/pages/Map.tsx';
import Notificate from './domain/notification/pages/Notificate.tsx';
import Recommend from './domain/recommend/pages/Recommend.tsx';
import Schedule from './domain/schedule/pages/Schedule.tsx';
import FindPassword from "./domain/account/auth/pages/FindPassword.tsx";
import NavigationBar from './common/components/NavigationBar.tsx';
import './common/styles/global.css';
import { LetzgoToastContainer } from './common/components/LetzgoToastContainer.tsx';

import SelectRegion from './domain/schedule/pages/SelectRegion';
import RegisterSchedule from './domain/schedule/pages/RegisterSchedule';
import ScheduleList from './domain/schedule/pages/ScheduleList';
import ScheduleDetail from './domain/schedule/pages/ScheduleDetail';
import SchedulePlaceRegister from './domain/schedule/pages/SchedulePlaceRegister';
import { ScheduleProvider } from './domain/schedule/contexts/ScheduleContext';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ChatRoomWithProvider from "./domain/chat/components/chatRoom/ChatRoomWithProvider.tsx";
import {initFirebaseMessaging} from "./common/libs/firebase.tsx";
import ManagePost from "./domain/community/components/managePost/ManagePost.tsx";
import {RecoilRoot} from "recoil";

const queryClient = new QueryClient();

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

    const RequireAuth = ({ children }: { children: JSX.Element }) => {
        return isLoggedIn ? children : <Navigate to="/login" replace />;
    };

    const LayoutWithNav = ({ children }: { children: JSX.Element }) => {
        return (
            <>
                {children}
                <NavigationBar />
            </>
        );
    };

    useEffect(() => {
        if ('Notification' in window && 'serviceWorker' in navigator) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log('알림 권한이 허용되었습니다.');
                    initFirebaseMessaging();

                    navigator.serviceWorker.register('/firebase-messaging-sw.js')
                        .then(registration => {
                            console.log('Service Worker registered:', registration);
                        })
                        .catch(err => {
                            console.error('Service Worker registration failed:', err);
                        });
                }
            });
        } else {
            console.log('알림이나 Service Worker가 지원되지 않는 환경입니다.');
        }
    }, []);

    return (
        <RecoilRoot> {/* Recoil 상태를 사용하는 모든 컴포넌트를 감싸는 최상위 루트 */}
            <QueryClientProvider client={queryClient}>
                <Router>
                    <div className="min-h-screen flex flex-col bg-white lg:bg-gray-100">
                        <Routes>
                            {/* 로그인 관련 */}
                            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                            <Route path="/sign-up" element={<SignUp />} />
                            <Route path="/find-password" element={<FindPassword />} />

                            {/* 네비게이션 바 포함 */}
                            <Route path="/community" element={<RequireAuth><LayoutWithNav><Community /></LayoutWithNav></RequireAuth>} />
                            <Route path="/map" element={<LayoutWithNav><Map /></LayoutWithNav>} />
                            <Route path="/schedule" element={<RequireAuth><LayoutWithNav><Schedule /></LayoutWithNav></RequireAuth>} />
                            <Route path="/profile" element={<RequireAuth><LayoutWithNav><Profile /></LayoutWithNav></RequireAuth>} />
                            <Route path="/profile/:memberId" element={<RequireAuth><LayoutWithNav><Profile /></LayoutWithNav></RequireAuth>} />
                            <Route path="/edit-profile" element={<RequireAuth><LayoutWithNav><EditProfile /></LayoutWithNav></RequireAuth>} />

                            {/* 로그인 필요하나 네비게이션 바 없음 */}
                            <Route path="/manage-post" element={<RequireAuth><ManagePost /></RequireAuth>} />
                            <Route path="/chat-message" element={<RequireAuth><ChatMessage /></RequireAuth>} />
                            <Route path="/chat-room" element={<RequireAuth><ChatRoomWithProvider /></RequireAuth>} />
                            <Route path="/notification" element={<RequireAuth><Notificate /></RequireAuth>} />
                            <Route path="/recommend" element={<RequireAuth><Recommend /></RequireAuth>} />

                            {/* 일정 등록 플로우 */}
                            <Route path="/schedule/region" element={<RequireAuth><ScheduleProvider><SelectRegion /></ScheduleProvider></RequireAuth>} />
                            <Route path="/schedule/register" element={<RequireAuth><ScheduleProvider><RegisterSchedule /></ScheduleProvider></RequireAuth>} />
                            <Route path="/schedule/list" element={<RequireAuth><ScheduleProvider><ScheduleList /></ScheduleProvider></RequireAuth>} />
                            <Route path="/schedule/detail/:id" element={<RequireAuth><ScheduleProvider><ScheduleDetail /></ScheduleProvider></RequireAuth>} />
                            <Route path="/schedule/register/place/:scheduleId" element={<RequireAuth><ScheduleProvider><SchedulePlaceRegister /></ScheduleProvider></RequireAuth>} />

                            {/* 기본 경로 */}
                            <Route path="/*" element={<Navigate to={isLoggedIn ? "/community" : "/login"} replace />} />
                        </Routes>

                        {/* 토스트 */}
                        <LetzgoToastContainer />
                    </div>
                </Router>
            </QueryClientProvider>
        </RecoilRoot>
    );
};

export default App;
