import { motion } from "framer-motion";
import "./AdmissionBanner.css";
import mylogo from '../../assets/bulbbbb.png';

const AdmissionBanner = () => {
  return (
    <div className="banner-container">
      <h1 className="banner-text">Know your chances of Admission</h1>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="start-button"
      >
        Start Now
      </motion.button>
  <img src={mylogo} alt="Illustration" className="banner-image" />
  

    </div>
  );
};

export default AdmissionBanner;