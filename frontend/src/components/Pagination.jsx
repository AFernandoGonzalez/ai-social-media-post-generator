import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
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
                className="px-3 py-1 mx-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
            >
                Previous
            </button>
            {[...Array(totalPages).keys()].map(page => (
                <button
                    key={page + 1}
                    onClick={() => handlePageChange(page + 1)}
                    className={`px-3 py-1 mx-1 rounded ${currentPage === page + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                >
                    {page + 1}
                </button>
            ))}
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 mx-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
