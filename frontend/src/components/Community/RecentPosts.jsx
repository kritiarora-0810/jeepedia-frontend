import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ThumbsUp, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const RecentPosts = ({ searchQuery, onPostSelect }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handlePostClick = (post) => {
    const slug = post.slug;
    navigate(`/post/${slug}`);
  };

  useEffect(() => {

    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://127.0.0.1:8000/community/get_all_posts/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        if (response.ok) {
          setPosts(data.post_data);
        } else {
          throw new Error(data.message || 'Failed to fetch posts');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <motion.div className="max-w-6xl mx-auto px-4 py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-3xl font-bold text-[#50483b] mb-8">Recent Discussions</h2>

      {loading && <p className="text-[#50483b]">Loading posts...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <AnimatePresence>
        {!loading &&
          !error &&
          posts.map((post) => (
            <motion.div
              key={post.id}
              className="group bg-white rounded-xl p-6 mb-4 cursor-pointer shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-transparent hover:border-[#ffd700]"
              onClick={() => handlePostClick(post)}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-[#50483b] mb-2">{post.title}</h3>
                <ArrowRight className="text-[#8ca87c] group-hover:text-[#ffd700] transition-colors" />
              </div>

              {post.image && (
                <img src={`http://localhost:8000${post.image}`} className="w-full h-48 object-cover rounded-xl mt-4 mb-6" alt={post.title} />
              )}

              <div className="flex items-center gap-6 text-[#50483b]/80">
                <div className="flex items-center gap-2">
                  <MessageCircle size={20} className="text-[#8ca87c]" />
                  <span>{post.content.substring(0, 50)}...</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={20} className="text-[#ffd700]" />
                  <span>{new Date(post.created_at).toLocaleString()}</span>
                </div>
                <span className="text-[#f97316] font-medium">@{post.user_name}</span>
              </div>
            </motion.div>
          ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default RecentPosts;