import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const AudioFilters = ({ searchTerm, setSearchTerm, dateFilter, setDateFilter }) => {
    const { isDarkMode } = useTheme();

    return (
        <div className="mb-4 flex flex-col md:flex-row md:flex-wrap gap-4">
            <div className="w-full md:w-1/3 flex flex-col">
                <label className={`text-sm ${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'}`}>
                    Search by Title:
                </label>
                <input
                    type="text"
                    placeholder="Search by Title"
                    className={`border p-2 rounded-md w-full ${isDarkMode ? 'bg-dark-surface text-dark-textPrimary border-dark-border' : 'bg-light-surface text-light-textPrimary border-light-border'}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="w-full md:w-1/4 flex flex-col">
                <label className={`text-sm ${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'}`}>
                    Filter by Date:
                </label>
                <input
                    type="date"
                    placeholder="Filter by Date"
                    className={`border p-2 rounded-md w-full ${isDarkMode ? 'bg-dark-surface text-dark-textPrimary border-dark-border' : 'bg-light-surface text-light-textPrimary border-light-border'}`}
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                />
            </div>
        </div>
    );
};

export default AudioFilters;
