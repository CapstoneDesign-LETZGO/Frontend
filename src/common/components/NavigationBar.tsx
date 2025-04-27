import React from 'react';
import { useNavigate } from 'react-router-dom';

const NavigationBar: React.FC = () => {
    const navigate = useNavigate();

    return (
        <nav className="flex justify-between items-center p-4 bg-white border-t border-gray-300 fixed bottom-0 left-1/2 transform -translate-x-1/2 max-w-md w-full">
            <div onClick={() => navigate('/home')}>
                <img src="/src/assets/icons/building/home_4_line.svg" alt="Home" className="w-6 h-6" />
            </div>
            <div onClick={() => navigate('/map')}>
                <img src="/src/assets/icons/map/compass_line.svg" alt="Navigation" className="w-6 h-6" />
            </div>
            <div onClick={() => navigate('/add')}>
                <img src="/src/assets/icons/system/add_line.svg" alt="Add" className="w-8 h-8" />
            </div>
            <div onClick={() => navigate('/schedule')}>
                <img src="/src/assets/icons/map/map_line.svg" alt="Calendar" className="w-6 h-6" />
            </div>
            <div onClick={() => navigate('/profile')}>
                <img src="/src/assets/icons/user/user_1_line.svg" alt="Profile" className="w-6 h-6" />
            </div>
        </nav>
    );
};

export default NavigationBar;
