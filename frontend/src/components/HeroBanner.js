import React, { useState, useEffect } from 'react';

// 4 promotional slides — simple data array, easy to explain
const SLIDES = [
  {
    id: 1,
    bg: 'linear-gradient(135deg, #2874f0 0%, #1a5dc8 100%)',
    tag: '🔥 Limited Time Deal',
    title: 'Million+ Products',
    subtitle: 'Best deals on Electronics, Fashion, Home and more',
    emoji: '🛒',
  },
  {
    id: 2,
    bg: 'linear-gradient(135deg, #ff6161 0%, #c0392b 100%)',
    tag: '⚡ Flash Sale',
    title: 'Up to 80% Off',
    subtitle: 'on top smartphone brands — Samsung, Apple, OnePlus',
    emoji: '📱',
  },
  {
    id: 3,
    bg: 'linear-gradient(135deg, #26a541 0%, #1a7a30 100%)',
    tag: '🎉 Season Sale',
    title: 'Fashion Fiesta',
    subtitle: 'Nike, Levi\'s & more — new arrivals every day',
    emoji: '👟',
  },
  {
    id: 4,
    bg: 'linear-gradient(135deg, #9c27b0 0%, #6a1b9a 100%)',
    tag: '🏠 Home Makeover',
    title: 'Home & Appliances',
    subtitle: 'Premium mattresses, ACs & refrigerators at lowest prices',
    emoji: '🛋️',
  },
];

const HeroBanner = () => {
  // activeSlide tracks which slide to show — this is the only state needed
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto-advance every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, 3000);
    return () => clearInterval(timer); // cleanup on unmount
  }, []);

  const goTo = (i) => setActiveSlide(i);
  const goPrev = () => setActiveSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  const goNext = () => setActiveSlide((prev) => (prev + 1) % SLIDES.length);

  const slide = SLIDES[activeSlide];

  return (
    <div className="hero-slider" style={{ background: slide.bg }}>
      {/* Slide Content */}
      <div className="hero-slide-content">
        <span className="hero-tag">{slide.tag}</span>
        <h2>{slide.title}</h2>
        <p>{slide.subtitle}</p>
      </div>

      {/* Emoji Illustration */}
      <span className="hero-emoji">{slide.emoji}</span>

      {/* Prev / Next Arrows */}
      <button className="hero-arrow hero-arrow-left"  onClick={goPrev} aria-label="Previous slide">‹</button>
      <button className="hero-arrow hero-arrow-right" onClick={goNext} aria-label="Next slide">›</button>

      {/* Dot Indicators */}
      <div className="hero-dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`hero-dot${i === activeSlide ? ' active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
