import { ToastContainer, Bounce } from "react-toastify";
import { FaExclamationTriangle } from "react-icons/fa"; // react-icons에서 경고 아이콘 임포트
import "react-toastify/dist/ReactToastify.css";

export const LetzgoToastContainer = () => (
    <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        closeOnClick
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        toastClassName={() =>
            "bg-white text-black text-sm rounded-xl p-4 shadow-md border border-gray-200 flex items-center space-x-1 max-w-md"
        }
        icon={() => (
            <FaExclamationTriangle
                style={{
                    fontSize: '3rem',
                    color: 'black',
                }}
            />
        )}
        transition={Bounce}
    />
);
