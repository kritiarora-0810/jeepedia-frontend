import { motion } from "framer-motion";

import Profile from '../components/dashboardd/profile';
import CommunityPosts from '../components/dashboardd/communityPosts';
import SubmittedFeedbacks from '../components/dashboardd/submittedFeedbacks';
import SettingsPanel from '../components/dashboardd/settingsPanel';
import { theme } from "../constants/theme";

const Dashboard = () => {
  const sidebarVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white p-8"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={sidebarVariants}
            transition={{ duration: 0.4 }}
          >
            <Profile />
          </motion.div>
          
          <motion.div
            initial="hidden"
            animate="visible"
            variants={sidebarVariants}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <SettingsPanel />
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <CommunityPosts />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <SubmittedFeedbacks />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;