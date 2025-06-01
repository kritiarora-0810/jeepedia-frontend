import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Clock, Check, X, MessageSquare, Plus } from 'lucide-react';
import { theme } from '../../constants/theme';
import { BASE_URL } from '../../config';

const SubmittedFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${BASE_URL}feedback/get_all_feedbacks_by_user/`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          setFeedbacks(response.data.feedbacks || []); // Use feedbacks instead of feedback_list
        } else {
          setError(response.data.message || 'Failed to fetch feedbacks');
        }
      } catch (err) {
        console.error('Error fetching feedbacks:', err);
        setError('Failed to fetch feedbacks. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const getStatusDetails = (feedback) => {
    // if (!feedback.publish) return { text: 'Draft', color: theme.muted };
    if (feedback.is_deleted) return { text: 'Deleted', color: theme.alert };
    return feedback.rating >= 4 
      ? { text: 'Accepted', color: theme.secondary }
      : { text: 'Under Review', color: theme.accent };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!feedback.trim()) {
      toast.error('Please provide some feedback');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required. Please log in.');
        return;
      }

      const formData = new FormData();
      formData.append('feedback', feedback);
      formData.append('rating', rating);

      const response = await axios.post(`${BASE_URL}feedback/add_feedback/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setFeedbacks([response.data.feedback_details, ...feedbacks]);
        setShowCreateForm(false);
        toast.success('Feedback submitted successfully');
        setFeedback('');
        setRating(5);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Submission failed');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center gap-3">
        <MessageSquare size={28} color={theme.primary} />
        <h2 className="text-2xl font-semibold" style={{ color: theme.primary }}>
          Submitted Feedbacks
        </h2>
      </div>

      <AnimatePresence>
        {feedbacks.length === 0 && !showCreateForm ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-6 rounded-xl border text-center"
            style={{ borderColor: theme.primary }}
          >
            <h3 className="text-lg font-medium mb-4" style={{ color: theme.text }}>
              No Feedback Submitted Yet
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Share your thoughts and experiences to help improve our platform.
            </p>
            <button
              className="px-6 py-3 rounded-lg text-white font-semibold"
              style={{ backgroundColor: theme.primary }}
              onClick={() => setShowCreateForm(true)}
            >
              <Plus className="inline-block mr-2" size={18} />
              Create New Feedback
            </button>
          </motion.div>
        ) : showCreateForm ? (
          <motion.div
            key="createForm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 rounded-xl border"
            style={{ borderColor: theme.primary }}
          >
            <h3 className="text-lg font-medium mb-4" style={{ color: theme.text }}>
              <Plus className="inline-block mr-2" size={20} />
              New Feedback
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
                  Your Feedback
                </label>
                <textarea
                  required
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full p-2 rounded-lg border"
                  style={{ borderColor: theme.primary }}
                  placeholder="Share your thoughts and experiences..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
                  Rating
                </label>
                <select
                  required
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full p-2 rounded-lg border"
                  style={{ borderColor: theme.primary }}
                >
                  {[5,4,3,2,1].map(num => (
                    <option key={num} value={num}>{num} Stars</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg border"
                  style={{ borderColor: theme.primary, color: theme.text }}
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-white"
                  style={{ backgroundColor: theme.secondary }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="feedbacksList"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {feedbacks.map(feedback => {
              const status = getStatusDetails(feedback);
              
              return (
                <motion.div
                  key={feedback.id}
                  className="p-4 rounded-lg border shadow-sm"
                  style={{ borderColor: theme.primary }}
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium" style={{ color: theme.text }}>
                      {feedback.feedback.substring(0, 40)}...
                    </h3>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full text-sm"
                      style={{ 
                        backgroundColor: `${status.color}10`,
                        color: status.color
                      }}
                    >
                      {status.text}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: theme.muted }}>
                      {new Date(feedback.created_at).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className="text-lg"
                          style={{ color: i < feedback.rating ? theme.accent : theme.muted }}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {feedbacks.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border" style={{ borderColor: theme.primary }}>
            <p className="text-sm" style={{ color: theme.muted }}>Total Feedbacks</p>
            <p className="text-2xl font-bold" style={{ color: theme.text }}>
              {feedbacks.length}
            </p>
          </div>
          <div className="p-4 rounded-lg border" style={{ borderColor: theme.primary }}>
            <p className="text-sm" style={{ color: theme.muted }}>Average Rating</p>
            <p className="text-2xl font-bold" style={{ color: theme.accent }}>
              {(feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmittedFeedbacks;