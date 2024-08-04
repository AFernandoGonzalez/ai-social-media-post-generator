import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { toast } from 'react-toastify';
import Button from './Button';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadUserProfile();
  }, []);

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

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

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

  const isActiveLink = (path) => location.pathname === path;

  return (
    <div
      className={`fixed lg:static inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out bg-gray-900 text-white w-64 flex-shrink-0 p-4 flex flex-col h-screen z-50`}
    >
      <div className="flex items-center mb-6">
        <img src="path-to-your-logo.png" alt="Logo" className="w-8 h-8 mr-2" />
        <h2 className="text-2xl font-bold">AI SMG</h2>
        <button className="lg:hidden ml-auto" onClick={toggleSidebar}>
          <i className="fas fa-times"></i>
        </button>
      </div>
      <nav className="flex-grow">
        <ul>
          <li className="mb-4">
            <Link
              to="/dashboard"
              className={`flex items-center p-2 rounded ${isActiveLink('/dashboard') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
              onClick={handleLinkClick}
            >
              <i className="fas fa-tachometer-alt mr-3"></i>
              Dashboard
            </Link>
          </li>
          <li className="mb-4">
            <Link
              to="/dashboard/campaigns"
              className={`flex items-center p-2 rounded ${isActiveLink('/dashboard/campaigns') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
              onClick={handleLinkClick}
            >
              <i className="fas fa-bullhorn mr-3"></i>
              Campaigns
            </Link>
          </li>
          <li className="mb-4">
            <h3 className="text-gray-400 text-xs uppercase px-2">Tools</h3>
            <Link
              to="/dashboard/templates"
              className={`flex items-center p-2 rounded mt-2 ${isActiveLink('/dashboard/templates') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
              onClick={handleLinkClick}
            >
              <i className="fas fa-th-list mr-3"></i>
              Templates
            </Link>
            <Link
              to="/dashboard/generate"
              className={`flex items-center p-2 rounded mt-2 ${isActiveLink('/dashboard/generate') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
              onClick={handleLinkClick}
            >
              <i className="fas fa-plus-circle mr-3"></i>
              Generate
            </Link>
            <Link
              to="/dashboard/favorites"
              className={`flex items-center p-2 rounded mt-2 ${isActiveLink('/dashboard/favorites') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
              onClick={handleLinkClick}
            >
              <i className="fas fa-heart mr-3"></i>
              Favorites
            </Link>
          </li>
        </ul>
      </nav>
      <div className="mt-auto mb-[2rem]">
        <div className="flex items-center mb-4">
          <img
            src={getProfileImage()}
            alt="Profile"
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <p className="text-sm font-semibold">{user.firstName} {user.lastName}</p>
            <p className="text-xs text-gray-400">Admin</p>
          </div>
        </div>
        <Button onClick={handleLogout} variant="primary" className="w-full">
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
