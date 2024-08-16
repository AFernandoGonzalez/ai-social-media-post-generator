import { toast ,Slide } from 'react-toastify';
import { useTheme } from '../contexts/ThemeContext';

const useCustomToast = () => {
    const { isDarkMode } = useTheme();

    const showToast = (message, type = 'success', icon = '🎉', options = {}) => {
        const baseOptions = {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            transition: Slide,
            theme: isDarkMode ? "dark" : "light",
           
        };

        const toastOptions = { ...baseOptions, ...options };

        switch (type) {
            case 'success':
                toast.success(message, toastOptions);
                break;
            case 'error':
                toast.error(message, toastOptions);
                break;
            case 'info':
                toast.info(message, toastOptions);
                break;
            case 'warning':
                toast.warning(message, toastOptions);
                break;
            default:
                toast(message, toastOptions);
                break;
        }
    };

    return showToast;
};

export default useCustomToast;
