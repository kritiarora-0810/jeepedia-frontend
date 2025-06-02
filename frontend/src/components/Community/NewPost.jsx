import { motion } from 'framer-motion';
import { X, FileText, SendHorizonal, Image } from 'lucide-react';
import { useState } from 'react';

const NewPost = ({ onClose, onPostCreated }) => {
  const [postContent, setPostContent] = useState({
    title: '',
    content: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    if (file) reader.readAsDataURL(file);
    setPostContent({ ...postContent, image: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('title', postContent.title);
    formData.append('content', postContent.content);
    if (postContent.image) {
      formData.append('image', postContent.image);
    }

    try {
      const response = await fetch('https://3a49-2405-201-5016-709a-a563-54ee-e3e7-9a63.ngrok-free.app/community/create_post/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        onPostCreated(); // Refresh the post list after successful submission
        onClose(); // Close the modal
      } else {
        throw new Error(data.message || 'Failed to create post');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-[#50483b]/50 backdrop-blur-sm flex items-center justify-center p-4 pt-[100px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl p-8 max-w-3xl w-full relative shadow-xl h-[80vh] overflow-y-auto"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[#50483b] hover:text-[#f97316] transition-colors"
        >
          <X size={28} />
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-[#ffd700]/10 rounded-xl">
            <FileText className="text-[#f97316]" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-[#50483b]">Create New Post</h2>
        </div>
        
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-lg font-medium text-[#50483b] mb-2">Post Title</label>
            <input
              type="text"
              className="w-full px-5 py-3 rounded-xl border-2 border-[#8ca87c]/30
                focus:border-[#ffd700] focus:ring-2 focus:ring-[#ffd700]/20
                placeholder-[#50483b]/50 transition-all duration-200 text-lg"
              placeholder="Enter post title..."
              value={postContent.title}
              onChange={(e) => setPostContent({ ...postContent, title: e.target.value })}
              required
            />
          </div>
          
          <div>
            <label className="block text-lg font-medium text-[#50483b] mb-2">Post Content</label>
            <textarea
              className="w-full px-5 py-3 rounded-xl border-2 border-[#8ca87c]/30
                focus:border-[#ffd700] focus:ring-2 focus:ring-[#ffd700]/20
                placeholder-[#50483b]/50 transition-all duration-200 text-lg h-48"
              placeholder="Write your post content here..."
              value={postContent.content}
              onChange={(e) => setPostContent({ ...postContent, content: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-[#50483b] mb-2">Add Image</label>
            <div className="flex items-center gap-4">
              <input type="file" accept="image/*" className="hidden" id="post-image" onChange={handleImageChange} />
              <label
                htmlFor="post-image"
                className="px-8 py-3 bg-[#f97316] text-white font-medium rounded-xl
                  flex items-center gap-2 hover:bg-[#f97316]/90 transition-colors"
              >
                <Image size={20} />
                Upload Image
              </label>
              {imagePreview && <img src={imagePreview} alt="Preview" className="w-24 h-24 rounded-xl" />}
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <motion.button
              type="button"
              onClick={onClose}
              className="px-8 py-3 text-[#50483b] hover:text-[#f97316] font-medium rounded-xl
                transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              className="px-8 py-3 bg-[#f97316] text-white font-medium rounded-xl
                flex items-center gap-2 hover:bg-[#f97316]/90 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
            >
              <SendHorizonal size={20} />
              {loading ? 'Publishing...' : 'Publish Post'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default NewPost;
