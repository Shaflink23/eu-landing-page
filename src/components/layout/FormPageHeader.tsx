import { motion } from "framer-motion";

export const FormPageHeader = () => {
  return (
    <>
      {/* Travel Advisory Banner */}
      <div className="w-full bg-yellow-50 border-b border-yellow-200 py-2 px-2 md:px-4 text-center">
        <p className="text-xs md:text-sm text-yellow-800">
          <span className="font-semibold">Important !</span> Travel Advisory{" "}
          <a 
            href="https://visas.immigration.go.ug/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-pink-600 font-semibold hover:underline"
          >
            Learn More
          </a>
        </p>
      </div>

      {/* Header with Logo */}
      <header className="w-full bg-white border-b border-gray-200 py-3 md:py-4 px-4 md:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <a href="/" className="cursor-pointer">
              <img
                src="/images/Logo/Everything UG updated logo 1.png"
                alt="Everything Uganda Logo"
                className="h-8 md:h-12 w-auto object-contain hover:opacity-80 transition-opacity"
              />
            </a>
          </motion.div>

          {/* Optional: Add navigation or tagline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:block"
          >
            <p className="text-sm text-gray-600 italic">
              Your Journey Starts Here
            </p>
          </motion.div>
        </div>
      </header>
    </>
  );
};
