import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to AI Social Media Post Generator</h1>
      <p className="text-xl mb-8">Create high-quality, consistent, and engaging social media content with ease.</p>
      <div>
        <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Login</Link>
        <Link to="/signup" className="bg-green-500 text-white px-4 py-2 rounded">Sign Up</Link>
      </div>
    </div>
  );
};

export default LandingPage;
