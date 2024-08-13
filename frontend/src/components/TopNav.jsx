import React, { useState, useEffect, useRef } from 'react';
import { auth } from '../config/firebaseConfig';
import { toast } from 'react-toastify';
import { useCampaigns } from '../contexts/CampaignsContext';
import SearchResults from './SearchResults';
import Button from './Button';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const TopNav = ({ toggleSidebar }) => {
    const [user, setUser] = useState({});
    const searchContainerRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const { campaigns } = useCampaigns();
    const { isDarkMode } = useTheme();
    const debounceTimeout = useRef(null);

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
        const query = e.target.value;
        setSearchQuery(query);

        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(() => {
            if (query === '') {
                setSearchResults([]);
            } else {
                const loweredQuery = query.toLowerCase();
                const filteredCampaigns = campaigns.filter(campaign =>
                    campaign.title.toLowerCase().includes(loweredQuery)
                ).map(campaign => ({ ...campaign, type: 'campaign' }));

                const filteredTopics = campaigns.reduce((acc, campaign) => {
                    const campaignTopics = (campaign.topics || []).filter(topic =>
                        topic.title.toLowerCase().includes(loweredQuery)
                    ).map(topic => ({ ...topic, type: 'topic', campaignId: campaign._id }));
                    return [...acc, ...campaignTopics];
                }, []);

                setSearchResults([...filteredCampaigns, ...filteredTopics]);
            }
        }, 3000); 
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
        <div className={`shadow p-4 flex justify-between items-center relative ${isDarkMode ? 'bg-dark-background text-dark-textPrimary' : 'bg-light-background text-light-textPrimary'}`}>
    <div className="flex items-center w-full lg:w-auto mr-4">
        <Link onClick={toggleSidebar} className="m-2 lg:hidden py-1" aria-label="Toggle Sidebar">
            <i className={`fas fa-bars text-xl ${isDarkMode ? 'text-dark-textTertiary' : 'text-light-textTertiary'}`}></i>
        </Link>
        <div ref={searchContainerRef} className="relative w-full md:w-[500px]">
            <input
                type="text"
                placeholder="Search a Campaign or Topic"
                value={searchQuery}
                onChange={handleSearch}
                className={`w-full border p-2 rounded focus:ring-main-accent focus:border-main-accent ${isDarkMode ? 'bg-dark-surface text-dark-textPrimary border-dark-border' : 'bg-light-surface text-light-textPrimary border-light-border'}`}
                aria-label="Search Campaigns or Topics"
            />
            {searchQuery && (
                <Button onClick={clearSearch} variant="default" className={`absolute right-0 top-0 py-1 px-1 ${isDarkMode ? 'text-dark-textPrimary bg-dark-background hover:bg-dark-hover' : 'text-light-textPrimary bg-light-surface hover:bg-light-hover'}`} aria-label="Clear Search">
                    <i className="fas fa-times"></i>
                </Button>
            )}
            {searchQuery && (
                <SearchResults results={searchResults} onSelect={handleSelect} />
            )}
        </div>
    </div>
    <div className="flex items-center justify-between space-x-4">
    <div className="flex items-center space-x-2">
        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12">
            <img 
                src={getProfileImage()} 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover" 
            />
        </div>
    </div>
</div>

</div>

    );
};

export default TopNav;
