import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FiMoon, FiSun } from "react-icons/fi";
import Button from "./Button";
import logo from '../assets/quickcontentaiLogo.webp';
import { useTheme } from '../contexts/ThemeContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [user, setUser] = useState({});
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const { uid, email, displayName, photoURL } = currentUser;
      const [firstName, lastName] = displayName
        ? displayName.split(" ")
        : ["Anonymous", ""];
      setUser({ uid, email, firstName, lastName, photoURL });
    } else {
      toast.error("Failed to load user profile.");
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
      navigate("/login");
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error("Failed to log out.");
      console.error("Logout error:", error);
    }
  };

  const getProfileImage = () => {
    if (user.photoURL) {
      return user.photoURL;
    } else if (user.firstName && user.lastName) {
      return `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`;
    } else {
      return "https://ui-avatars.com/api/?name=User&background=random";
    }
  };

  const isActiveLink = (path) => location.pathname === path;

  return (
    <div
      className={`shadow fixed lg:static inset-y-0 left-0 transform ${isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out ${isDarkMode ? "bg-dark-background text-dark-textPrimary" : "bg-light-background text-light-textPrimary"
        } w-64 flex-shrink-0 p-6 flex flex-col h-screen z-50 select-none`}
    >
      <div className="flex items-center mb-6">
        <div className="flex items-center w-full">
          <img src={logo} alt="Assist Logo" className="h-8 mr-1" />
          <span className="text-sm md:text-lg ">QuickContent</span>
          <span className="text-sm md:text-lg font-semibold">AI</span>
        </div>
      </div>
      <nav className="flex-grow overflow-y-auto">
        <ul>
          <li className="mb-4">
            <Link
              to="/dashboard"
              className={`flex items-center p-2 rounded ${isActiveLink("/dashboard")
                ? isDarkMode
                  ? "bg-dark-hover"
                  : "bg-light-hover"
                : `${isDarkMode ? "hover:bg-dark-hover" : "hover:bg-light-hover"}`
                } hover:underline`}
              onClick={handleLinkClick}
            >
              <i className="fas fa-tachometer-alt mr-3"></i>
              Dashboard
            </Link>
          </li>
          <li className="mb-4">
            <Link
              to="/dashboard/campaigns"
              className={`flex items-center p-2 rounded ${isActiveLink("/dashboard/campaigns")
                ? isDarkMode
                  ? "bg-dark-hover"
                  : "bg-light-hover"
                : `${isDarkMode ? "hover:bg-dark-hover" : "hover:bg-light-hover"}`
                } hover:underline`}
              onClick={handleLinkClick}
            >
              <i className="fas fa-bullhorn mr-3"></i>
              Campaigns
            </Link>
          </li>
          <li className="mb-4">
            <Link
              to="/dashboard/audio"
              className={`flex items-center p-2 rounded ${isActiveLink("/dashboard/audio")
                ? isDarkMode
                  ? "bg-dark-hover"
                  : "bg-light-hover"
                : `${isDarkMode ? "hover:bg-dark-hover" : "hover:bg-light-hover"}`
                } hover:underline`}
              onClick={handleLinkClick}
            >
              <i className="fa-solid fa-circle-play mr-3"></i>
              Audios
            </Link>
          </li>
        </ul>
      </nav>

      <div className="m-4 flex justify-center items-center">
        <div
          className={`flex items-center justify-between w-40 p-1 rounded-full transition-colors ${isDarkMode ? 'bg-dark-surface' : 'bg-light-surface'}`}
        >
          <span
            className={`flex-1 text-center text-xs font-medium transition-colors ${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'}`}
          >
            Light
          </span>
          <motion.button
            className={`w-8 h-8 p-1 bg-${isDarkMode ? 'dark-background' : 'light-background'} rounded-full shadow-md`}
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {isDarkMode ? (
              <FiMoon className="text-main-accent w-full h-full" />
            ) : (
              <FiSun className="text-main-accent w-full h-full" />
            )}
          </motion.button>
          <span
            className={`flex-1 text-center text-xs font-medium transition-colors ${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'}`}
          >
            Dark
          </span>
        </div>
      </div>

      <div className="mt-auto mb-16">
        <div className="flex items-center mb-4">
          <img
            src={getProfileImage()}
            alt="Profile"
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <p
              className={`text-sm font-semibold ${isDarkMode ? "text-dark-textPrimary" : "text-light-textPrimary"}`}
            >
              {user.firstName} {user.lastName}
            </p>
            <p
              className={`text-xs ${isDarkMode ? "text-dark-muted" : "text-light-muted"}`}
            >
              Admin
            </p>
          </div>
        </div>
        <Button onClick={handleLogout} variant="primary" className="w-full hover:underline">
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
