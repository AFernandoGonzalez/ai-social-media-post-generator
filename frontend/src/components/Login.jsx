import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { createUserInDB } from '../services/api';
import { getFriendlyErrorMessage } from '../utils/errorMessages';
import { toast } from 'react-toastify';
import Button from './Button';


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
    <div className="bg-black min-h-screen pt-20 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
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
          <Button type="submit" variant="primary" className="w-full mb-4">
            Login
          </Button>
        </form>
        <Button onClick={handleGoogleLogin} variant="danger" className="w-full mb-4">
          Login with Google
        </Button>
        <Button onClick={handleGithubLogin} variant="secondary" className="w-full mb-4">
          Login with GitHub
        </Button>
        <div className="mt-4 text-center">
          <span>Don't have an account? </span>
          <Link to="/signup" className="text-blue-600">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
