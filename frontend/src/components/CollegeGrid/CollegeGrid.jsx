import React from "react";
import './CollegeGrid.css';

const colleges = [
  {
    name: "IIT Bombay - Indian Institute of Technology",
    location: "Mumbai, Maharashtra | AICTE, UGC",
    course: "BE/B.Tech",
    fees: "2.31 Lacs First Year Fees",
    rating: "4.4/5",
    reviews: "368 reviews",
    rank: "Ranked 118 out of 1400 QS",
    imgUrl: "https://d3lzcn6mbbadaf.cloudfront.net/media/details/ANI-20240914065248.jpg",
  },
  {
    name: "IIT Delhi - Indian Institute of Technology",
    location: "New Delhi, Delhi | AICTE, UGC",
    course: "BE/B.Tech",
    fees: "2.20 Lacs First Year Fees",
    rating: "4.5/5",
    reviews: "412 reviews",
    rank: "Ranked 113 out of 1400 QS",
    imgUrl: "https://home.iitd.ac.in/images/for-faculty/camp8.jpg",
  },
  {
    name: "IIT Kanpur - Indian Institute of Technology",
    location: "Kanpur, Uttar Pradesh | AICTE, UGC",
    course: "BE/B.Tech",
    fees: "2.10 Lacs First Year Fees",
    rating: "4.3/5",
    reviews: "390 reviews",
    rank: "Ranked 120 out of 1400 QS",
    imgUrl: "https://education.indianexpress.com/_next/image?url=https%3A%2F%2Feducation.indianexpress.com%2Fstorage%2Fimages%2Fiit-kanpur-indian-institute-of-technology-iitkheader_1693525231.jpg&w=2048&q=75",
  },
  {
    name: "IIT Madras - Indian Institute of Technology",
    location: "Chennai, Tamil Nadu | AICTE, UGC",
    course: "BE/B.Tech",
    fees: "2.50 Lacs First Year Fees",
    rating: "4.6/5",
    reviews: "450 reviews",
    rank: "Ranked 100 out of 1400 QS",
    imgUrl: "https://cdn.thewire.in/wp-content/uploads/2020/12/14164827/EmRGSSuVMAUFofB.jpeg",
  },
  {
    name: "IIT Kharagpur - Indian Institute of Technology",
    location: "Kharagpur, West Bengal | AICTE, UGC",
    course: "BE/B.Tech",
    fees: "2.40 Lacs First Year Fees",
    rating: "4.5/5",
    reviews: "400 reviews",
    rank: "Ranked 110 out of 1400 QS",
    imgUrl: "https://static.theprint.in/wp-content/uploads/2024/12/IIT-Kharagpur-campus-IIT-Kharagpur.jpg",
  },
  {
    name: "IIT Roorkee - Indian Institute of Technology",
    location: "Roorkee, Uttarakhand | AICTE, UGC",
    course: "BE/B.Tech",
    fees: "2.35 Lacs First Year Fees",
    rating: "4.4/5",
    reviews: "380 reviews",
    rank: "Ranked 115 out of 1400 QS",
    imgUrl: "https://contentstatic.techgig.com/photo/msid-106081038,width-400,resizemode-4/IIT-Roorkee-breaks-all-previous-records-in-this-placement-season.jpg",
  },
];

const CollegeGrid = () => {
  return (
  <div className="App">
      <h1>Top Universities/Colleges</h1>
    <div className="grid">
      {colleges.map((college, index) => (
        <div key={index} className="card">
          <img
            src={college.imgUrl}
            alt={college.name}
            className="card-img"
          />
          <div className="card-content">
            <h2>{college.name}</h2>
            <p>{college.location}</p>
            <p>{college.course}</p>
            <p className="highlight">{college.fees}</p>
            <p>
              <span className="highlight">⭐ {college.rating}</span> (
              {college.reviews})
            </p>
            <p>{college.rank}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
  );
};

export default CollegeGrid;
