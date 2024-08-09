import {useState} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './landingpage.css';

export const LandingPage = () => {

  const [liveReactions, setLiveReactions] = useState([]);

  const handleIconClick = (icon) => {
    setLiveReactions((prevReactions) => [...prevReactions, icon]);
    setTimeout(() => {
      setLiveReactions((prevReactions) => prevReactions.slice(1));
    }, 1000); 
  };


  const variants = {
    initial: {
      scale: 0.5,
      y: 50,
      opacity: 0,
    },
    animate: {
      scale: 1,
      y: 0,
      opacity: 1,
    },
  };

  const transition = {
    type: 'spring',
    mass: 3,
    stiffness: 150,
    damping: 50,
  };

  const specialVariants = {
    initial: { opacity: 0, y: -100 },
    animate: { opacity: 1, y: 0 },
  };

  const specialTransition = {
    duration: 0.8,
    ease: 'easeOut',
  };

  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.6,
      },
    },
  };

  const textVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
  };

  const iconVariants = {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1 },
  };

  const softBounce = {
    animate: {
      y: [0, -10, 0], 
      transition: {
        duration: 1.5,
        ease: 'easeInOut',
        repeat: Infinity,
      },
    },
  };

  const reactionVariant = {
    animate: {
      y: [-20, -50],
      opacity: [1, 0],
      transition: { duration: 1 },
    },
  };

  const floatingReactionVariant = {
    initial: { opacity: 1, y: 0, zIndex: 1 },
    animate: { opacity: 0, y: -300 }, 
    exit: { opacity: 0 },
    transition: { duration: 4.5, ease: 'easeOut' }, 
  };


  return (
    <div className="flex w-full flex-col h-screen items-center justify-center p-6 overflow-auto bg-black ">
      <div className="h-full w-full flex flex-col align-center justify-evenly max-w-7xl">
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="grid w-full h-40 grid-cols-10"
        >
          <motion.div
            variants={textVariants}
            transition={transition}
            className="col-span-8 flex justify-between items-center"
          >
            <div className="ml-4 text-left">
              <h1
                style={{ lineHeight: '1.5' }}
                className="text-3xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500"
              >
                10X Content Creation
              </h1>
              <span
                className="text-2xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400"
              >
                AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-red-400 to-green-400">✍️/🔊</span> for Every Social Platform
              </span>

            </div>
          </motion.div>

          <motion.div
            variants={textVariants}
            transition={transition}
            className="col-span-2 justify-end flex flex-col "
          >
            <motion.div
              variants={containerVariants}
              initial="initial"
              animate="animate"
              className="flex mb-2"
            >
              <motion.span
                variants={softBounce}
                className="mr-2 text-4xl cursor-pointer no-select"
                onClick={() => handleIconClick('🔥')}
              >
                🔥
              </motion.span>
              <motion.span
                variants={softBounce}
                className="mr-2 text-4xl cursor-pointer no-select"
                onClick={() => handleIconClick('❤️')}
              >
                ❤️
              </motion.span>
              <motion.span
                variants={softBounce}
                className="mr-2 text-4xl cursor-pointer no-select"
                onClick={() => handleIconClick('👍')}
              >
                👍
              </motion.span>
            </motion.div>

            <AnimatePresence>
              {liveReactions.map((icon, index) => (
                <motion.span
                  key={index}
                  className="absolute  text-4xl"
                  style={{ left: `${500}px`, bottom: '10px' }} 
                  variants={floatingReactionVariant}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  {icon}
                </motion.span>
              ))}
            </AnimatePresence>

            <h3 className="text-white text-xl md:text-lg">
              AI-Powered Tools to Create, Customize, and Convert Social Media Content Effortlessly
            </h3>
          </motion.div>
        </motion.div>

        <motion.div
          initial="initial"
          animate="animate"
          className="grid w-full h-[60%] grid-cols-4 md:grid-cols-10"
        >
          <motion.div
            variants={specialVariants}
            transition={specialTransition}
            className="col-span-4 md:col-span-6 flex flex-col justify-center gap-6 bg-slate-800 text-white mr-2 rounded-r-3xl rounded-tl-3xl"
          >
            <div className="m-4 p-4">
              <h1
                style={{ lineHeight: '2.5' }}
                className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500"
              >
                Consistent Branding
              </h1>
              <h3 className="text-lg md:text-2xl font-semibold text-white via-pink-400 to-red-400">
                Maintain Your Unique Voice Across All Channels with AI Precision
              </h3>
            </div>
          </motion.div>

          <motion.div
            variants={variants}
            transition={transition}
            className="col-span-4 md:col-span-2 flex flex-col items-center justify-center gap-6 bg-green-400 text-white p-4 md:p-6 text-center rounded-3xl mr-2"
          >
            <h2 className="text-2xl font-bold mb-2">Audio Generation</h2>
            <p className="text-center text-lg">Convert your text into engaging audio posts with AI.</p>
          </motion.div>

          <motion.div
            variants={variants}
            transition={transition}
            className="col-span-4 md:col-span-2 flex flex-col items-center justify-center gap-6 bg-blue-400 text-white p-4 md:p-6 text-center rounded-3xl"
          >
            <h2 className="text-2xl font-bold mb-2">Global Reach</h2>
            <p className="text-center text-lg">Expand your influence globally with multi-language AI content.</p>
          </motion.div>

          <motion.div
            variants={specialVariants}
            transition={specialTransition}
            className="col-span-4 md:col-span-4 flex flex-col items-center justify-center gap-6 bg-slate-800 text-white p-4 md:p-6 text-center rounded-bl-3xl rounded-br-3xl relative custom-top-right-corner"
          >
            <div className="flex p-4 rounded-lg w-full">
              <div className="flex items-start">
                <div className="flex space-x-[-10px]">
                  <div className="relative w-12 h-12 rounded-full flex items-center justify-center bg-blue-600 p-0.5 border-2 border-white">
                    <div className="w-full h-full rounded-full flex items-center justify-center">
                      <i className="fab fa-facebook-f text-white text-3xl"></i>
                    </div>
                  </div>
                  <div className="relative w-12 h-12 rounded-full flex items-center justify-center bg-blue-400 p-0.5 border-2 border-white">
                    <div className="w-full h-full rounded-full flex items-center justify-center">
                      <i className="fab fa-twitter text-white text-3xl"></i>
                    </div>
                  </div>
                  <div className="relative w-12 h-12 rounded-full flex items-center justify-center bg-blue-700 p-0.5 border-2 border-white">
                    <div className="w-full h-full rounded-full flex items-center justify-center">
                      <i className="fab fa-linkedin-in text-white text-3xl"></i>
                    </div>
                  </div>
                  <div className="relative w-12 h-12 rounded-full flex items-center justify-center bg-red-600 p-0.5 border-2 border-white">
                    <div className="w-full h-full rounded-full flex items-center justify-center">
                      <i className="fab fa-youtube text-white text-3xl"></i>
                    </div>
                  </div>
                </div>
                <div className="ml-4 text-gray-400 text-left">
                  <p>We offer many platforms</p>
                  <p>We're waiting for you</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={variants}
            transition={transition}
            className="col-span-4 md:col-span-4 flex flex-col items-center justify-center gap-6 bg-purple-400 text-white p-4 md:p-6 text-center rounded-3xl mt-2 ml-2 mr-2"
          >
            <h2 className="text-2xl font-bold mb-2">AI-Driven Insights</h2>
            <p className="text-center text-lg">Harness AI to gain deep insights and optimize your social media strategy.</p>
          </motion.div>

          <motion.div
            variants={variants}
            transition={transition}
            className="col-span-4 md:col-span-2 flex flex-col items-center justify-center gap-6 bg-yellow-400 text-white text-center rounded-3xl mt-2"
          >
            <h2 className="text-2xl font-bold mb-2">Creative Spark</h2>
            <p className="text-center text-lg">Get instant AI-powered inspiration for engaging content ideas.</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};


