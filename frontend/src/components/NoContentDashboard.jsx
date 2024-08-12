
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const NoContentDashboard = ({ height, icon, title, message, buttonText, link }) => {
    const { isDarkMode } = useTheme();

    return (
        <div className={`w-full flex flex-col ${height} items-center justify-center ${isDarkMode ? 'bg-dark-surface outline-dark-border' : 'bg-light-surface outline-light-border'} outline-dotted outline-3 rounded-lg p-6 m-4 shadow-sm`}>
            <div className="flex flex-col items-center mb-4">
                <div className={`w-24 h-24 mb-4 flex items-center justify-center ${isDarkMode ? 'bg-dark-hover' : 'bg-light-hover'} rounded-full`}>
                    <i className={`${icon} ${isDarkMode ? 'text-dark-muted' : 'text-light-muted'} text-4xl`}></i>
                </div>
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-dark-textPrimary' : 'text-light-textPrimary'}`}>{title}</h2>
                <p className={`text-sm ${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'}`}>{message}</p>
            </div>
            {buttonText && (
                <Link
                    to={link}
                    variant="primary"
                    className={`px-4 py-2 rounded-md shadow-sm ${isDarkMode ? 'bg-dark-active text-dark-textPrimary hover:bg-dark-hover' : 'bg-light-active text-light-textPrimary hover:bg-light-hover'}`}
                >
                    {buttonText}
                </Link>
            )}
        </div>
    );
};

export default NoContentDashboard;
