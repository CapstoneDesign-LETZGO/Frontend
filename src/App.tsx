import { JSX, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './domain/account/auth/pages/Login';
import SignUp from './domain/account/auth/pages/Signup.tsx';
import Profile from './domain/account/member/pages/Profile';
import EditProfile from './domain/account/member/pages/EditProfile.tsx';
import ChatMessage from './domain/chat/pages/ChatMessage';
import ChatRoom from './domain/chat/pages/ChatRoom';
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

    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <div className="min-h-screen flex flex-col bg-white lg:bg-gray-100">
                    <Routes>
                        {/* 로그인 관련 페이지 */}
                        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                        <Route path="/sign-up" element={<SignUp />} />
                        <Route path="/find-password" element={<FindPassword />} />

                        {/* 네비게이션 바 포함된 페이지 */}
                        {/* 네비게이션 바 포함된 페이지 (헤더 없이) */}
                        <Route path="/community" element={
                            <RequireAuth>
                                <LayoutWithNav>
                                    <Community />
                                </LayoutWithNav>
                            </RequireAuth>
                        } />
                        <Route path="/map" element={
                            <LayoutWithNav>
                                <Map />
                            </LayoutWithNav>
                        } />
                        <Route path="/schedule" element={
                            <RequireAuth>
                                <LayoutWithNav>
                                    <Schedule />
                                </LayoutWithNav>
                            </RequireAuth>
                        } />
                        <Route path="/profile" element={
                            <RequireAuth>
                                <LayoutWithNav>
                                    <Profile />
                                </LayoutWithNav>
                            </RequireAuth>
                        } />
                        <Route path="/profile/:memberId" element={
                            <RequireAuth>
                                <LayoutWithNav>
                                    <Profile />
                                </LayoutWithNav>
                            </RequireAuth>
                        } />
                        <Route path="/edit-profile" element={
                            <RequireAuth>
                                <LayoutWithNav>
                                    <EditProfile />
                                </LayoutWithNav>
                            </RequireAuth>
                        } />

                        {/* 네비게이션 바 없이 로그인 필요 */}
                        <Route path="/chat-message" element={
                            <RequireAuth>
                                <ChatMessage />
                            </RequireAuth>
                        } />
                        <Route path="/chat-room" element={
                            <RequireAuth>
                                <ChatRoom />
                            </RequireAuth>
                        } />
                        <Route path="/notification" element={
                            <RequireAuth>
                                <Notificate />
                            </RequireAuth>
                        } />
                        <Route path="/recommend" element={
                            <RequireAuth>
                                <Recommend />
                            </RequireAuth>
                        } />

                        {/* 일정 등록 플로우: ScheduleProvider 적용 */}
                        <Route path="/schedule/region" element={
                            <RequireAuth>
                                <ScheduleProvider>
                                    <SelectRegion />
                                </ScheduleProvider>
                            </RequireAuth>
                        } />
                        <Route path="/schedule/register" element={
                            <RequireAuth>
                                <ScheduleProvider>
                                    <RegisterSchedule />
                                </ScheduleProvider>
                            </RequireAuth>
                        } />
                        <Route path="/schedule/list" element={
                            <RequireAuth>
                                <ScheduleProvider>
                                    <ScheduleList />
                                </ScheduleProvider>
                            </RequireAuth>
                        } />
                        <Route path="/schedule/detail/:id" element={
                          <RequireAuth>
                            <ScheduleProvider>
                              <ScheduleDetail />
                            </ScheduleProvider>
                          </RequireAuth>
                        } />

                        <Route path="/schedule/register/place/:scheduleId" element={
                          <RequireAuth>
                            <ScheduleProvider>
                              <SchedulePlaceRegister />
                            </ScheduleProvider>
                          </RequireAuth>
                        } />

                        {/* 기본 경로 */}
                        <Route path="/*" element={<Navigate to={isLoggedIn ? "/community" : "/login"} replace />} />
                    </Routes>

                    {/* Letzgo 토스트 컨테이너 추가 */}
                    <LetzgoToastContainer />
                </div>
            </Router>
        </QueryClientProvider>
    );
};

export default App;
