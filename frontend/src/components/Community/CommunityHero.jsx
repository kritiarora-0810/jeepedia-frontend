// components/Community/CommunityHero.jsx
import { motion } from 'framer-motion';
import { Search, Plus, Users } from 'lucide-react';

const CommunityHero = ({ onSearch, onNewPost }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-b from-[#50483b]/10 to-[#faf8f5] py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <div className="space-y-4">
            <motion.h1 
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              className="text-4xl md:text-5xl font-bold text-[#50483b]"
            >
              JEE Community Hub
            </motion.h1>
            <p className="text-lg text-[#f97316] flex items-center gap-2">
              <Users className="text-[#8ca87c]" size={24} />
              Connect with 50,000+ JEE aspirants
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#f97316] text-white px-8 py-4 rounded-xl flex items-center gap-2 
              shadow-lg hover:bg-[#f97316]/90 transition-all duration-200"
            onClick={onNewPost}
          >
            <Plus size={24} />
            Create New Post
          </motion.button>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative max-w-3xl mx-auto"
        >
          <input
            type="text"
            placeholder="Search discussions..."
            className="w-full px-6 py-4 rounded-xl border-2 border-[#8ca87c]/30 pl-16
              focus:border-[#ffd700] focus:ring-2 focus:ring-[#ffd700]/20 text-lg
              placeholder-gray-500 transition-all duration-200"
            onChange={(e) => onSearch(e.target.value)}
          />
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#8ca87c]" size={24} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CommunityHero;