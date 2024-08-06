import React from 'react';

const Filters = ({ searchTerm, setSearchTerm, dateFilter, setDateFilter, topicFilter, setTopicFilter, minTopics, maxTopics }) => {
    return (
        <div className="mb-4 flex flex-col md:flex-row md:flex-wrap gap-4">
            <div className="w-full md:w-1/3 flex flex-col">
                <label className="text-sm text-gray-600">Search by title:</label>
                <input
                    type="text"
                    placeholder="Search by Title"
                    className="border p-2 rounded-md w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="w-full md:w-1/4 flex flex-col">
                <label className="text-sm text-gray-600">Filter by date:</label>
                <input
                    type="date"
                    placeholder="Filter by date"
                    className="border p-2 rounded-md w-full"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                />
            </div>
            <div className="w-full md:w-1/3 flex flex-col">
                <label className="text-sm text-gray-600">Filter by number of items:</label>
                <input
                    type="range"
                    min={minTopics}
                    max={maxTopics}
                    className="border p-2 rounded-md"
                    value={topicFilter}
                    onChange={(e) => setTopicFilter(e.target.value)}
                />
                <span className="text-sm text-gray-600">Selected: {topicFilter}</span>
            </div>
        </div>
    );
};

export default Filters;
