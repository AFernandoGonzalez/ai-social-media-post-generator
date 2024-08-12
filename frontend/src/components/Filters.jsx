import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Filters = ({ searchTerm, setSearchTerm, dateFilter, setDateFilter, topicFilter, setTopicFilter, minTopics, maxTopics }) => {
    const { isDarkMode } = useTheme();

    return (
        <div className="mb-4 flex flex-col md:flex-row md:flex-wrap gap-4">
            <div className="w-full md:w-1/3 flex flex-col">
                <label className={`${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'} text-sm`}>Search by title:</label>
                <input
                    type="text"
                    placeholder="Search by Title"
                    className={`${isDarkMode ? 'bg-dark-surface text-dark-textPrimary border-dark-border' : 'bg-light-surface text-light-textPrimary border-light-border'} border p-2 rounded-md w-full`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="w-full md:w-1/4 flex flex-col">
                <label className={`${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'} text-sm`}>Filter by date:</label>
                <input
                    type="date"
                    placeholder="Filter by date"
                    className={`${isDarkMode ? 'bg-dark-surface text-dark-textPrimary border-dark-border' : 'bg-light-surface text-light-textPrimary border-light-border'} border p-2 rounded-md w-full`}
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                />
            </div>
            <div className="w-full md:w-1/3 flex flex-col">
                <label className={`${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'} text-sm`}>Filter by number of items:</label>
                <input
                    type="range"
                    min={minTopics}
                    max={maxTopics}
                    className={`${isDarkMode ? 'bg-dark-surface text-dark-textPrimary border-dark-border' : 'bg-light-surface text-light-textPrimary border-light-border'} border p-2 rounded-md`}
                    value={topicFilter}
                    onChange={(e) => setTopicFilter(e.target.value)}
                />
                <span className={`${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'} text-sm`}>Selected: {topicFilter}</span>
            </div>
        </div>
    );
};

export default Filters;
