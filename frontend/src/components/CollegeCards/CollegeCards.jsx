import React, { useState } from "react";
import { motion } from "framer-motion";
import './CollegeCards.css';

const colleges = [
    {
        name: "IIT Bombay - Indian Institute of Technology",
        location: "Mumbai, Maharashtra | AICTE, UGC",
        course: "BE/B.Tech",
        fees: "2.31 Lacs First Year Fees",
        rating: "4.4/5 (368 reviews)",
        rank: "Ranked 118 out of 1400 QS",
        image: "https://d3lzcn6mbbadaf.cloudfront.net/media/details/ANI-20240914065248.jpg"
    },
    {
        name: "IIT Delhi - Indian Institute of Technology",
        location: "New Delhi, Delhi | AICTE, UGC",
        course: "BE/B.Tech",
        fees: "2.20 Lacs First Year Fees",
        rating: "4.5/5 (412 reviews)",
        rank: "Ranked 113 out of 1400 QS",
        image: "https://home.iitd.ac.in/images/for-faculty/camp8.jpg"
    },
    {
        name: "IIT Kanpur - Indian Institute of Technology",
        location: "Kanpur, Uttar Pradesh | AICTE, UGC",
        course: "BE/B.Tech",
        fees: "2.10 Lacs First Year Fees",
        rating: "4.3/5 (390 reviews)",
        rank: "Ranked 120 out of 1400 QS",
        image: "https://education.indianexpress.com/_next/image?url=https%3A%2F%2Feducation.indianexpress.com%2Fstorage%2Fimages%2Fiit-kanpur-indian-institute-of-technology-iitkheader_1693525231.jpg&w=2048&q=75"
    },
    {
        name: "IIT Madras - Indian Institute of Technology",
        location: "Chennai, Tamil Nadu | AICTE, UGC",
        course: "BE/B.Tech",
        fees: "2.50 Lacs First Year Fees",
        rating: "4.6/5 (450 reviews)",
        rank: "Ranked 100 out of 1400 QS",
        image: "https://cdn.thewire.in/wp-content/uploads/2020/12/14164827/EmRGSSuVMAUFofB.jpeg"
    },
    {
        name: "IIT Kharagpur - Indian Institute of Technology",
        location: "Kharagpur, West Bengal | AICTE, UGC",
        course: "BE/B.Tech",
        fees: "2.40 Lacs First Year Fees",
        rating: "4.5/5 (400 reviews)",
        rank: "Ranked 110 out of 1400 QS",
        image: "https://static.theprint.in/wp-content/uploads/2024/12/IIT-Kharagpur-campus-IIT-Kharagpur.jpg"
    },
    {
        name: "IIT Roorkee - Indian Institute of Technology",
        location: "Roorkee, Uttarakhand | AICTE, UGC",
        course: "BE/B.Tech",
        fees: "2.35 Lacs First Year Fees",
        rating: "4.4/5 (380 reviews)",
        rank: "Ranked 115 out of 1400 QS",
        image: "https://contentstatic.techgig.com/photo/msid-106081038,width-400,resizemode-4/IIT-Roorkee-breaks-all-previous-records-in-this-placement-season.jpg"
    }
];

const CollegeCards = () => {
    const [showMore, setShowMore] = useState(false);

    return (
        
        <div className="college-container">
            <h1>Top Universities/Colleges</h1>
            <motion.div className="college-grid">
                {colleges.slice(0, 3).map((college, index) => (
                    <motion.div 
                        key={index} 
                        className="college-card"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                        viewport={{ once: true }}
                    >
                        <img src={college.image} alt={college.name} className="college-image" />
                        <div className="card-content">
            <h2>{college.name}</h2>
            <p>{college.location}</p>
            <p>{college.course}</p>
            <p className="highlight">{college.fees}</p>
            <p>
              <span className="highlight">⭐ {college.rating}</span> 
            </p>
            <p>{college.rank}</p>
          </div>
                    </motion.div>
                ))}
            </motion.div>

            {showMore && (
                <motion.div 
                    className="college-grid"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.5 }}
                >
                    {colleges.slice(3, 6).map((college, index) => (
                        <motion.div 
                            key={index} 
                            className="college-card"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            viewport={{ once: true }}
                        >
                            <img src={college.image} alt={college.name} className="college-image" />
                            <div className="card-content">
            <h2>{college.name}</h2>
            <p>{college.location}</p>
            <p>{college.course}</p>
            <p className="highlight">{college.fees}</p>
            <p>
              <span className="highlight">⭐ {college.rating}</span> 
            </p>
            <p>{college.rank}</p>
          </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            <motion.button 
                className="see-more-btn" 
                onClick={() => setShowMore(!showMore)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                {showMore ? "See Less" : "See More"}
            </motion.button>
        </div>
        
    );
};

export default CollegeCards;
