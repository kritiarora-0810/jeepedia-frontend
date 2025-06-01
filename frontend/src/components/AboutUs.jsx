import { motion } from 'framer-motion';

const AboutUs = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h1 className="text-3xl font-medium text-[#50483b] mb-4">
            Strategic JEE Preparation
          </h1>
          <p className="text-[#50483b]/90 max-w-xl mx-auto">
            Essential tools for focused learning and measurable progress
          </p>
        </motion.div>

        {/* Value Propositions */}
        <motion.div 
          className="grid md:grid-cols-2 gap-8 mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: { 
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
        >
          <motion.div
            variants={{ hidden: { y: 20 }, visible: { y: 0 }}}
            className="p-6 border-l-4 border-[#8ca87c]"
          >
            <h3 className="text-xl text-[#50483b] font-medium mb-3">
              Curated Resources
            </h3>
            <p className="text-[#50483b]/80">
              Precision-filtered study material and practice sets
            </p>
          </motion.div>

          <motion.div
              variants={{ hidden: { y: 20 }, visible: { y: 0 }}}
              className={"p-6 border-l-4 border-[#f97316]"}
            >
          
            <h3 className="text-xl text-[#50483b] font-medium mb-3">
              Performance Analytics
            </h3>
            <p className="text-[#50483b]/80">
              Detailed progress tracking and actionable insights
            </p>
          </motion.div>
        </motion.div>

        {/* CTAs */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <motion.button
            whileHover={{ y: -2 }}
            className="bg-[#f97316] text-white px-8 py-3 rounded-sm font-medium shadow-sm"
          >
            Start Free Access
          </motion.button>
          <motion.button
            whileHover={{ y: -2 }}
            className="border-b-2 border-[#8ca87c] text-[#50483b] px-8 py-3 font-medium"
          >
            Explore Premium Features
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;