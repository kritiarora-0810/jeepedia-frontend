import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Testimonial.css";

const testimonials = [
  {
    text: "College predictors helped me to shortlist the best colleges for me. Kudos to the team for making this tool.",
    name: "Aaradhya Kumari",
    role: "Engineering Aspirant",
    img: "https://randomuser.me/api/portraits/women/65.jpg"
  },
  {
    text: "This tool made my college search effortless. The accuracy of predictions was really impressive!",
    name: "Rahul Verma",
    role: "JEE Rank Holder",
    img: "https://randomuser.me/api/portraits/men/45.jpg"
  },
  {
    text: "A must-use platform for all JEE aspirants. I found my dream college with ease!",
    name: "Sneha Patil",
    role: "Future Engineer",
    img: "https://randomuser.me/api/portraits/women/75.jpg"
  }
];

const Testimonial = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="testimonial-container">
      <h2 className="heading">
        <motion.span 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
        >
          2000+ Students have benefited from our 
          <span className="highlight"> College Predictor</span>
        </motion.span>
      </h2>

      <div className="testimonial-wrapper">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            className="testimonial-card"
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.6 }}
          >
            <motion.p>
              <span className="quote">“</span> {testimonials[index].text} <span className="quote">”</span>
            </motion.p>
            <h4><span className="name">{testimonials[index].name},</span> <span className="role">{testimonials[index].role}</span></h4>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="avatars">
        {testimonials.map((item, i) => (
          <motion.img
            key={i}
            src={item.img}
            alt={item.name}
            className={`avatar ${i === index ? "active-avatar" : ""}`}
            whileHover={{ scale: 1.1 }}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default Testimonial;
