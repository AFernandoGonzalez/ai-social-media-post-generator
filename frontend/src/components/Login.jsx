import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { createUserInDB } from '../services/api';
import { getFriendlyErrorMessage } from '../utils/errorMessages';
import Button from './Button';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import useCustomToast from '../utils/useCustomToast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const showToast = useCustomToast();


  const handleFirebaseAuth = async (user) => {
    const { uid, email, displayName } = user;
    try {
      await createUserInDB(uid, email, displayName || 'Anonymous');
    } catch (error) {
      console.error('Database error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await handleFirebaseAuth(userCredential.user);
      showToast('Logged in successfully!', 'success', '🔓');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      showToast(getFriendlyErrorMessage(error.code), 'error', '❗');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      await handleFirebaseAuth(userCredential.user);
      showToast('Logged in with Google!', 'success', '🔓');
      navigate('/dashboard');
    } catch (error) {
      console.error('Google login error:', error);
      showToast(getFriendlyErrorMessage(error.code), 'error', '❗');
    }
  };

  const handleGithubLogin = async () => {
    try {
      const provider = new GithubAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      await handleFirebaseAuth(userCredential.user);
      showToast('Logged in with GitHub!', 'success', '🔓');
      navigate('/dashboard');
    } catch (error) {
      console.error('GitHub login error:', error);
      showToast(getFriendlyErrorMessage(error.code), 'error', '❗');
    }
  };

  return (
    <div className="bg-black min-h-screen flex items-center justify-center p-4 pt-20">
      <div className="relative z-10 mx-auto w-full max-w-xl p-4 bg-zinc-900 rounded-lg shadow-lg">
        <div className="mb-9 mt-6 space-y-1.5 text-center">
          <h1 className="text-2xl font-semibold text-white">Sign in to your account</h1>
          <p className="text-zinc-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-400">
              Create one.
            </Link>
          </p>
        </div>
        <div className="mb-3 flex gap-3">
          <Button onClick={handleGoogleLogin} className="w-full flex justify-center" variant="secondary">
            <FaGoogle className="mr-2" /> Sign in with Google
          </Button>
          <Button onClick={handleGithubLogin} className="w-full flex justify-center" variant="secondary">
            <FaGithub className="mr-2" /> Sign in with GitHub
          </Button>
        </div>
        <div className="my-6 flex items-center gap-3">
          <div className="h-[1px] w-full bg-zinc-700"></div>
          <span className="text-zinc-400">OR</span>
          <div className="h-[1px] w-full bg-zinc-700"></div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email-input" className="mb-1.5 block text-zinc-400">
              Email
            </label>
            <input
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@provider.com"
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 placeholder-zinc-500 ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-blue-700"
              required
            />
          </div>
          <div className="mb-6">
            <div className="mb-1.5 flex items-end justify-between">
              <label htmlFor="password-input" className="block text-zinc-400">
                Password
              </label>
              
            </div>
            <input
              id="password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 placeholder-zinc-500 ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-blue-700"
              required
            />
          </div>
        
          <Button type="submit" variant='primary' className="w-full bg-black  text-lg text-zinc-50 ring-2   transition-all hover:scale-[1.02] hover:ring-transparent active:scale-[0.98] active:ring-blue-500/70">
            Sign in
          </Button>
        </form>
        
      </div>
    </div>
  );
};

export default Login;
