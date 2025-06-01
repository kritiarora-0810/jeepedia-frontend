import { motion } from "framer-motion";
import { theme } from "../../constants/theme";


const SettingsPanel = () => {
  const settings = [
    { id: 1, label: "Email Notifications", enabled: true },
    { id: 2, label: "Dark Mode", enabled: false },
    { id: 3, label: "2FA Authentication", enabled: false },
  ];

  return (
    <motion.div 
      className="p-6 rounded-xl bg-white shadow-lg"
      whileHover={{ rotate: -0.5 }}
    >
      <h2 className="text-xl font-bold mb-4" style={{ color: theme.primary }}>
        Account Settings
      </h2>
      
      <div className="space-y-4">
        {settings.map((setting) => (
          <motion.div 
            key={setting.id}
            className="flex justify-between items-center py-2 border-b"
            style={{ borderColor: theme.border }}
          >
            <span style={{ color: theme.text }}>{setting.label}</span>
            <motion.button
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                setting.enabled ? 'bg-green-500' : 'bg-gray-300'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-4 h-4 rounded-full bg-white shadow-md"
                animate={{ x: setting.enabled ? 24 : 0 }}
              />
            </motion.button>
          </motion.div>
        ))}
      </div>
      
      <motion.button
        className="w-full mt-6 py-2 rounded-lg font-semibold"
        style={{ 
          backgroundColor: theme.primary,
          color: theme.background
        }}
        whileHover={{ y: -2 }}
      >
        Advanced Settings
      </motion.button>
    </motion.div>
  );
};

export default SettingsPanel;