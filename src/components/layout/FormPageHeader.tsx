import { motion } from "framer-motion";

export const FormPageHeader = () => {
  return (
    <>


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
            className="block"
          >
            <p className="text-xs md:text-sm text-gray-600 italic">
              Important ! Travel Advisory{" "}
              <a 
                href="https://visas.immigration.go.ug/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-red-600 font-bold hover:underline"
              >
                Learn More
              </a>
            </p>
          </motion.div>
        </div>
      </header>
    </>
  );
};
