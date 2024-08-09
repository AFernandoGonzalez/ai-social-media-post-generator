import React from 'react';

const AudioFilters = ({ searchTerm, setSearchTerm, dateFilter, setDateFilter }) => {
    return (
        <div className="mb-4 flex flex-col md:flex-row md:flex-wrap gap-4">
            <div className="w-full md:w-1/3 flex flex-col">
                <label className="text-sm text-gray-600">Search by Title:</label>
                <input
                    type="text"
                    placeholder="Search by Title"
                    className="border p-2 rounded-md w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="w-full md:w-1/4 flex flex-col">
                <label className="text-sm text-gray-600">Filter by Date:</label>
                <input
                    type="date"
                    placeholder="Filter by Date"
                    className="border p-2 rounded-md w-full"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                />
            </div>

            
        </div>
    );
};

export default AudioFilters;
