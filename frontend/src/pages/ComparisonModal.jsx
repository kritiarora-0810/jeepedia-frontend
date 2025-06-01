import React from 'react';
import { motion } from 'framer-motion';

const ComparisonModal = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-lg"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#50483b]">
            {data.college1_name} vs {data.college2_name}
          </h2>
          <button
            onClick={onClose}
            className="text-[#50483b]/70 hover:text-[#50483b]"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-[#8ca87c]/10 p-4 rounded-lg">
            <h3 className="font-medium text-[#50483b] mb-2">Key Comparisons</h3>
            <ul className="list-disc pl-5 space-y-2 text-[#50483b]/80">
              {data.comparison.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>

          <div className="bg-[#f97316]/10 p-4 rounded-lg">
            <h3 className="font-medium text-[#50483b] mb-2">Final Recommendation</h3>
            <p className="text-[#50483b]/80">{data.recommendation}</p>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2 bg-[#8ca87c] text-white rounded-md hover:bg-[#7d9770]"
          >
            Close Comparison
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ComparisonModal;