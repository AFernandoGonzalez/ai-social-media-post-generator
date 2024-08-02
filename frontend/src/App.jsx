import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CampaignsPage from './pages/CampaignsPage';
import TopicsPage from './pages/TopicsPage';
import ContentPage from './pages/ContentPage';
import Sidebar from './components/Sidebar';

const App = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-4">
        <Routes>
          <Route path="/" exact element={<CampaignsPage />} />
          <Route path="/campaigns/:id" element={<TopicsPage />} />
          <Route path="/topics/:id" element={<ContentPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
