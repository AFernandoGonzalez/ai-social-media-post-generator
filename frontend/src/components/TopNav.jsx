import React, { useState, useEffect, useRef } from 'react';
import { auth } from '../config/firebaseConfig';
import { toast } from 'react-toastify';
import { useCampaigns } from '../contexts/CampaignsContext';
import SearchResults from './SearchResults';
import Button from './Button';

const TopNav = ({ toggleSidebar }) => {
    const [user, setUser] = useState({});
    const searchContainerRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const { campaigns } = useCampaigns();

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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setSearchResults([]);
                clearSearch();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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

    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
    };

    return (
        <div className="bg-white shadow p-4 flex justify-between items-center relative">
            <div className="flex items-center w-full lg:w-auto mr-4">
                <Button onClick={toggleSidebar} className="lg:hidden mr-4" variant="default">
                    <i className="fas fa-bars text-gray-700"></i>
                </Button>
                <div ref={searchContainerRef} className="relative w-full md:w-[500px]">
                    <input
                        type="text"
                        placeholder="Search a Campaign or Topic"
                        value={searchQuery}
                        onChange={handleSearch}
                        className="w-full border p-2 rounded focus:ring-blue-500 focus:border-blue-500"
                    />
                    {searchQuery && (
                        <Button onClick={clearSearch} variant="default" className="absolute right-2 top-2 text-gray-400">
                            <i className="fas fa-times"></i>
                        </Button>
                    )}
                    {searchQuery && (
                        <SearchResults results={searchResults} onSelect={handleSelect} />
                    )}
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-700">Hello, {user.firstName}</span>
                    <img src={getProfileImage()} alt="Profile" className="w-8 h-8 rounded-full" />
                </div>
            </div>
        </div>
    );
};

export default TopNav;
