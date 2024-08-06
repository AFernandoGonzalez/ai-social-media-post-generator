import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from './Button';
import logo from '../assets/quickcontentaifinal.png';

const Navbar = () => {
  const { currentUser, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-10 bg-black p-4  border-gray-200 flex items-center justify-between">
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
            <Button
              onClick={logout}
              variant="danger"
              className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium rounded-md whitespace-nowrap"
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent font-medium rounded-md whitespace-nowrap"
              tabIndex="0"
            >
              Sign in
            </Link>
            <Button
              as={Link}
              to="/signup"
              variant="primary"
              className="whitespace-nowrap"
              tabIndex="0"
            >
              Sign up
            </Button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
