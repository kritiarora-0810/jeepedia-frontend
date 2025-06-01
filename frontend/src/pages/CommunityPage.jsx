// pages/CommunityPage.js
import CommunityHero from '../components/Community/CommunityHero';
import RecentPosts from '../components/Community/RecentPosts';
import PostDetail from '../components/Community/PostDetail';
import NewPost from '../components/Community/NewPost';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';

const CommunityPage = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [showNewPost, setShowNewPost] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      localStorage.setItem('redirectAfterLogin', '/community');
      navigate('/login-register');
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CommunityHero 
        onSearch={setSearchQuery} 
        onNewPost={() => setShowNewPost(true)}
      />
      
      <RecentPosts 
        searchQuery={searchQuery} 
        onPostSelect={setSelectedPost}
      />

      <AnimatePresence>
        {selectedPost && (
          <PostDetail 
            post={selectedPost} 
            onClose={() => setSelectedPost(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNewPost && (
          <NewPost 
            onClose={() => setShowNewPost(false)}
            onPostCreated={() => {
              setShowNewPost(false);
            }}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
    
  );
};

export default CommunityPage;