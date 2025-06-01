import { motion } from "framer-motion";
import { theme } from "../../constants/theme";


const CommunityPosts = () => {
  const posts = [
    { id: 1, content: "Just launched our new feature!", likes: 42, comments: 12 },
    { id: 2, content: "Community meetup next Friday", likes: 28, comments: 8 },
  ];

  return (
    <motion.div className="space-y-6">
      <h2 className="text-2xl font-bold" style={{ color: theme.primary }}>
        Community Posts
      </h2>
      
      {posts.map((post) => (
        <motion.div
          key={post.id}
          className="p-6 rounded-xl border"
          style={{ borderColor: theme.border }}
          whileHover={{ y: -2 }}
        >
          <p className="mb-4" style={{ color: theme.text }}>{post.content}</p>
          <div className="flex gap-4">
            <motion.button
              className="flex items-center gap-2 text-sm"
              style={{ color: theme.muted }}
              whileTap={{ scale: 0.95 }}
            >
              <span style={{ color: theme.alert }}>♥</span> {post.likes}
            </motion.button>
            <motion.button
              className="flex items-center gap-2 text-sm"
              style={{ color: theme.muted }}
              whileTap={{ scale: 0.95 }}
            >
              💬 {post.comments}
            </motion.button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default CommunityPosts;