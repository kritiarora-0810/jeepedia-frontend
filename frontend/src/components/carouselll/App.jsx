import React from 'react';
import Carousel from './carouselll';

const App = () => {
  const images = [
    'https://i.pinimg.com/736x/36/e9/3b/36e93bed7b3e629663d0c4b528a9ae75.jpg',
    'https://i.pinimg.com/736x/1a/cf/ff/1acfffc2cdddfc588ff49eb636c18890.jpg',
    'https://i.pinimg.com/736x/2d/bf/9d/2dbf9d0c9122850ff7b672f8a71cda05.jpg',
    'https://i.pinimg.com/736x/36/c5/d3/36c5d3a95bf81dc5509e99199f7ac9d4.jpg',
    'https://i.pinimg.com/736x/3e/14/25/3e14256cca709d44c6c6bc5a3576b6fb.jpg',
    'https://i.pinimg.com/736x/5d/e3/0e/5de30e5751cd4ff287872aee9dac204e.jpg',
  ];

  return (
    <div className="App">
      <Carousel images={images} interval={2000} />
    </div>
  );
};

export default App;