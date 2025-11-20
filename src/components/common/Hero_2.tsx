import * as React from "react";
import { motion } from "framer-motion";
import { JourneyButton } from '../JourneyButton';

export const Hero_2 = () => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const videoSrc = "/video/uganda video.mp4";

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log("Video autoplay failed:", error);
      });
    }
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black" style={{ minHeight: '100vh' }}>
      {/* Video Background */}
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Centered Content Container with extra top margin for spacing below logo */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 md:mt-[80px] mt-0">
        {/* Logo Container Above Headline - Only on HomePage Hero */}
        <div className="flex justify-center w-full absolute md:relative z-20 md:top-auto top-8 md:mt-[-100px] mt-0 md:mb-0 mb-0 md:pb-[40px] pb-0">
              <a 
                href="/" 
                className="cursor-pointer block"
                aria-label="Go to Homepage"
              >
                  <img
                    src="/images/Logo/Everything UG updated logo 1.png"
                    alt="Everything Uganda Logo"
                    className="hover:scale-105 transition-transform duration-300"
                    style={{
                      width: '150px',
                      height: '150px',
                      objectFit: 'contain',
                    }}
                  />
              </a>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-center max-w-5xl md:mt-[-60px] mt-[60px]"
          style={{ marginBottom: '0px', paddingTop: '0px' }}
        >
          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-2xl md:text-7xl font-bold text-white mb-3 md:mb-4 leading-tight"
            style={{
              textShadow: '2px 4px 8px rgba(0,0,0,0.7)',
              letterSpacing: '-0.02em',
              marginTop: '0px'
            }}
          >
            Step Into the Heart of Uganda.  
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-300 to-green-500">
              Untamed,Unseen,Unforgettable  
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-sm md:text-2xl text-gray-100 mb-4 md:mb-8 font-light"
            style={{ textShadow: '1px 2px 4px rgba(0,0,0,0.6)' }}
          >
            Where every story, smile and landscape has a soul.
          </motion.p>

          {/* Overlay Text Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-4 md:px-8 md:py-6 mb-6 md:mb-10 mx-auto max-w-2xl"
          >
            <p className="text-sm md:text-xl text-white font-light italic leading-relaxed">
              "This is not just another trip to Africa.
              <br />
              <span className="text-green-300 font-medium">
                It is your personal story with Uganda.
              </span>
              "
            </p>
          </motion.div>

          {/* Journey Button - smaller size */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="flex justify-center"
            style={{ marginTop: '-20px' }}
          >
            <div style={{ maxWidth: '260px', width: '100%' }}>
              <JourneyButton size="sm" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};