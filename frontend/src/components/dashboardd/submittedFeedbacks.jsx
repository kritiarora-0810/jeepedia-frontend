import { motion } from "framer-motion";
import { theme } from "../../constants/theme";


const SubmittedFeedbacks = () => {
  const feedbacks = [
    { id: 1, title: "UI Improvements", status: "Completed", date: "2024-03-15" },
    { id: 2, title: "Feature Request", status: "In Review", date: "2024-03-18" },
  ];

  return (
    <motion.div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6" style={{ color: theme.primary }}>
        Submitted Feedbacks
      </h2>
      
      <div className="space-y-4">
        {feedbacks.map((feedback) => (
          <motion.div
            key={feedback.id}
            className="p-4 rounded-lg border"
            style={{ borderColor: theme.border }}
            whileHover={{ x: 5 }}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold" style={{ color: theme.text }}>
                  {feedback.title}
                </h3>
                <p className="text-sm" style={{ color: theme.muted }}>
                  {feedback.date}
                </p>
              </div>
              <motion.span
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ 
                  backgroundColor: 
                    feedback.status === "Completed" ? theme.secondary : theme.accent,
                  color: theme.background
                }}
                whileHover={{ scale: 1.05 }}
              >
                {feedback.status}
              </motion.span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SubmittedFeedbacks;