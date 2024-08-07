import React from 'react';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <i className="fas fa-exclamation-triangle text-yellow-500 text-6xl animate-bounce"></i>
            <h1 className="mt-4 text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
        </div>
    );
};

export default NotFound;
