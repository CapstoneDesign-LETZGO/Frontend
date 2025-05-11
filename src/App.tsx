import { JSX, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './domain/account/auth/pages/Login';
import Signup from './domain/account/auth/pages/Signup';
import Profile from './domain/account/member/pages/Profile';
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
        <Router>
            <div className="min-h-screen flex flex-col bg-white lg:bg-gray-100">
                <Routes>
                    {/* 로그인 관련 페이지 */}
                    <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/find-password" element={<FindPassword />} />

                    {/* 네비게이션 바 포함된 페이지 */}
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

                    {/* 기본 경로 */}
                    <Route path="/*" element={<Navigate to={isLoggedIn ? "/community" : "/login"} replace />} />
                </Routes>

                {/* Letzgo 토스트 컨테이너 추가 */}
                <LetzgoToastContainer />
            </div>
        </Router>
    );
};

export default App;
