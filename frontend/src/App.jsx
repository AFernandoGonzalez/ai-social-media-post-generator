import React, { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import CampaignsPage from './pages/CampaignsPage';
import TopicsPage from './pages/TopicsPage';
import ContentPage from './pages/ContentPage';
import Layout from './components/Layout';
import Login from './components/Login';
import Signup from './components/Signup';
import {LandingPage} from './pages/LandingPage';
import Navbar from './components/Navbar';
import { useAuth } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './contexts/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import Loading from './components/Loading';
import TextToSpeechForm from './components/TextToSpeechForm';
import NotFound from './pages/NotFound';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user && (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup')) {
        navigate('/dashboard');
      }
    }
  }, [user, loading, location, navigate]);

  const renderNavbar = () => {
    if (location.pathname.startsWith('/dashboard')) {
      return null;
    }
    return <Navbar />;
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-full overflow-hidden">
      {renderNavbar()}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />

        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="campaigns" element={<CampaignsPage />} />
            <Route path="campaigns/:id" element={<TopicsPage />} />
            <Route path="topics/:id" element={<ContentPage />} />
            <Route path="audio" element={<TextToSpeechForm />} />
            {/* <Route path="image" element={<ImageForm />} /> */}
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} /> 
      </Routes>
      <ToastContainer />
    </div>
  );
};

export default App;
