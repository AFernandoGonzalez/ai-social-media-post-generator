import React from 'react';
import { motion } from 'framer-motion';

const LandingPageLoading = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="text-center">
                <motion.div
                    className="text-4xl md:text-[10rem] mb-4"
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    📱🤖🔊📝
                </motion.div>
            </div>
        </div>
    );
};

export default LandingPageLoading;
