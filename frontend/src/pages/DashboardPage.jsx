import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, MessageSquare, AlertCircle, Settings, LogOut } from 'lucide-react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import Profile from '../components/Dashboard/Profile';
import CommunityPosts from '../components/Dashboard/CommunityPosts';
import SubmittedFeedbacks from '../components/Dashboard/SubmittedFeedbacks';
import SettingsPanel from '../components/Dashboard/SettingsPanel';
import { BASE_URL } from '../config';
import { theme } from '../constants/theme';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const userString = localStorage.getItem('user_details');
  const userObj = JSON.parse(userString);
  const [profileData, setProfileData] = useState(userObj);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login-register';
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'profile': return <Profile user={profileData} />;
      case 'posts': return <CommunityPosts />;
      case 'feedbacks': return <SubmittedFeedbacks />;
      case 'settings': return <SettingsPanel />;
      default: return <Profile user={profileData} />;
    }
  };

  const navItems = [
    { id: 'profile', icon: <User size={20} />, label: 'Profile' },
    { id: 'posts', icon: <MessageSquare size={20} />, label: 'Community Posts' },
    { id: 'feedbacks', icon: <AlertCircle size={20} />, label: 'My Feedbacks' },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Reduced top margin from mt-20 to mt-12 */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-[280px_1fr] flex-1">
        {/* Wider sidebar (from 240px to 280px) */}
        <motion.div
          className="bg-white border-r h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto shadow-sm"
          style={{ borderColor: theme.primary + '20' }}
        >
          <div className="p-6">
            {/* Profile Card with adjusted spacing */}
            <div className="flex items-center gap-5 mb-8 p-5 rounded-lg border" 
                 style={{ borderColor: theme.primary }}>
              <img
                src={`${BASE_URL}media/${profileData.profile_picture}`}
                alt="Profile"
                className="w-14 h-14 rounded-full object-cover border-2"
                style={{ borderColor: theme.secondary }}
              />
              <div className="min-w-0">
                <h3 className="font-semibold truncate" style={{ color: theme.text }}>
                  {profileData.first_name} {profileData.last_name}
                </h3>
                <p className="text-sm truncate" style={{ color: theme.muted }}>
                  {profileData.email}
                </p>
              </div>
            </div>

            {/* Navigation with better spacing */}
            <nav className="space-y-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-4 px-5 py-3 rounded-lg transition-colors ${
                    activeTab === item.id 
                      ? 'bg-gray-100 font-medium'
                      : 'hover:bg-gray-50'
                  }`}
                  style={{ color: theme.text }}
                >
                  <span style={{ color: theme.primary }}>
                    {item.icon}
                  </span>
                  <span className="whitespace-nowrap">{item.label}</span>
                </button>
              ))}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-5 py-3 rounded-lg mt-6 hover:bg-gray-50"
                style={{ color: theme.alert }}
              >
                <LogOut size={20} />
                <span className="whitespace-nowrap">Logout</span>
              </button>
            </nav>
          </div>
        </motion.div>

        {/* Main Content with adjusted padding */}
        <main className="h-[calc(100vh-4rem)] overflow-y-auto bg-gray-50">
          <AnimatePresence mode='wait'>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="p-6"
            >
              <div className="bg-white rounded-xl shadow-sm p-6" 
                   style={{ border: `1px solid ${theme.primary}20` }}>
                {renderContent()}
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <Footer className="mt-auto" />
    </div>
  );
};

export default DashboardPage;