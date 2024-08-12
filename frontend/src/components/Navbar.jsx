import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/quickcontentaiLogo.webp';
import Button from './Button';

const Navbar = () => {
  const { currentUser, logout } = useAuth();

  return (
    <nav
      id="navbar"
      className="fixed top-0 left-0 right-0 z-10 bg-black p-4 border-gray-200 flex w-full justify-center"
    >
      <div className='flex w-full items-center justify-between max-w-6xl'>
        <div className="flex items-center gap-6">
          <Link to="/" className="lg:block overflow-hidden font-medium">
            <div className="flex items-center">
              <img src={logo} alt="QuickContentAI Logo" className="h-5 md:h-8 mr-2" />
              <span className="text-white text-sm md:text-lg font-thin">QuickContent</span>
              <span className="text-white text-sm md:text-lg font-semibold">AI</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {currentUser ? (
            <>
              <span className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent font-medium rounded-md whitespace-nowrap">
                {currentUser.email}
              </span>
              <Button onClick={logout} variant="primary">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button as={Link} to="/login" variant="secondary" className="px-[10px] md:px-4">
                Sign in
              </Button>
              <Button as={Link} to="/signup" variant="primary" className="px-[10px] md:px-4">
                Sign up
              </Button>
            </>
          )}
        </div>
      </div>

    </nav>
  );
};

export default Navbar;
