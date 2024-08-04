import React from 'react';
import { Link } from 'react-router-dom';

const SearchResults = ({ results, onSelect }) => {
    return (
        <div className="absolute w-full bg-white shadow-lg rounded mt-1 max-h-60 overflow-y-auto z-10">
            {results.length === 0 ? (
                <div className="p-4 text-gray-600 flex items-center">
                    <i className="fas fa-exclamation-circle text-red-500 mr-2"></i>
                    No results found
                </div>
            ) : (
                results.map(result => (
                    <Link
                        key={result._id}
                        to={result.type === 'campaign' ? `/dashboard/campaigns/${result._id}` : `/dashboard/topics/${result._id}`}
                        className="block p-4 hover:bg-gray-50 border-b border-gray-200 last:border-none"
                        onClick={() => onSelect()}
                    >
                        {result.type === 'campaign' ? (
                            <div className="flex items-center">
                                <i className="fas fa-bullhorn text-blue-500 mr-2"></i>
                                <span className="text-blue-500 font-medium">{result.title}</span>
                            </div>
                        ) : (
                            <div className="flex items-center">
                                <i className="fas fa-file-alt text-green-500 mr-2"></i>
                                <span className="text-green-500 font-medium">{result.title}</span>
                            </div>
                        )}
                    </Link>
                ))
            )}
        </div>
    );
};

export default SearchResults;
