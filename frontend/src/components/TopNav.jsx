import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { toast } from 'react-toastify';

const TopNav = ({ toggleSidebar }) => {
    const [user, setUser] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const loadUserProfile = () => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                const { uid, email, displayName, photoURL } = currentUser;
                const [firstName, lastName] = displayName ? displayName.split(' ') : ['Anonymous', ''];
                setUser({ uid, email, firstName, lastName, photoURL });
            } else {
                toast.error('Failed to load user profile.');
            }
        };

        loadUserProfile();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
            toast.success('Logged out successfully!');
        } catch (error) {
            toast.error('Failed to log out.');
            console.error('Logout error:', error);
        }
    };

    const getProfileImage = () => {
        if (user.photoURL) {
            return user.photoURL;
        } else if (user.firstName && user.lastName) {
            return `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`;
        } else {
            return 'https://ui-avatars.com/api/?name=User&background=random';
        }
    };

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
                    <img src={getProfileImage()} alt="Profile" className="w-8 h-8 rounded-full mr-2" />
                    <span>Hello, {user.firstName}</span>
                </div>
                <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default TopNav;
