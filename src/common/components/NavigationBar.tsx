import { useNavigate, useLocation } from 'react-router-dom';

const NavigationBar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    return (
        <nav
            className="flex justify-between items-center p-2 bg-white fixed bottom-0 left-1/2 transform -translate-x-1/2 max-w-md w-full"
            style={{ borderTop: '0.1px solid #D1D5DB', zIndex: 1 }} // gray-300 컬러
        >
            <div onClick={() => navigate('/community')} className="ml-4">
                <img
                    src={
                        isActive('/community')
                            ? '/icons/building/home_4_fill.svg'
                            : '/icons/building/home_4_line.svg'
                    }
                    alt="Home"
                    className="w-6 h-6"
                />
            </div>
            <div onClick={() => navigate('/map')}>
                <img
                    src={
                        isActive('/map')
                            ? '/icons/map/compass_fill.svg'
                            : '/icons/map/compass_line.svg'
                    }
                    alt="Navigation"
                    className="w-6 h-6"
                />
            </div>
            <div onClick={() => navigate('/manage-post')}>
                <img
                    src="/icons/system/add_line.svg"
                    alt="Add"
                    className="w-8 h-8"
                />
            </div>
            <div onClick={() => navigate('/schedule/list')}>
                <img
                    src={
                        isActive('/schedule/list')
                            ? '/icons/map/map_fill.svg'
                            : '/icons/map/map_line.svg'
                    }
                    alt="Calendar"
                    className="w-6 h-6"
                />
            </div>
            <div onClick={() => navigate('/profile')} className="mr-4">
                <img
                    src={
                        isActive('/profile')
                            ? '/icons/user/user_2_fill.svg'
                            : '/icons/user/user_2_line.svg'
                    }
                    alt="Profile"
                    className="w-6 h-6"
                />
            </div>
        </nav>
    );
};

export default NavigationBar;
