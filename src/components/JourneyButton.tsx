import * as React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const JourneyButton = ({ size = "lg" }: { size?: "sm" | "lg" }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/journey-form');
  };

  // Button size classes
  const sizeClasses =
    size === "sm"
  ? "px-6 py-3 text-base"
  : "px-10 py-5 text-lg";

  return (
    <>
      <motion.button
        onClick={handleClick}
        className={`relative inline-flex items-center gap-3 font-semibold text-white bg-[#013220] rounded-full shadow-2xl overflow-hidden group transition-all duration-300 hover:shadow-green-500/50 hover:scale-105 ${sizeClasses}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Soft Pulse Animation */}
        <motion.span
          className="absolute inset-0 bg-green-400/30 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Button Content */}
        <span className="relative z-10 flex items-center gap-3">
          {/* Airplane Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={size === "sm" ? "w-5 h-5" : "w-6 h-6"}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>
          Begin Your Journey
        </span>

        {/* Hover Gradient Effect */}
        <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
      </motion.button>
    </>
  );
};