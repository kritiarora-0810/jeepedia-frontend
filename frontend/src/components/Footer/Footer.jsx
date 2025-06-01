import React, { useRef } from "react";
import { FaEnvelope, FaPhoneAlt, FaHeart } from "react-icons/fa";
import { motion, useInView } from "framer-motion";
import "./Footer.css";

export default function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.footer 
      ref={ref}
      className="footer"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <div className="footer-container">
        
        {/* Newsletter Section */}
        <motion.div 
          className="footer-section"
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h3>Subscribe to Our Newsletter</h3>
          <p className="footer-text">
            Don’t miss any updates of our new products and exclusive offers!
          </p>
          <div className="footer-subscribe">
            <input type="email" placeholder="Email" className="footer-input" />
            <motion.button 
              className="footer-button"
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
            >
              Subscribe
            </motion.button>
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div 
          className="footer-section"
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h3>Categories</h3>
          <ul className="footer-list">
            {["JEE Main", "JEE Advanced", "NEET", "BITSAT", "VITEEE", "SRMJEEE", "JIPMER"].map((item, index) => (
              <motion.li 
                key={index} 
                className="footer-link"
                whileHover={{ scale: 1.1 }}
              >
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Useful Links */}
        <motion.div 
          className="footer-section"
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h3>Useful Links</h3>
          <ul className="footer-list">
            {["FAQ", "Terms & Conditions", "Reporting", "Documentation", "Support Policy", "Privacy"].map((item, index) => (
              <motion.li 
                key={index} 
                className="footer-link"
                whileHover={{ scale: 1.1 }}
              >
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Contact Section */}
        <motion.div 
          className="footer-section"
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <h3>JEE-PEEDIA</h3>
          <p className="footer-text">
            Your ultimate destination for predicting colleges based on your rank.
          </p>
          <div className="footer-contact">
            <p className="footer-contact-item">
              <FaEnvelope /> jeepedia.in@gmail.com
            </p>
            <p className="footer-contact-item">
              <FaPhoneAlt /> +91 8360103913
            </p>
          </div>
        </motion.div>

      </div>

      <div className="footer-bottom">
        <p>© JEE-PEEDIA Inc. 2025 All rights reserved.</p>
        <p className="footer-made">
          Made with <FaHeart className="footer-heart" /> by JEE-PEDIA Team
        </p>
      </div>
    </motion.footer>
  );
}
