import React from 'react';
import Button from './Button';
import { useTheme } from '../contexts/ThemeContext';

const NoContentPlaceholder = ({ height, icon, title, message, buttonText, onClick }) => {
    const { isDarkMode } = useTheme();

    return (
        <div className={`flex flex-col ${height} items-center justify-center ${isDarkMode ? 'bg-dark-surface outline-dark-border' : 'bg-light-surface outline-light-border'} outline-dotted outline-3 rounded-lg p-6 shadow-sm`}>
            <div className="flex flex-col items-center mb-4">
                <div className={`w-24 h-24 mb-4 flex items-center justify-center ${isDarkMode ? 'bg-dark-hover' : 'bg-light-hover'} rounded-full`}>
                    <i className={`${icon} ${isDarkMode ? 'text-dark-muted' : 'text-light-muted'} text-4xl`}></i>
                </div>
                <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-dark-textPrimary' : 'text-light-textPrimary'}`}>{title}</h2>
                <p className={`text-sm ${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'}`}>{message}</p>
            </div>
            {onClick && (
                <Button
                    onClick={onClick}
                    variant="primary"
                    className={`px-4 py-2 rounded-md shadow-sm ${isDarkMode ? 'bg-dark-active hover:bg-dark-hover' : 'bg-light-active hover:bg-light-hover'}`}
                >
                    {buttonText}
                </Button>
            )}
        </div>
    );
};

export default NoContentPlaceholder;
