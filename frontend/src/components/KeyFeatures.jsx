// KeyFeatures.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiActivity, FiColumns, FiHeadphones, FiMessageSquare, FiUsers, FiStar } from 'react-icons/fi';

const KeyFeatures = () => {
  const features = [
    {
      icon: <FiActivity className="w-6 h-6" />,
      title: "AI-Powered Predictions",
      description: "Smart college recommendations using advanced algorithms"
    },
    {
      icon: <FiColumns className="w-6 h-6" />,
      title: "College Comparison",
      description: "Compare 2 institutions side-by-side"
    },
    {
      icon: <FiHeadphones className="w-6 h-6" />,
      title: "24/7 Support",
      description: "Instant help via chat, email, or phone"
    },
    {
      icon: <FiMessageSquare className="w-6 h-6" />,
      title: "Share Feedback",
      description: "We value your suggestions"
    },
    {
      icon: <FiUsers className="w-6 h-6" />,
      title: "Community Help",
      description: "Collaborate with peers & experts"
    },
    {
      icon: <FiStar className="w-6 h-6" />,
      title: "Premium Subscription",
      description: "Unlock exclusive features"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren",
        duration: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "tween",
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-16 bg-[#f8f7f5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ 
            opacity: 1, 
            y: 0,
            transition: { 
              type: "tween",
              duration: 0.4,
              ease: "easeOut"
            } 
          }}
          viewport={{ once: true, margin: "0px" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-playfair text-[#50483b] mb-4">
            Elevate Your College Journey
          </h2>
          <p className="text-[#8ca87c] text-xl font-light">
            Intelligent Tools for Smart Decisions
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px 0px -100px 0px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ 
                y: -5,
                transition: { 
                  type: "spring",
                  stiffness: 300,
                  damping: 10
                }
              }}
              className="bg-white p-8 rounded-lg shadow-sm transition-all group"
            >
              <div className="flex items-center mb-4">
                <motion.span
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="text-[#8ca87c] mr-3 group-hover:text-[#f97316]"
                >
                  {feature.icon}
                </motion.span>
                <h3 className="text-xl font-semibold text-[#50483b]">
                  {feature.title}
                </h3>
              </div>
              <motion.p
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
                className="text-[#50483b]/80 leading-relaxed"
              >
                {feature.description}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style jsx="true" global="true">{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&display=swap');
        
        .font-playfair {
          font-family: 'Playfair Display', serif;
        }
      `}</style>
    </section>
  );
};

export default KeyFeatures;