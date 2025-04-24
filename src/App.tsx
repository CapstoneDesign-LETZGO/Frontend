import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './domain/account/auth/pages/Login';
import Signup from './domain/account/auth/pages/Signup';
import Profile from './domain/account/member/pages/Profile';
import ChatMessage from './domain/chat/pages/ChatMessage';
import ChatRoom from './domain/chat/pages/ChatRoom';
import Community from './domain/community/pages/Community';
import GoogleMap from './domain/map/pages/GoogleMap.tsx';
import Notificate from './domain/notification/pages/Notificate.tsx';
import Recommend from './domain/recommend/pages/Recommend.tsx';
import Schedule from './domain/schedule/pages/Schedule.tsx';
import FindPassword from "./domain/account/auth/pages/FindPassword.tsx";

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

    return (
        <Router>
            <div className="min-h-screen flex flex-col bg-white lg:bg-gray-100">
                <Routes>
                    {/* 로그인 페이지와 회원가입 페이지는 로그인 여부와 관계없이 접근 가능 */}
                    <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/find-password" element={<FindPassword />} />

                    {/* 로그인한 경우만 접근 가능한 페이지 */}
                    <Route path="/profile" element={isLoggedIn ? <Profile /> : <Link to="/login" />} />
                    <Route path="/chat-message" element={isLoggedIn ? <ChatMessage /> : <Link to="/login" />} />
                    <Route path="/chat-room" element={isLoggedIn ? <ChatRoom /> : <Link to="/login" />} />
                    <Route path="/community" element={isLoggedIn ? <Community /> : <Link to="/login" />} />
                    <Route path="/map" element={isLoggedIn ? <GoogleMap /> : <Link to="/login" />} />
                    <Route path="/notification" element={isLoggedIn ? <Notificate /> : <Link to="/login" />} />
                    <Route path="/recommend" element={isLoggedIn ? <Recommend /> : <Link to="/login" />} />
                    <Route path="/schedule" element={isLoggedIn ? <Schedule /> : <Link to="/login" />} />

                    {/* 기본 경로는 로그인 상태에 따라 다르게 리디렉션 */}
                    <Route path="/*" element={<Navigate to={isLoggedIn ? "/community" : "/login"} replace />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
