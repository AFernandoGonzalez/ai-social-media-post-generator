import React from 'react';
import Button from './Button'; // Import your Button component

const NoContentPlaceholder = ({ height, icon, title, message, buttonText, onClick }) => {
    return (
        <div className={`flex flex-col ${height} items-center justify-center bg-gray-50 outline-dotted outline-3 outline-gray-300 rounded-lg p-6 shadow-sm`}>
            <div className="flex flex-col items-center mb-4">
                <div className="w-24 h-24 mb-4 flex items-center justify-center bg-gray-200 rounded-full">
                    <i className={`${icon} text-gray-400 text-4xl`}></i>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                <p className="text-sm text-gray-600">{message}</p>
            </div>
            <Button
                onClick={onClick}
                variant="primary"
                className="px-4 py-2 rounded-md shadow-sm hover:bg-blue-600"
            >
                {buttonText}
            </Button>
        </div>
    );
};

export default NoContentPlaceholder;
