import React, { useState, useEffect } from 'react';

export default function ImageSlider({ images, interval = 4000, onChange }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrent((prev) => {
        const next = (prev + 1) % images.length;
        if (onChange) onChange(next);
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval, onChange]);

  return (
    <div className="image-slider">
      {images.map((src, index) => (
        <img
          key={src}
          src={src}
          alt={`Slide ${index + 1}`}
          className={`slider-img ${index === current ? 'active' : ''}`}
        />
      ))}
    </div>
  );
}