import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/quickcontentaifinal.png';

const Navbar = () => {
  const { currentUser, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-10 bg-black p-4 border-gray-200 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link to="/" className="lg:block h-[30px] overflow-hidden font-medium">
          <div>
            <img src={logo} alt="QuickContentAI Logo" className="h-8" />
          </div>
        </Link>
        
      </div>
      <div className="flex items-center gap-4">
        {currentUser ? (
          <>
            <span className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent font-medium rounded-md whitespace-nowrap">
              {currentUser.email}
            </span>
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-lg border-2 border-white px-4 py-2 font-semibold text-white transition-colors hover:bg-white hover:text-black"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="flex items-center gap-2 rounded-lg border-2 border-white px-4 py-2 font-semibold text-white transition-colors hover:bg-white hover:text-black"
              tabIndex="0"
            >
              Sign in
            </Link>
            <Link
              className="flex items-center bg-white gap-2 rounded-lg border-2 border-white px-4 py-2 font-semibold text-dark transition-colors hover:bg-black hover:text-white"
              to="/signup"
              tabIndex="0"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
