import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FiMoon, FiSun } from "react-icons/fi";
import Button from "./Button";
import logo from "../assets/quickcontentaifinal.png";
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
      className={`fixed lg:static inset-y-0 left-0 transform ${isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out ${isDarkMode ? "bg-darkBackground" : "bg-lightBackground"
        } text-${isDarkMode ? "darkText" : "lightText"
        } w-64 flex-shrink-0 p-6 flex flex-col h-screen z-50`}
    >
      <div className="flex items-center mb-6">
        <div className="flex justify-center w-full">
          <img src={logo} alt="Assist Logo" className="h-8" />
        </div>
      </div>
      <nav className="flex-grow overflow-y-auto">
        <ul>
          <li className="mb-4">
            <Link
              to="/dashboard"
              className={`flex items-center p-2 rounded ${isActiveLink("/dashboard")
                  ? isDarkMode
                    ? "bg-darkHover"
                    : "bg-lightHover"
                  : `hover:${isDarkMode ? "bg-darkHover" : "bg-lightHover"
                  }`
                }`}
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
                    ? "bg-darkHover"
                    : "bg-lightHover"
                  : `hover:${isDarkMode ? "bg-darkHover" : "bg-lightHover"
                  }`
                }`}
              onClick={handleLinkClick}
            >
              <i className="fas fa-bullhorn mr-3"></i>
              Campaigns
            </Link>
          </li>
          <li className="mb-4">
            <Link
              to="/dashboard/audio"
              className={`flex items-center p-2 rounded ${isActiveLink("/dashboard/statistics")
                  ? isDarkMode
                    ? "bg-darkHover"
                    : "bg-lightHover"
                  : `hover:${isDarkMode ? "bg-darkHover" : "bg-lightHover"
                  }`
                }`}
              onClick={handleLinkClick}
            >
              <i className="fa-solid fa-circle-play mr-3"></i>
              Audios
            </Link>
          </li>
        </ul>
      </nav>

      <div className="m-4 flex justify-between items-center">
        <span
          className={`text-${isDarkMode ? "gray-400" : "gray-600"
            } text-sm`}
        >
          Light
        </span>
        <motion.button
          className={`bg-${isDarkMode ? "gray-800" : "gray-200"
            } p-2 rounded-full`}
          onClick={toggleTheme}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {isDarkMode ? (
            <motion.div
              className="flex items-center justify-center w-[60px] h-5 text-yellow-500"
              key="moon"
              initial={{ opacity: 0, rotate: -180 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 180 }}
              transition={{ duration: 0.5 }}
            >
              <FiMoon />
            </motion.div>
          ) : (
            <motion.div
              className="flex items-center justify-center w-[60px] h-5 text-yellow-500"
              key="sun"
              initial={{ opacity: 0, rotate: -180 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 180 }}
              transition={{ duration: 0.5 }}
            >
              <FiSun />
            </motion.div>
          )}
        </motion.button>
        <span
          className={`text-${isDarkMode ? "gray-400" : "gray-600"
            } text-sm`}
        >
          Dark
        </span>
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
              className={`text-sm font-semibold ${isDarkMode ? "text-darkText" : "text-lightText"
                }`}
            >
              {user.firstName} {user.lastName}
            </p>
            <p
              className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
            >
              Admin
            </p>
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
