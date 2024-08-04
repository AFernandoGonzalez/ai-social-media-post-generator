import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { createUserInDB } from '../services/api';
import { getFriendlyErrorMessage } from '../utils/errorMessages';
import { toast } from 'react-toastify';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const navigate = useNavigate();

  const handleFirebaseAuth = async (user, firstName, lastName) => {
    const { uid, email, displayName } = user;
    let name = displayName ? displayName.split(' ') : [firstName, lastName];
    const [fName = '', lName = ''] = name;

    try {
      await createUserInDB(uid, email, fName, lName);
    } catch (error) {
      toast.error('Failed to create user in DB');
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await handleFirebaseAuth(userCredential.user, firstName, lastName);
      toast.success('Signed up successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(getFriendlyErrorMessage(error.code));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              required
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              required
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign Up
          </button>
          <div className="text-sm text-center">
            Already have an account? <a href="/login" className="text-indigo-600 hover:text-indigo-500">Login</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
