import React from 'react';
import Button from './Button'; // Import your Button component
import { Link } from 'react-router-dom';

const NoContentDashboard = ({ height, icon, title, message, buttonText, link }) => {
    return (
        <div className={`w-full flex flex-col ${height} items-center justify-center bg-gray-50 outline-dotted outline-3 outline-gray-300 rounded-lg p-6 m-4 shadow-sm`}>
            <div className="flex flex-col items-center mb-4">
                <div className="w-24 h-24 mb-4 flex items-center justify-center bg-gray-200 rounded-full">
                    <i className={`${icon} text-gray-400 text-4xl`}></i>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                <p className="text-sm text-gray-600">{message}</p>
            </div>
            {buttonText && (
                <Link
                    to={link}
                    variant="primary"
                    className="px-4 py-2 rounded-md shadow-sm  bg-gray-900 text-white hover:bg-gray-800 hover:text-white"
                >
                    {buttonText}
                </Link>
            )}

            
        </div>
    );
};

export default NoContentDashboard;
