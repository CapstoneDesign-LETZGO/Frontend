import React from 'react';
import { useNavigate } from 'react-router-dom';

const Community: React.FC = () => {
    const navigate = useNavigate(); // useNavigate 훅 사용

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header Section */}
            <header className="flex justify-between items-center p-4 bg-white">
                <img
                    src="/src/assets/icons/logo/logo-simple.png"
                    alt="App Logo"
                    className="h-10"
                />
                <img
                    src="/src/assets/icons/contact/send_line.svg"
                    alt="Send Logo"
                    className="h-8 cursor-pointer" // 클릭 가능한 스타일 추가
                    onClick={() => navigate('/chat-room')} // send 로고 클릭 시 /chat-room으로 이동
                />
            </header>

            {/* Post Card Section */}
            <section className="flex-grow overflow-y-auto mb-16 bg-[#F3EBEB]"> {/* 배경 색상 설정 */}
                {/* 게시글 카드들 */}
                {[...Array(4)].map((_, index) => (
                    <div
                        key={index}
                        className="flex flex-col mb-1 border border-gray-300 w-full rounded-xl"
                    >
                        <div className="w-full h-56 bg-gray-200 rounded-t-lg">
                            <img
                                src="your-image-source.jpg"
                                alt="Post"
                                className="w-full h-full object-cover rounded-t-lg"
                            />
                        </div>
                        <div className="p-4 bg-white"> {/* 게시글 내용 배경을 흰색으로 설정 */}
                            <p>Your post content here</p>
                        </div>
                        <div className="flex justify-around items-center py-2 bg-white rounded-b-lg"> {/* 하단도 흰색 */}
                            <img
                                src="/src/assets/icons/shape/heart_line.svg"
                                alt="Like"
                                className="w-5 h-5"
                            />
                            <img
                                src="/src/assets/icons/contact/message_1_line.svg"
                                alt="Message"
                                className="w-5 h-5"
                            />
                            <img
                                src="/src/assets/icons/file/external_link_line.svg"
                                alt="Share"
                                className="w-5 h-5"
                            />
                            <img
                                src="/src/assets/icons/education/bookmark_line.svg"
                                alt="Save"
                                className="w-5 h-5"
                            />
                            <img
                                src="/src/assets/icons/map/location_line.svg"
                                alt="Location"
                                className="w-5 h-5"
                            />
                        </div>
                    </div>
                ))}
            </section>

            {/* Navigation Bar */}
            <nav className="flex justify-around items-center py-4 bg-white border-t border-gray-300 fixed bottom-0 left-0 w-full">
                <div onClick={() => navigate('/home')}>
                    <img
                        src="/src/assets/icons/building/home_4_line.svg"
                        alt="Home"
                        className="w-6 h-6"
                    />
                </div>
                <div onClick={() => navigate('/map')}>
                    <img
                        src="/src/assets/icons/map/compass_line.svg"
                        alt="Navigation"
                        className="w-6 h-6"
                    />
                </div>
                <div onClick={() => navigate('/schedule')}>
                    <img
                        src="/src/assets/icons/map/map_line.svg"
                        alt="Calendar"
                        className="w-6 h-6"
                    />
                </div>
                <div onClick={() => navigate('/profile')}>
                    <img
                        src="/src/assets/icons/user/user_1_line.svg"
                        alt="Profile"
                        className="w-6 h-6"
                    />
                </div>
            </nav>
        </div>
    );
};

export default Community;
