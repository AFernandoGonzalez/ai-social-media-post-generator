import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const SearchResults = ({ results, onSelect }) => {
    const listVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: {
            opacity: 1, y: 0,
            transition: {
                when: 'beforeChildren',
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={listVariants}
            className="absolute w-full bg-white dark:bg-gray-800 shadow-lg rounded mt-1 max-h-60 overflow-y-auto z-10"
            role="list"
            aria-labelledby="search-results-heading"
        >
            <h2 id="search-results-heading" className="sr-only">Search Results</h2>
            {results.length === 0 ? (
                <div className="p-4 text-gray-600 dark:text-gray-300 flex items-center">
                    <i className="fa fa-exclamation-circle text-red-500 mr-2"></i>
                    No results found
                </div>
            ) : (
                results.map(result => (
                    <motion.div key={result._id} variants={itemVariants}>
                        <Link
                            to={result.type === 'campaign' ? `/dashboard/campaigns/${result._id}` : `/dashboard/topics/${result._id}`}
                            className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700 last:border-none transition-colors duration-200"
                            onClick={() => onSelect()}
                            role="listitem"
                            tabIndex="0"
                            aria-label={`View ${result.title}`}
                        >
                            <div className="flex items-center">
                                <i className={`fa ${result.type === 'campaign' ? 'fa-bullhorn text-blue-500' : 'fa-file-alt text-green-500'} mr-2`}></i>
                                <span className={`${result.type === 'campaign' ? 'text-blue-500' : 'text-green-500'} font-medium`}>{result.title}</span>
                            </div>
                        </Link>
                    </motion.div>
                ))
            )}
        </motion.div>
    );
};

export default SearchResults;
