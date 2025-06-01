import React, { useState } from 'react';
import { Lock, Mail } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { theme } from '../../constants/theme';
import { BASE_URL } from '../../config';

const SettingsPanel = () => {
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [emailData, setEmailData] = useState({
    current: '',
    new: ''
  });

  // Password Handlers
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      if (passwordData.new !== passwordData.confirm) {
        toast.error('Passwords do not match');
        return;
      }

      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        `${BASE_URL}users/change_password/`,
        passwordData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success('Password updated successfully');
        setPasswordData({ current: '', new: '', confirm: '' });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password update failed');
    }
  };

  // Email Handlers
  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmailData({ ...emailData, [name]: value });
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        `${BASE_URL}users/change_email/`,
        emailData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success('Email updated successfully');
        setEmailData({ current: '', new: '' });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Email update failed');
    }
  };

  return (
    <div className="space-y-8">
      {/* Password Section */}
      <motion.div 
        className="p-6 rounded-xl shadow-lg border"
        style={{ borderColor: theme.primary }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Lock size={24} color={theme.primary} />
          <h3 className="text-xl font-semibold" style={{ color: theme.text }}>
            Security Settings
          </h3>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {['current', 'new', 'confirm'].map((field) => (
            <motion.div 
              key={field} 
              className="relative"
              whileHover={{ y: -2 }}
            >
              <input
                type="password"
                name={field}
                placeholder={`${field.charAt(0).toUpperCase() + field.slice(1)} Password`}
                value={passwordData[field]}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none transition-colors"
                style={{
                  borderColor: theme.primary,
                  color: theme.text,
                  backgroundColor: theme.background
                }}
                required
              />
              <Lock 
                size={18} 
                className="absolute right-3 top-3" 
                color={theme.muted} 
              />
            </motion.div>
          ))}

          <motion.button
            type="submit"
            className="w-full py-2.5 rounded-lg font-medium transition-colors"
            style={{ 
              backgroundColor: theme.secondary,
              color: theme.background
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Update Password
          </motion.button>
        </form>
      </motion.div>

      {/* Email Section */}
      <motion.div 
        className="p-6 rounded-xl shadow-lg border"
        style={{ borderColor: theme.primary }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Mail size={24} color={theme.primary} />
          <h3 className="text-xl font-semibold" style={{ color: theme.text }}>
            Email Preferences
          </h3>
        </div>

        <form onSubmit={handleEmailSubmit} className="space-y-4">
          {['current', 'new'].map((field) => (
            <motion.div 
              key={field} 
              className="relative"
              whileHover={{ y: -2 }}
            >
              <input
                type="email"
                name={field}
                placeholder={`${field.charAt(0).toUpperCase() + field.slice(1)} Email`}
                value={emailData[field]}
                onChange={handleEmailChange}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none transition-colors"
                style={{
                  borderColor: theme.primary,
                  color: theme.text,
                  backgroundColor: theme.background
                }}
                required
              />
              <Mail 
                size={18} 
                className="absolute right-3 top-3" 
                color={theme.muted} 
              />
            </motion.div>
          ))}

          <motion.button
            type="submit"
            className="w-full py-2.5 rounded-lg font-medium transition-colors"
            style={{ 
              backgroundColor: theme.secondary,
              color: theme.background
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Update Email
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default SettingsPanel;