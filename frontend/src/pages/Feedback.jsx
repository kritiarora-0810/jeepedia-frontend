import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Heart } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import logo from '../assets/jee_withoutbg.png';

const FeedbackForm = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Typing animation states
  const quotes = [
    "Your voice matters!",
    "We value your opinion!",
    "Help us grow better!"
  ];
  const [displayedText, setDisplayedText] = useState('');
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      localStorage.setItem('redirectAfterLogin', '/feedback');
      navigate('/login-register');
    }
  }, []);

  // Typing animation effect
  useEffect(() => {
    let charIndex = 0;
    let timeoutId;
    const typeInterval = setInterval(() => {
      if (charIndex < quotes[quoteIndex].length) {
        setDisplayedText(quotes[quoteIndex].slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        timeoutId = setTimeout(() => {
          setDisplayedText('');
          setQuoteIndex((prev) => (prev + 1) % quotes.length);
        }, 2000);
      }
    }, 100);

    return () => {
      clearInterval(typeInterval);
      clearTimeout(timeoutId);
    };
  }, [quoteIndex]);

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
        localStorage.setItem('redirectAfterLogin', '/feedback');
        navigate('/login-register');
        throw new Error('Please login to submit feedback');
      }

      const API_URL = 'https://3a49-2405-201-5016-709a-a563-54ee-e3e7-9a63.ngrok-free.app/';
      
      // Create FormData object
      const formData = new FormData();
      formData.append('feedback', feedback);
      formData.append('rating', rating.toString());
      
      const response = await fetch(`${API_URL}/feedback/add_feedback/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.setItem('redirectAfterLogin', '/feedback');
          navigate('/login-register');
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(data.message || 'Failed to submit feedback');
      }

      toast.success(data.message || 'Feedback submitted successfully!');
      setFeedback('');
      setRating(0);
    } catch (error) {
      toast.error(error.message || 'Error submitting feedback');
      console.error('Feedback submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <ToastContainer position="top-right" autoClose={2000} theme="colored" />

        {/* Feedback Form Container */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full md:w-1/2 max-w-md bg-white rounded-2xl shadow-xl p-8 mr-8"
        >
          <div className="space-y-8">
            {/* Header with Typing Animation */}
            <div className="text-center">
              <Heart className="h-12 w-12 text-[#f97316] mx-auto mb-4" />
              <AnimatePresence mode='wait'>
                <motion.h2
                  key={quoteIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-3xl font-bold text-[#f97316] h-16"
                >
                  {displayedText}
                </motion.h2>
              </AnimatePresence>
            </div>

            {/* Rating Stars */}
            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setRating(star)}
                  disabled={isSubmitting}
                  type="button" // Prevents form submission on click
                >
                  <Star
                    className={`h-10 w-10 ${
                      star <= (hoverRating || rating) 
                        ? 'text-[#f97316] fill-[#f97316]' 
                        : 'text-gray-300'
                    } ${isSubmitting ? 'opacity-50' : ''}`}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  />
                </motion.button>
              ))}
            </div>

            {/* Feedback Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Your valuable feedback..."
                rows="4"
                className="w-full p-4 border-2 rounded-xl focus:outline-none focus:border-[#f97316] disabled:opacity-50"
                disabled={isSubmitting}
              />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-[#f97316] text-white py-3 rounded-xl text-lg font-semibold shadow-md ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Logo Section - Mirrored to Right Side */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden md:block w-1/2 max-w-xl h-full flex items-center justify-center ml-8"
        >
          <img 
            src={logo}
            alt="Logo"
            className="w-full h-auto max-h-[600px] object-contain"
          />
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default FeedbackForm;