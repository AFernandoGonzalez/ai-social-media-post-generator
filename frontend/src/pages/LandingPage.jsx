import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';

// const socket = io(import.meta.env.VITE_API_BASE_URL_SOCKET);

const LandingPage = () => {
  const [liveReactions, setLiveReactions] = useState([]);

  // useEffect(() => {
  //   socket.on('iconClicked', (icon) => {
  //     setLiveReactions((prevReactions) => [...prevReactions, icon]);
  //     setTimeout(() => {
  //       setLiveReactions((prevReactions) => prevReactions.filter((_, index) => index !== 0));
  //     }, 1000);
  //   });

  //   return () => {
  //     socket.off('iconClicked');
  //   };
  // }, []);

  const handleIconClick = (icon) => {
    // socket.emit('iconClicked', icon);
    setLiveReactions((prevReactions) => [...prevReactions, icon]);
    setTimeout(() => {
      setLiveReactions((prevReactions) => prevReactions.filter((_, index) => index !== 0));
    }, 1000); 
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 relative">
      <section className="flex-grow px-8 py-10 text-slate-50 w-full flex items-center justify-center">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 md:grid-cols-2 md:gap-8 mt-[5rem]">
          <div>
            <h3 className="text-5xl font-black leading-[1.25] md:text-6xl">
              Create Engaging <span className="text-purple-600">Social Media</span> Content Effortlessly
            </h3>
            <p className="mb-8 mt-4 text-lg text-white">
              The AI Social Media Post Generator is a SaaS platform designed to help businesses and individuals create high-quality, consistent, and engaging social media content across multiple platforms.
            </p>
            <div className="flex items-center gap-2">
              <Link to="/login" className="whitespace-nowrap rounded bg-indigo-600 px-3 py-2 transition-transform hover:scale-[1.02] active:scale-[0.98]">
                Get Started
              </Link>
              <div className=" bottom-4 w-full flex justify">
                <div className="flex space-x-4  p-4 rounded-full shadow-lg">
                  {['thumbs-up', 'heart', 'laugh', 'surprise', 'sad-cry'].map((icon) => (
                    <motion.div
                      key={icon}
                      className="relative"
                    >
                      <motion.i
                        className={`far fa-${icon} text-2xl cursor-pointer ${icon === 'thumbs-up' ? 'text-blue-600' :
                          icon === 'heart' ? 'text-red-500' :
                            icon === 'laugh' ? 'text-yellow-500' :
                              icon === 'surprise' ? 'text-purple-500' : 'text-teal-500'
                          }`}
                        whileHover={{ scale: 1.2 }}
                        onClick={() => handleIconClick(icon)}
                      ></motion.i>
                      {liveReactions.map((reaction, index) => (
                        reaction === icon && (
                          <AnimatePresence key={index}>
                            <motion.i
                              className={`far fa-${icon} text-2xl absolute bottom-0 left-1/2 transform -translate-x-1/2 ${icon === 'thumbs-up' ? 'text-blue-600' :
                                icon === 'heart' ? 'text-red-500' :
                                  icon === 'laugh' ? 'text-yellow-500' :
                                    icon === 'surprise' ? 'text-purple-500' : 'text-teal-500'
                                }`}
                              initial={{ opacity: 1, y: 0 }}
                              animate={{ opacity: 0, y: -400 }}
                              transition={{ duration: 1, ease: 'easeOut' }}
                            ></motion.i>
                          </AnimatePresence>
                        )
                      ))}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
            
          </div>
          <div className="relative h-[450px] w-full max-w-[350px] mx-auto">
    
            <div
              className="absolute left-0 top-0 grid h-[450px] w-[350px] select-none place-content-center space-y-6 rounded-2xl border-2 border-pink-500 bg-pink-100 p-6 shadow-xl backdrop-blur-md"
              style={{ zIndex: 0, transform: 'translateX(66%) translateY(0px) rotate(6deg) translateZ(0px)' }}
            >
              <div className="flex justify-center">
                <i className="fab fa-instagram text-pink-500 text-6xl"></i>
              </div>
              <span className="text-center text-lg italic text-pink-500">
                "The AI Social Media Post Generator has transformed the way we create content. It's like having a full-time social media manager."
              </span>
              <span className="text-center text-sm font-medium text-pink-600">Instagram Caption</span>
            </div>

            <div
              className="absolute left-0 top-0 grid h-[450px] w-[350px] select-none place-content-center space-y-6 rounded-2xl border-2 border-blue-500 bg-blue-100 p-6 shadow-xl backdrop-blur-md cursor-grab active:cursor-grabbing"
              style={{ zIndex: 2, transform: 'translateX(0%) translateY(0px) rotate(-6deg) translateZ(0px)', userSelect: 'none', touchAction: 'none' }}
              draggable="false"
            >
              <div className="flex items-center space-x-2">
                <i className="fab fa-twitter text-blue-500 text-3xl"></i>
                <span className="font-bold text-blue-500">Twitter</span>
              </div>
              <span className="text-center text-lg text-blue-500">
                Excited to launch our new AI Social Media Post Generator! 🚀 Create engaging content with just a few clicks. #AI #aiSocialMedia
              </span>
              <div className="rounded-lg overflow-hidden shadow-md w-full bg-white">
                <div className="p-4">
                  <span className="block text-sm font-medium text-gray-800">AI Social Media Post Generator</span>
                  <span className="block text-xs text-gray-500">ai-social-media-post-generator.vercel.app</span>
                </div>
              </div>
              <div className="flex items-center justify-between w-full text-gray-500 text-sm">
                <span><i className="far fa-heart"></i> 1200</span>
                <span>2:15 PM - Aug 4, 2024</span>
              </div>
              <span className="text-xs text-blue-500">
                <i className="far fa-comment pr-1"></i>
                850 people are talking about this
              </span>
            </div>
            <div
              className="absolute left-0 top-0 grid h-[450px] w-[350px] select-none place-content-center space-y-6 rounded-2xl border-2 border-red-500 bg-red-100 p-6 shadow-xl backdrop-blur-md"
              style={{ zIndex: 1, transform: 'translateX(33%) translateY(0px) rotate(0deg) translateZ(0px)' }}
            >
              <i className="fab fa-youtube text-red-500 text-6xl"></i>
              <span className="text-center text-lg italic text-red-500">
                "This tool has saved me countless hours of work and significantly boosted our social media presence."
              </span>
              <span className="text-center text-sm font-medium text-red-600">YouTube Titles</span>
            </div>
          </div>
        </div>
      </section>
     
    </div>
  );
};

export default LandingPage;
