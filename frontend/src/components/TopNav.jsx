import React from 'react';

const TopNav = ({ toggleSidebar }) => {
    return (
        <div className="bg-white shadow p-4 flex justify-between items-center">
            <div className="flex items-center">
                <button className="lg:hidden mr-4" onClick={toggleSidebar}>
                    <i className="fas fa-bars text-gray-700"></i>
                </button>
                <input
                    type="text"
                    placeholder="Search"
                    className="border p-2 rounded w-full lg:w-1/3"
                />
            </div>
            <div className="flex items-center space-x-4">
                <i className="fas fa-bell text-gray-600"></i>
                <i className="fas fa-envelope text-gray-600"></i>
                <div className="flex items-center">
                    <img src="path-to-your-profile-image" alt="Profile" className="w-8 h-8 rounded-full mr-2" />
                    <span>Hello, Talukdar</span>
                </div>
            </div>
        </div>
    );
};

export default TopNav;
