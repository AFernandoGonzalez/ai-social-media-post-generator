import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const SearchResults = ({ results, loading, onSelect }) => {
    const { isDarkMode } = useTheme();

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
            className={`absolute w-full ${isDarkMode ? 'bg-dark-surface text-dark-textPrimary' : 'bg-light-surface text-light-textPrimary'} shadow-lg rounded mt-1 max-h-60 overflow-y-auto z-10`}
            role="list"
            aria-labelledby="search-results-heading"
        >
            <h2 id="search-results-heading" className="sr-only">Search Results</h2>
            {loading ? (
                <div className={`p-4 flex items-center ${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'}`}>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Searching...
                </div>
            ) : results.length === 0 ? (
                <div className={`p-4 ${isDarkMode ? 'text-dark-textSecondary' : 'text-light-textSecondary'} flex items-center`}>
                    <i className="fa fa-exclamation-circle text-red-500 mr-2"></i>
                    No results found
                </div>
            ) : (
                results.map(result => (
                    <motion.div key={result._id} variants={itemVariants}>
                        <Link
                            to={result.type === 'campaign' ? `/dashboard/campaigns/${result._id}` : `/dashboard/topics/${result._id}`}
                            className={`block p-4 hover:${isDarkMode ? 'bg-dark-hover' : 'bg-light-hover'} border-b ${isDarkMode ? 'border-dark-divider' : 'border-light-divider'} last:border-none transition-colors duration-200`}
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
