import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const { isDarkMode } = useTheme();

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    return (
        <div className="flex justify-center mt-6">
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 mx-1 ${isDarkMode ? 'bg-dark-active text-dark-textPrimary' : 'bg-light-active text-light-textPrimary'} rounded disabled:opacity-50`}
            >
                Previous
            </button>
            {[...Array(totalPages).keys()].map(page => (
                <button
                    key={page + 1}
                    onClick={() => handlePageChange(page + 1)}
                    className={`px-3 py-1 mx-1 rounded ${currentPage === page + 1 ? `${isDarkMode ? 'bg-dark-surface text-dark-textPrimary border border-dark-border' : 'bg-light-surface text-light-textPrimary border border-light-border'}` : `${isDarkMode ? 'bg-dark-active text-dark-textPrimary' : 'bg-light-active text-light-textPrimary'}`}`}
                >
                    {page + 1}
                </button>
            ))}
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 mx-1 ${isDarkMode ? 'bg-dark-active text-dark-textPrimary' : 'bg-light-active text-light-textPrimary'} rounded disabled:opacity-50`}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
