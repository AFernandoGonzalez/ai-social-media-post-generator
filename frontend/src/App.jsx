import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import CampaignsPage from './pages/CampaignsPage';
import TopicsPage from './pages/TopicsPage';
import ContentPage from './pages/ContentPage';
import Layout from './components/Layout';
import Login from './components/Login';
import Signup from './components/Signup';
import LandingPage from './pages/LandingPage';
import Navbar from './components/Navbar';
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import ProtectedRoute from './contexts/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';

const App = () => {
  const location = useLocation();

  const renderNavbar = () => {
    if (location.pathname.startsWith('/dashboard')) {
      return null;
    }
    return <Navbar />;
  };

  return (
    <AuthProvider>
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
            </Route>
          </Route>
        </Routes>
        <ToastContainer />
      </div>
    </AuthProvider>
  );
};

export default App;
