import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { createUserInDB } from '../services/api';
import { getFriendlyErrorMessage } from '../utils/errorMessages';
import Button from './Button';
import useCustomToast from '../utils/useCustomToast';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const navigate = useNavigate();
  const showToast = useCustomToast();

  const handleFirebaseAuth = async (user, firstName, lastName) => {
    const { uid, email, displayName } = user;
    let name = displayName ? displayName.split(' ') : [firstName, lastName];
    const [fName = '', lName = ''] = name;

    try {
      await createUserInDB(uid, email, fName, lName);
    } catch (error) {
      showToast('Failed to create user in DB', 'error', '❗');
      return false; // Indicate failure without propagating the error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const authSuccess = await handleFirebaseAuth(userCredential.user, firstName, lastName);

      if (authSuccess !== false) {
        showToast('🎉 Signed up successfully!', 'success');
        navigate('/dashboard');
      }
    } catch (error) {
      showToast(getFriendlyErrorMessage(error.code), 'error', '❗');
    }
  };

  return (
    <div className="bg-black min-h-screen flex items-center justify-center p-4 pt-20">
      <div className="relative z-10 mx-auto w-full max-w-xl p-4 bg-zinc-900 rounded-lg shadow-lg">
        <div className="mb-9 mt-6 space-y-1.5 text-center">
          <h1 className="text-2xl font-semibold text-white">Create your account</h1>
          <p className="text-zinc-400">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400">
              Sign in.
            </Link>
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-zinc-400">First Name</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              required
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 placeholder-zinc-500 ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-blue-700"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-zinc-400">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              required
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 placeholder-zinc-500 ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-blue-700"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-400">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 placeholder-zinc-500 ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-blue-700"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-400">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 placeholder-zinc-500 ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-blue-700"
            />
          </div>
          <Button
            type="submit"
            variant='primary' className="w-full bg-black  text-lg text-zinc-50 ring-2   transition-all hover:scale-[1.02] hover:ring-transparent active:scale-[0.98] active:ring-blue-500/70"
          >
            Sign Up
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
