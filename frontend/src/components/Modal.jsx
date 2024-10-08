import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const Modal = ({ isOpen, onClose, title, children, customHeight }) => {
    const { isDarkMode } = useTheme();

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                >
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className={`${isDarkMode ? 'bg-dark-surface text-dark-textPrimary' : 'bg-light-surface text-light-textPrimary'
                            } rounded-lg shadow-lg p-4 sm:p-8 w-full max-w-4xl h-[${customHeight}] max-h-[90vh] overflow-auto flex flex-col`}
                    >
                        <div className="flex justify-between items-center mb-4 sm:mb-6">
                            <h3 className={`text-lg sm:text-2xl font-bold ${isDarkMode ? 'text-dark-textPrimary' : 'text-light-textPrimary'}`}>
                                {title}
                            </h3>
                            <button
                                onClick={onClose}
                                className={`${isDarkMode ? 'text-dark-muted hover:text-dark-textPrimary' : 'text-light-muted hover:text-light-textPrimary'}`}
                            >
                                <i className="fas fa-times text-2xl"></i>
                            </button>
                        </div>
                        <div className="flex-grow overflow-auto">
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Modal;
