import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="w-full flex items-center justify-center">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Side: Description */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="space-y-6"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[#ffd700] leading-tight">
            Discover Your Ideal College with JEE-PEEDIA
          </h1>
          <p className="text-lg text-[#ffffff]">
            JEE-PEEDIA is your intelligent college companion — using advanced algorithms and real-time data to recommend the best engineering colleges based on your JEE rank, preferences, and category.
          </p>
          <div className="flex gap-4">
            <button className="bg-[#f97316] text-white px-6 py-3 rounded-xl shadow-md hover:bg-orange-500 transition duration-300">
              Get Started
            </button>
            <button className="border border-[#8ca87c] text-[#8ca87c] px-6 py-3 rounded-xl hover:bg-[#8ca87c] hover:text-[#50483b] transition duration-300">
              Learn More
            </button>
          </div>
        </motion.div>

        {/* Right Side: Project Name */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="flex justify-center md:justify-end"
        >
          <div className="bg-[#8ca87c] text-[#50483b] px-8 py-10 rounded-3xl shadow-lg text-center">
            <h2 className="text-5xl font-extrabold tracking-widest text-[#ffd700] mb-4">
              JEE-PEEDIA
            </h2>
            <p className="text-md font-medium text-[#50483b]">
              Your Gateway to India's Top Engineering Colleges
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
