import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, User, MessageCircle, Heart, Send, Reply, CornerDownLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const PostDetail = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { slug: postSlug } = useParams();
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [replyInputs, setReplyInputs] = useState({});
  const [isReplying, setIsReplying] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(
          `https://3a49-2405-201-5016-709a-a563-54ee-e3e7-9a63.ngrok-free.app/community/get_post_by_slug/?slug=${postSlug}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch post');

        const postData = data.post_data;
        setPost(postData.post);
        setLikes(postData.like_count);
        setIsLiked(postData.user_liked);
        setComments(postData.comments || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postSlug]);

  const handleLike = async () => {
    if (!post?.id) return;

    try {
      const newLikeState = !isLiked;
      setIsLiked(newLikeState);
      setLikes(prev => newLikeState ? prev + 1 : prev - 1);
      window.location.reload();


      const response = await fetch(
        `https://3a49-2405-201-5016-709a-a563-54ee-e3e7-9a63.ngrok-free.app/community/toggle_like_view/${post.id}/`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Like action failed');
      
      setLikes(data.like_count ?? likes);
      setIsLiked(data.user_liked ?? isLiked);
    } catch (err) {
      setIsLiked(!isLiked);
      setLikes(prev => isLiked ? prev + 1 : prev - 1);
      setError(err.message);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !post?.id) return;

    try {
      setIsCommenting(true);
      const response = await fetch(
        `https://3a49-2405-201-5016-709a-a563-54ee-e3e7-9a63.ngrok-free.app/community/create_comment_view/${post.id}/`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: newComment }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Comment failed');

      setComments(prev => [
        {
          id: data.comment.id,
          user: data.comment.user,
          content: data.comment.content,
          created_at: new Date().toISOString(),
          replies: [],
        },
        ...prev,
      ]);
      setNewComment('');
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsCommenting(false);
      window.location.reload();

    }
  };

  const handleReplySubmit = async (commentId, e) => {
    e.preventDefault();
    const content = replyInputs[commentId]?.trim();
    if (!content || !post?.id) return;

    try {
      setIsReplying(true);
      const response = await fetch(
        `https://3a49-2405-201-5016-709a-a563-54ee-e3e7-9a63.ngrok-free.app/community/create_reply/${commentId}/`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Reply failed');

      setComments(prev => prev.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [
              {
                id: data.reply.id,
                user: data.reply.user,
                content: data.reply.content,
                created_at: new Date().toISOString(),
              },
              ...comment.replies,
            ]
          };
        }
        return comment;
      }));

      setReplyInputs(prev => ({ ...prev, [commentId]: '' }));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsReplying(false);
      window.location.reload();

    }
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-[#2d3436] animate-pulse">
        🌱 Loading post...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        ⚠️ Error: {error}
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-12 text-[#2d3436]">
        🌵 Post not found
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto px-4 py-8"
    >
      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
        {/* Post Header */}
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-4xl font-bold text-[#2d3436] mb-4 font-serif"
          >
            {post.title}
          </motion.h1>
          
          <div className="flex items-center gap-4 text-[#636e72] flex-wrap">
            <div className="flex items-center gap-2 bg-[#dfe6e9] px-3 py-1 rounded-full">
              <User size={18} className="text-[#00b894]" />
              <span className="font-medium">@{post.user.split('@')[0]}</span>
            </div>
            
            <div className="flex items-center gap-2 bg-[#dfe6e9] px-3 py-1 rounded-full">
              <Clock size={18} className="text-[#fdcb6e]" />
              <span>
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>

            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-3 py-1 rounded-full transition-colors ${
                isLiked ? 'bg-[#ff7675] text-white' : 'bg-[#dfe6e9] hover:bg-[#ffeaa7]'
              }`}
              disabled={!localStorage.getItem('token')}
            >
              <Heart size={18} className={isLiked ? 'fill-current' : ''} />
              <span>{likes}</span>
            </button>
          </div>
        </div>

        {/* Post Image */}
        {post.image && (
          <motion.img
            src={`https://3a49-2405-201-5016-709a-a563-54ee-e3e7-9a63.ngrok-free.app${post.image}`}
            alt={post.title}
            className="w-full h-96 object-cover rounded-xl mb-8 shadow-md"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Post Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="prose max-w-none mb-8 text-[#2d3436] text-lg leading-relaxed"
        >
          <p className="whitespace-pre-wrap">{post.content}</p>
        </motion.div>

        {/* Comments Section */}
        <div className="border-t pt-8">
          <div className="flex items-center gap-2 mb-6">
            <MessageCircle size={24} className="text-[#00b894]" />
            <h2 className="text-2xl font-semibold text-[#2d3436]">Discussion</h2>
          </div>

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-8 group">
            <div className="relative bg-[#f8f9fa] rounded-xl transition-all duration-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#00b894]">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder=" "
                className="w-full p-4 pt-6 bg-transparent focus:outline-none resize-none min-h-[120px] peer"
                disabled={!localStorage.getItem('token')}
              />
              <label className="absolute top-4 left-4 text-[#636e72] pointer-events-none transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:top-6 peer-focus:-top-2 peer-focus:text-sm peer-focus:text-[#00b894]">
                Share your thoughts...
              </label>
              <button
                type="submit"
                disabled={!newComment.trim() || isCommenting}
                className="absolute right-4 bottom-4 p-2 bg-[#00b894] text-white rounded-full hover:bg-[#009d7e] transition-colors"
              >
                <Send size={20} className={isCommenting ? 'animate-pulse' : ''} />
              </button>
            </div>

            {error && (
              <p className="mt-2 text-sm text-red-500">
                ⚠️ {error}
              </p>
            )}

            {!localStorage.getItem('token') && (
              <p className="mt-2 text-sm text-[#636e72]">
                🔒 Please login to leave a comment
              </p>
            )}
          </form>

          {/* Comments List */}
          <motion.div className="space-y-6">
            {comments.map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-4 rounded-xl shadow-sm border border-[#dfe6e9] hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-[#00b894] p-3 rounded-full">
                    <User size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-[#2d3436]">{comment.user}</h3>
                      <span className="text-sm text-[#636e72]">
                        {new Date(comment.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-[#2d3436] whitespace-pre-wrap">
                      {comment.content}
                    </p>

                    {/* Replies */}
                    {comment.replies?.length > 0 && (
                      <div className="mt-4 ml-4 pl-4 border-l-2 border-[#dfe6e9]">
                        {comment.replies.map((reply) => (
                          <div
                            key={reply.id}
                            className="py-3"
                          >
                            <div className="flex items-start gap-2">
                              <Reply size={16} className="text-[#636e72] mt-1.5" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-medium text-[#2d3436]">
                                    {reply.user}
                                  </span>
                                  <span className="text-xs text-[#636e72]">
                                    {new Date(reply.created_at).toLocaleTimeString()}
                                  </span>
                                </div>
                                <p className="text-sm text-[#2d3436]">
                                  {reply.content}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Form */}
                    <div className="mt-4 ml-4">
                      <form 
                        onSubmit={(e) => handleReplySubmit(comment.id, e)}
                        className="relative"
                      >
                        <div className="flex gap-2 items-start">
                          <CornerDownLeft size={18} className="text-[#636e72] mt-2.5" />
                          <textarea
                            value={replyInputs[comment.id] || ''}
                            onChange={(e) => setReplyInputs(prev => ({
                              ...prev,
                              [comment.id]: e.target.value
                            }))}
                            placeholder="Write a reply..."
                            className="w-full p-2 text-sm border-b-2 border-[#dfe6e9] focus:border-[#00b894] focus:outline-none resize-none"
                            rows="1"
                            disabled={!localStorage.getItem('token')}
                          />
                        </div>
                        
                        <div className="flex justify-end gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => setReplyInputs(prev => ({ ...prev, [comment.id]: '' }))}
                            className="text-sm text-[#636e72] hover:text-[#00b894]"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={!replyInputs[comment.id]?.trim() || isReplying}
                            className={`text-sm px-3 py-1 rounded-full ${
                              isReplying 
                                ? 'bg-gray-100 text-gray-400' 
                                : 'bg-[#00b894] text-white hover:bg-[#009d7e]'
                            }`}
                          >
                            {isReplying ? 'Posting...' : 'Reply'}
                          </button>
                        </div>
                      </form>

                      {!localStorage.getItem('token') && (
                        <p className="text-xs text-[#636e72] mt-1">
                          🔒 Login to reply
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {comments.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 space-y-4"
              >
                <div className="text-6xl">💬</div>
                <p className="text-[#636e72] text-lg">
                  No comments yet. Start the conversation!
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default PostDetail;