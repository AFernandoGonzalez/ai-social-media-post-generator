import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CampaignsPage from './pages/CampaignsPage';
import TopicsPage from './pages/TopicsPage';
import ContentPage from './pages/ContentPage';
import Layout from './components/Layout';

const App = () => {
  return (
    <div className="max-w-full overflow-hidden">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<CampaignsPage />} />
          <Route path="campaigns/:id" element={<TopicsPage />} />
          <Route path="topics/:id" element={<ContentPage />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
