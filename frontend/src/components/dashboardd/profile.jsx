import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Mail, User, Lock } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { theme } from "../../constants/theme";
import { BASE_URL } from '../../config';

const Profile = ({ user }) => {
  // Initialize with safe defaults
  const [profileData, setProfileData] = useState({
    profile_picture: '',
    name: 'Loading...',
    email: 'loading@example.com',
    username: 'loading',
    first_name: '',
    last_name: '',
    phone_number: '',
    ...user
  });

  // Handle user prop updates
  useEffect(() => {
    if(user) {
      setProfileData(prev => ({
        ...prev,
        ...user,
        profile_picture: user.profile_picture || ''
      }));
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const { data } = await axios.post(
        `${BASE_URL}users/edit_user_details/`, 
        new FormData(e.target), 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if(data?.success) {
        localStorage.setItem('user', JSON.stringify(data.user_details));
        setProfileData(prev => ({
          ...prev,
          ...data.user_details
        }));
        toast.success(data.message);
      } else {
        toast.error(data?.message || 'Update failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files?.[0];
    if(!file) return;

    setSelectedFile(file);

    try {
      const formData = new FormData();
      formData.append('profile_picture', file);
      const token = localStorage.getItem('token');

      const { data } = await axios.post(
        `${BASE_URL}users/edit_profile_picture/`, 
        formData, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if(data?.success) {
        localStorage.setItem('user', JSON.stringify(data.user_details));
        setProfileData(prev => ({
          ...prev,
          ...data.user_details
        }));
        toast.success(data.message);
      } else {
        toast.error(data?.message || 'Profile picture update failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile picture');
    }
  };

  return (
    <motion.div 
      className="p-6 rounded-xl shadow-lg bg-white"
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      style={{ border: `2px solid ${theme.primary}` }}
    >
      <h2 className="text-2xl font-bold mb-6" style={{ color: theme.primary }}>
        <User className="inline-block mr-2" size={24} />
        Profile Settings
      </h2>

      <div className="flex items-center gap-6 mb-8">
        <motion.div 
          className="relative group"
          whileHover={{ scale: 1.05 }}
        >
          <div className="w-24 h-24 rounded-full border-4 overflow-hidden" 
               style={{ borderColor: theme.secondary }}>
            <img
              src={`${BASE_URL}media/${profileData?.profile_picture || 'default.jpg'}`}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = '/default-profile.png';
              }}
            />
          </div>
          <label 
            className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md cursor-pointer"
            style={{ border: `2px solid ${theme.primary}` }}
          >
            <Camera size={18} color={theme.primary} />
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleProfilePictureChange} 
              className="hidden" 
            />
          </label>
        </motion.div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold" style={{ color: theme.primary }}>
            {profileData?.name || 'No name provided'}
          </h3>
          <div className="flex items-center gap-2" style={{ color: theme.muted }}>
            <Mail size={16} color={theme.primary} />
            <span>{profileData?.email || 'No email provided'}</span>
          </div>
          <div className="flex items-center gap-2" style={{ color: theme.muted }}>
            <Lock size={16} color={theme.primary} />
            <span>@{profileData?.username || 'unknown'}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleUpdateProfile} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['first_name', 'last_name', 'username', 'phone_number'].map((field) => (
            <motion.div 
              key={field} 
              className="relative"
              whileHover={{ y: -2 }}
            >
              <input
                type="text"
                placeholder={field.replace('_', ' ').toUpperCase()}
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                style={{
                  borderColor: theme.primary,
                  color: theme.text,
                  focusBorderColor: theme.secondary,
                  focusRingColor: `${theme.secondary}40`
                }}
                name={field}
                value={profileData[field] || ''}
                onChange={(e) => setProfileData(prev => ({
                  ...prev,
                  [field]: e.target.value
                }))}
              />
            </motion.div>
          ))}
        </div>

        <motion.button
          type="submit"
          className="w-full py-3 rounded-lg font-semibold transition-all relative"
          style={{ 
            backgroundColor: theme.secondary,
            color: theme.background
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Update Profile
        </motion.button>
      </form>
    </motion.div>
  );
};

export default Profile;