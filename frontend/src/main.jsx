import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'react-toastify/dist/ReactToastify.css';

import { BrowserRouter } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import { CampaignsProvider } from './contexts/CampaignsContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <CampaignsProvider>
      <BrowserRouter>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </BrowserRouter>
    </CampaignsProvider>
  </AuthProvider>


)
