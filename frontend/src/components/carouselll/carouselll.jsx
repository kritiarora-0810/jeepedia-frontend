import React, { useState, useEffect } from 'react';
import './carouselll.css'; // Import your CSS file for styling

const Carousel = ({ images, interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % (images.length - 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + (images.length - 1)) % (images.length - 1));
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [currentIndex, interval, images.length]);

  return (
    <div className="carousel">
      <button className="carousel-button prev" onClick={prevSlide}>&#10094;</button>
      <div className="carousel-content">
        <div
          className="carousel-slides"
          style={{ transform: `translateX(-${currentIndex * 50}%)` }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="carousel-slide"
              style={{ backgroundImage: `url(${image})` }}
            ></div>
          ))}
        </div>
      </div>
      <button className="carousel-button next" onClick={nextSlide}>&#10095;</button>
    </div>
  );
};

export default Carousel;