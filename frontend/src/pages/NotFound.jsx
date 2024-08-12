import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const NotFound = () => {
    const { isDarkMode } = useTheme();

    return (
        <div className={`flex flex-col items-center justify-center min-h-screen ${isDarkMode ? 'bg-dark-background text-dark-textPrimary' : 'bg-light-background text-light-textPrimary'}`}>
            <i className="fas fa-exclamation-triangle text-yellow-500 text-6xl animate-bounce"></i>
            <h1 className="mt-4 text-4xl font-bold">404 - Page Not Found</h1>
        </div>
    );
};

export default NotFound;
