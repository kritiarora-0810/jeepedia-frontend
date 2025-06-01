import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { BASE_URL } from '../../config';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { Edit3, Trash2, MessageSquare } from 'lucide-react';
import { theme } from '../../constants/theme';

const CommunityPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${BASE_URL}community/list_posts_by_user/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setPosts(response.data.posts);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('Error retrieving posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDeleteConfirmation = (postId) => {
    setPostToDelete(postId);
    setShowModal(true);
  };

  const handleDeletePost = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication required. Please log in.');
      return;
    }

    try {
      const response = await axios.delete(`${BASE_URL}community/delete_post/${postToDelete}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setPosts(posts.filter(post => post.id !== postToDelete));
        toast.success(response.data.message);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Error deleting post.');
    } finally {
      setShowModal(false);
    }
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication required. Please log in.');
      return;
    }
    try {
      const response = await axios.post(
        `${BASE_URL}community/edit_post/${editingPost.id}/`,
        {
          title: editingPost.title,
          content: editingPost.content,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        setPosts(posts.map(post => post.id === editingPost.id ? response.data.post : post));
        setEditingPost(null);
        toast.success(response.data.message);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Error updating post.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <MessageSquare size={28} color={theme.primary} />
        <h2 className="text-2xl font-semibold" style={{ color: theme.primary }}>
          Community Posts
        </h2>
      </div>

      <AnimatePresence>
        {editingPost ? (
          <motion.div
            key="editForm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 rounded-xl shadow-lg border"
            style={{ borderColor: theme.primary }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: theme.text }}>
              <Edit3 size={20} className="inline-block mr-2" />
              Edit Post
            </h3>
            <form onSubmit={handleUpdatePost} className="space-y-4">
              <input
                type="text"
                value={editingPost.title}
                onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                placeholder="Post Title"
                className="w-full px-4 py-2 rounded-lg border focus:outline-none"
                style={{
                  borderColor: theme.primary,
                  color: theme.text,
                  focusBorderColor: theme.secondary
                }}
                required
              />
              <textarea
                value={editingPost.content}
                onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                placeholder="Post Content"
                className="w-full px-4 py-2 rounded-lg border focus:outline-none h-32"
                style={{
                  borderColor: theme.primary,
                  color: theme.text,
                  focusBorderColor: theme.secondary
                }}
                required
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg border"
                  style={{ borderColor: theme.primary, color: theme.text }}
                  onClick={() => setEditingPost(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-white"
                  style={{ backgroundColor: theme.secondary }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="postsList"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {posts.length === 0 && (
              <motion.div
                className="p-6 rounded-xl border text-center"
                style={{ borderColor: theme.primary }}
              >
                <h3 className="text-lg font-medium mb-2" style={{ color: theme.text }}>
                  No Posts Created Yet
                </h3>
                <p className="mb-4" style={{ color: theme.muted }}>
                  Start sharing your knowledge with the community
                </p>
                <Link to="/community/new-post">
                  <button
                    className="px-4 py-2 rounded-lg text-white"
                    style={{ backgroundColor: theme.secondary }}
                  >
                    Create New Post
                  </button>
                </Link>
              </motion.div>
            )}

            {posts.map(post => (
              <motion.div
                key={post.id}
                className="p-4 rounded-lg border shadow-sm"
                style={{ borderColor: theme.primary }}
                whileHover={{ y: -2 }}
              >
                <h3 className="font-medium mb-2" style={{ color: theme.text }}>
                  {post.title}
                </h3>
                <p className="text-sm mb-4" style={{ color: theme.muted }}>
                  {post.content}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: theme.muted }}>
                    {post.created_at}
                  </span>
                  <div className="flex gap-2">
                    <button
                      className="flex items-center gap-1 text-sm"
                      style={{ color: theme.text }}
                      onClick={() => setEditingPost(post)}
                    >
                      <Edit3 size={16} />
                      Edit
                    </button>
                    <button
                      className="flex items-center gap-1 text-sm"
                      style={{ color: theme.alert }}
                      onClick={() => handleDeleteConfirmation(post.id)}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full mx-4"
              style={{ borderColor: theme.primary }}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
            >
              <h3 className="text-lg font-semibold mb-4" style={{ color: theme.text }}>
                <Trash2 className="inline-block mr-2" size={20} />
                Confirm Deletion
              </h3>
              <p className="mb-6" style={{ color: theme.muted }}>
                Are you sure you want to delete this post?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 rounded-lg border"
                  style={{ borderColor: theme.primary, color: theme.text }}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded-lg text-white"
                  style={{ backgroundColor: theme.alert }}
                  onClick={handleDeletePost}
                >
                  Delete Post
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ToastContainer />
    </div>
  );
};

export default CommunityPosts;