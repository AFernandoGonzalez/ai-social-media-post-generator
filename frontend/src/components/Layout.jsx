import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import { Outlet } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarRef = useRef();
    const { isDarkMode } = useTheme();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsSidebarOpen(false);
            }
        };
        if (isSidebarOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSidebarOpen]);

    return (
        <div className={`flex h-screen relative ${isDarkMode ? 'bg-dark-background text-dark-textPrimary' : 'bg-light-background text-light-textPrimary'}`}>
            <div ref={sidebarRef}>
                <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            </div>
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}
            <div className="flex flex-col flex-grow">
                <TopNav toggleSidebar={toggleSidebar} />
                <div className="overflow-auto flex-grow" style={{ width: '100%', maxWidth: '100vw' }}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;
