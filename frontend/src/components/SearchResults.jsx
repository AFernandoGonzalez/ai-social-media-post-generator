import React from 'react';
import { Link } from 'react-router-dom';

const SearchResults = ({ results, onSelect }) => {
    return (
        <div className="absolute w-full bg-white shadow-lg rounded mt-1 max-h-60 overflow-y-auto z-10">
            {results.length === 0 ? (
                <div className="p-4 text-gray-600">No results found</div>
            ) : (
                results.map(result => (
                    <Link
                        key={result._id}
                        to={result.type === 'campaign' ? `/dashboard/campaigns/${result._id}` : `/dashboard/topics/${result._id}`}
                        className="block p-4 hover:bg-gray-100 flex items-center"
                        onClick={() => onSelect()}
                    >
                        <i className={`fas ${result.type === 'campaign' ? 'fa-bullhorn' : 'fa-file-alt'} mr-2 text-${result.type === 'campaign' ? 'blue' : 'green'}-500`}></i>
                        <span className={`text-${result.type === 'campaign' ? 'blue' : 'green'}-500 underline`}>
                            {result.type === 'campaign' ? `Campaign: ${result.title}` : `Topic: ${result.title}`}
                        </span>
                    </Link>
                ))
            )}
        </div>
    );
};

export default SearchResults;
