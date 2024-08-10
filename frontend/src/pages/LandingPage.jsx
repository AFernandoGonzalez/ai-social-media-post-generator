import { useState } from 'react';
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

    <div className="flex w-full flex-col min-h-screen h-full items-center justify-center p-6 bg-black mt-14 md:mt-0">
      <div className="flex flex-col flex-grow justify-evenly w-full max-w-7xl">

        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="w-full h-full md:h-40 flex flex-col lg:flex-row justify-between "
        >
          <motion.div
            variants={textVariants}
            transition={transition}
            className="flex flex-col justify-center md:flex-row md:justify-between items-center flex-1 md:flex-[3_3_0%] lg:flex-[4_4_0%] px-4 md:px-6"
          >
            <div className="w-full ">
              <h1
                className="text-[34px] sm:text-[34px] md:text-[40px] lg:text-[50px] xl:text-[60px] leading-tight sm:leading-[1.8] md:leading-[1.8] lg:leading-[1.8] xl:leading-[1.8] font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500"
              >
                10X Content Creation
              </h1>

              <span
                className="block mt-2 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400"
              >
                AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-red-400 to-green-400">✍️/🔊</span> for Every Social Platform
              </span>
            </div>
          </motion.div>

          <motion.div
            variants={textVariants}
            transition={transition}
            className="flex flex-col items-start  justify-start lg:justify-end   flex-1 md:flex-[1_1_0%] lg:flex-[2_2_0%] px-4 mb-2 md:px-6"
          >
            <motion.div
              variants={containerVariants}
              initial="initial"
              animate="animate"
              className="flex mt-2"
            >
              <motion.span
                variants={softBounce}
                className="mr-1 sm:mr-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl cursor-pointer no-select"
                onClick={() => handleIconClick('🔥')}
              >
                🔥
              </motion.span>
              <motion.span
                variants={softBounce}
                className="mr-1 sm:mr-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl cursor-pointer no-select"
                onClick={() => handleIconClick('❤️')}
              >
                ❤️
              </motion.span>
              <motion.span
                variants={softBounce}
                className="mr-1 sm:mr-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl cursor-pointer no-select"
                onClick={() => handleIconClick('👍')}
              >
                👍
              </motion.span>
            </motion.div>

            <AnimatePresence>
              {liveReactions.map((icon, index) => (
                <motion.span
                  key={index}
                  className="absolute text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
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

            <h3 className="text-white text-sm sm:text-base md:text-sm lg:text-sm xl:text-md mt-4  md:mt-2">
              AI-Powered Tools to Create, Customize, and Convert Social Media Content Effortlessly
            </h3>

          </motion.div>
        </motion.div>


        <motion.div
          initial="initial"
          animate="animate"
          className="grid w-full md:h-[60%] grid-cols-4 md:grid-cols-10"
        >
          <motion.div
            variants={specialVariants}
            transition={specialTransition}
            className="col-span-4 m-2 rounded-bl-3xl md:rounded-bl-none md:col-span-6 md:m-0 flex flex-col justify-center gap-2 bg-slate-800 mr-2 rounded-r-3xl rounded-tl-3xl"
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
            className="col-span-4 rounded-3xl m-2 md:col-span-2 flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-blue-400 via-teal-500 to-green-400 p-4  text-center rounded-3xl mr-2"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full">
            
              <i className="fas fa-microphone-alt text-4xl text-blue-600"></i>
            </div>

            <h2 className="font-bold text-white mt-4">
              Audio Generation
            </h2>

            <p className="text-center text-white text-lg">
              Convert your text into engaging audio posts with AI.
            </p>
          </motion.div>


          <motion.div
            variants={variants}
            transition={transition}
            className="col-span-4 rounded-3xl m-2 md:col-span-2 flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 via-blue-400 to-teal-400 p-4  text-center rounded-3xl"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full">
            
              <i className="fas fa-globe text-4xl text-indigo-600"></i>
            </div>

            <h2 className="font-bold text-white mt-4">
              Global Reach
            </h2>

            <p className="text-center text-white text-lg">
              Expand your influence globally with multi-language AI content.
            </p>
          </motion.div>


          <motion.div
            variants={specialVariants}
            transition={specialTransition}
            className="col-span-4 m-2 rounded-tl-3xl md:rounded-tl-none md:col-span-4 md:m-0 flex flex-col items-center justify-center gap-2 bg-slate-800 text-white text-center rounded-bl-3xl rounded-br-3xl relative hidden md:flex custom-top-right-corner  "
          >
            <div className=" flex p-4 rounded-lg w-full">
              <div className="flex items-start m-4">
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
            className="col-span-4 rounded-3xl m-2 md:col-span-4 flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-4  text-center rounded-3xl"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full">
           
              <i className="fas fa-lightbulb text-4xl text-purple-600"></i>
            </div>

            <h2 className="font-bold text-white mt-4">
              AI-Driven Insights
            </h2>

            <p className="text-center text-white text-lg">
              Harness AI to gain deep insights and optimize your social media strategy.
            </p>
          </motion.div>


          <motion.div
            variants={variants}
            transition={transition}
            className="col-span-4 rounded-3xl m-2 md:col-span-2 flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-green-400 via-teal-500 to-blue-500 p-4  text-center rounded-3xl"
          >
            <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full">
           
              <i className="fas fa-star text-4xl text-green-600"></i>
            </div>

            <h2 className="font-bold text-white mt-4">
              Creative Spark
            </h2>

            <p className="text-center text-white text-lg">
              Get instant AI-powered inspiration for engaging content ideas.
            </p>
          </motion.div>


        </motion.div>


      </div>
    </div>
  );
};


