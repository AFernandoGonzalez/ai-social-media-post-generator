import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCampaigns } from '../services/api';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [expandedCampaigns, setExpandedCampaigns] = useState({});

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    const data = await getCampaigns();
    setCampaigns(data);
  };

  const toggleCampaign = (campaignId) => {
    setExpandedCampaigns((prev) => ({
      ...prev,
      [campaignId]: !prev[campaignId],
    }));
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  return (
    <div
      className={`fixed lg:static inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out bg-gray-900 text-white w-64 flex-shrink-0 p-4 flex flex-col h-screen z-50`}
    >
      <div className="flex items-center mb-6">
        <img src="path-to-your-logo.png" alt="Logo" className="w-8 h-8 mr-2" />
        <h2 className="text-2xl font-bold">AI SMG</h2>
        <button className="lg:hidden ml-auto" onClick={toggleSidebar}>
          <i className="fas fa-times"></i>
        </button>
      </div>
      <nav className="flex-grow">
        <ul>
          <li className="mb-4">
            <Link
              to="/"
              className="flex items-center p-2 hover:bg-gray-700 rounded"
              onClick={handleLinkClick}
            >
              <i className="fas fa-tachometer-alt mr-3"></i>
              Dashboard
            </Link>
          </li>

          <li className="mb-4">
            <h3 className="text-gray-400 text-xs uppercase px-2">Campaigns</h3>
            {campaigns.map((campaign) => (
              <div key={campaign._id} className="mb-2">
                <div
                  onClick={() => toggleCampaign(campaign._id)}
                  className="flex items-center p-2 hover:bg-gray-700 rounded cursor-pointer"
                >
                  <span className="flex-1">
                    <Link
                      to={`/campaigns/${campaign._id}`}
                      className="block text-lg font-semibold mb-2 hover:underline"
                      onClick={handleLinkClick}
                    >
                      {campaign.title.toUpperCase()}
                    </Link>
                  </span>
                  <i
                    className={`fas ${expandedCampaigns[campaign._id]
                        ? 'fa-chevron-up'
                        : 'fa-chevron-down'
                      } ml-3`}
                  ></i>
                </div>
                {expandedCampaigns[campaign._id] && (
                  <ul className="ml-6">
                    {campaign.topics.map((topic) => (
                      <li key={topic._id} className="mb-2">
                        <Link
                          to={`/topics/${topic._id}`}
                          className="hover:underline"
                          onClick={handleLinkClick}
                        >
                          {topic.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </li>
        
          <li className="mb-4">
            <h3 className="text-gray-400 text-xs uppercase px-2">Tools</h3>
            <Link
              to="/templates"
              className="flex items-center p-2 hover:bg-gray-700 rounded mt-2"
              onClick={handleLinkClick}
            >
              <i className="fas fa-th-list mr-3"></i>
              Templates
            </Link>
            <Link
              to="/generate"
              className="flex items-center p-2 hover:bg-gray-700 rounded mt-2"
              onClick={handleLinkClick}
            >
              <i className="fas fa-plus-circle mr-3"></i>
              Generate
            </Link>
            <Link
              to="/favorites"
              className="flex items-center p-2 hover:bg-gray-700 rounded mt-2"
              onClick={handleLinkClick}
            >
              <i className="fas fa-heart mr-3"></i>
              Favorites
            </Link>
          </li>
        </ul>
      </nav>
      <div className="mt-auto">
        <div className="flex items-center mb-4">
          <img
            src="path-to-your-profile-image"
            alt="Profile"
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <p className="text-sm font-semibold">Fernando</p>
            <p className="text-xs text-gray-400">Admin</p>
          </div>
        </div>
        <button className="w-full bg-blue-500 text-white py-2 rounded">
          Fun Plan
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
