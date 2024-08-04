import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { createUserInDB } from '../services/api';
import { getFriendlyErrorMessage } from '../utils/errorMessages';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleFirebaseAuth = async (user) => {
    const { uid, email, displayName } = user;
    try {
      await createUserInDB(uid, email, displayName || 'Anonymous');
    } catch (error) {
      toast.error('Failed to create user in DB');
      console.error('Database error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await handleFirebaseAuth(userCredential.user);
      toast.success('Logged in successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(getFriendlyErrorMessage(error.code));
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      await handleFirebaseAuth(userCredential.user);
      toast.success('Logged in with Google!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Google login error:', error);
      toast.error(getFriendlyErrorMessage(error.code));
    }
  };

  const handleGithubLogin = async () => {
    try {
      const provider = new GithubAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      await handleFirebaseAuth(userCredential.user);
      toast.success('Logged in with GitHub!');
      navigate('/dashboard');
    } catch (error) {
      console.error('GitHub login error:', error);
      toast.error(getFriendlyErrorMessage(error.code));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded mb-4"
          >
            Login
          </button>
        </form>
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-red-600 text-white p-2 rounded mb-4"
        >
          Login with Google
        </button>
        <button
          onClick={handleGithubLogin}
          className="w-full bg-gray-800 text-white p-2 rounded mb-4"
        >
          Login with GitHub
        </button>
        <div className="mt-4 text-center">
          <span>Don't have an account? </span>
          <a href="/signup" className="text-blue-600">Sign Up</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
