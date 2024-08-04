import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { toast } from 'react-toastify';
import { useCampaigns } from '../contexts/CampaignsContext';
import SearchResults from './SearchResults';

const TopNav = ({ toggleSidebar }) => {
    const [user, setUser] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const { campaigns } = useCampaigns();
    const navigate = useNavigate();

    useEffect(() => {
        const loadUserProfile = () => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                const { uid, email, displayName, photoURL } = currentUser;
                const [firstName, lastName] = displayName ? displayName.split(' ') : ['Anonymous', ''];
                setUser({ uid, email, firstName, lastName, photoURL });
            } else {
                toast.error('Failed to load user profile.');
            }
        };

        loadUserProfile();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
            toast.success('Logged out successfully!');
        } catch (error) {
            toast.error('Failed to log out.');
            console.error('Logout error:', error);
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        if (e.target.value === '') {
            setSearchResults([]);
        } else {
            const query = e.target.value.toLowerCase();
            const filteredCampaigns = campaigns.filter(campaign =>
                campaign.title.toLowerCase().includes(query)
            ).map(campaign => ({ ...campaign, type: 'campaign' }));

            const filteredTopics = campaigns.reduce((acc, campaign) => {
                const campaignTopics = (campaign.topics || []).filter(topic =>
                    topic.title.toLowerCase().includes(query)
                ).map(topic => ({ ...topic, type: 'topic', campaignId: campaign._id }));
                return [...acc, ...campaignTopics];
            }, []);

            setSearchResults([...filteredCampaigns, ...filteredTopics]);
        }
    };

    const getProfileImage = () => {
        if (user.photoURL) {
            return user.photoURL;
        } else if (user.firstName && user.lastName) {
            return `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`;
        } else {
            return 'https://ui-avatars.com/api/?name=User&background=random';
        }
    };

    const handleSelect = () => {
        setSearchQuery('');
        setSearchResults([]);
    };

    return (
        <div className="bg-white shadow p-4 flex justify-between items-center relative">
            <div className="flex items-center w-full lg:w-auto">
                <button className="lg:hidden mr-4" onClick={toggleSidebar}>
                    <i className="fas fa-bars text-gray-700"></i>
                </button>
                <div className="relative w-full max-w-lg lg:max-w-xl">
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={handleSearch}
                        className="w-full border p-2 rounded focus:ring-blue-500 focus:border-blue-500"
                    />
                    <i className="fas fa-search absolute right-2 top-3 text-gray-400"></i>
                    {searchQuery && (
                        <SearchResults results={searchResults} onSelect={handleSelect} />
                    )}
                </div>
            </div>
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                <button className="relative">
                    <i className="fas fa-bell text-gray-600"></i>
                    <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full"></span>
                </button>
                <button className="relative">
                    <i className="fas fa-envelope text-gray-600"></i>
                    <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full"></span>
                </button>
                <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-700">Hello, {user.firstName}</span>
                    <img src={getProfileImage()} alt="Profile" className="w-8 h-8 rounded-full" />
                </div>
                <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-200" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default TopNav;
