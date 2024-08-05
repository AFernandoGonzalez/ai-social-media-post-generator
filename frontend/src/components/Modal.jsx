import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
// import { FiAlertCircle } from 'react-icons/fi';

const Modal = ({ isOpen, onClose, title, children }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto"
                >
                    <motion.div
                        initial={{ scale: 0, rotate: "12.5deg" }}
                        animate={{ scale: 1, rotate: "0deg" }}
                        exit={{ scale: 0, rotate: "0deg" }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2"
                    >
                        <div className="text-gray-300 text-6xl absolute z-0 -top-4 -left-4" />
                        <div className="relative z-10">
                            <div className="flex items-center justify-center mb-4">
                                <div className="text-3xl text-indigo-500" />
                            </div>
                            <h3 className="text-xl font-bold text-center mb-4">{title}</h3>
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Modal;
