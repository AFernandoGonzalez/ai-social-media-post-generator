import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from './Button';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-lg font-bold">AI Social Media Post Generator</Link>
        <div className="lg:hidden">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
              ></path>
            </svg>
          </button>
        </div>
        <div className={`flex-grow lg:flex lg:items-center lg:w-auto ${isMenuOpen ? "block" : "hidden"}`}>
          <div className="text-sm lg:flex-grow">
            {currentUser ? (
              <>
                <span className="text-white block mt-4 lg:inline-block lg:mt-0 mr-4">
                  {currentUser.email}
                </span>
                <Button
                  onClick={logout}
                  variant="danger"
                  className="mt-4 lg:mt-0 block lg:inline-block"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white block mt-4 lg:inline-block lg:mt-0 mr-4"
                >
                  Login
                </Link>
                <Button
               
                  to="/signup"
                  variant="primary"
                  className="mt-4 lg:mt-0 block lg:inline-block"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
