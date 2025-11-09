import { motion } from "framer-motion";

export const SmallerHero = () => {
  return (
    <section className="relative w-full overflow-hidden" style={{ height: '300px' }}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/Logo/Artboard 1.jpg"
          alt="Uganda landscape"
          className="w-full h-full object-cover"
          style={{ 
            minWidth: '100%', 
            minHeight: '100%',
            objectFit: 'cover',
            objectPosition: 'center center'
          }}
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center md:text-left h-full flex flex-col justify-center px-4 md:pl-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-2xl md:text-5xl font-bold text-white mb-3 md:mb-4 leading-tight text-shadow-lg"
          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
        >
          Begin Your Journey to{" "}
          <span className="text-yellow-300">Uganda</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-sm md:text-xl text-white mb-4 md:mb-6 max-w-2xl font-medium mx-auto md:mx-0"
          style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}
        >
          Let's craft your perfect adventure. Share your travel dreams with us,
          and we'll create a personalized experience just for you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 md:gap-4 text-xs md:text-sm text-white font-medium"
          style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>3 Easy Steps</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Personalized Just for You</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
