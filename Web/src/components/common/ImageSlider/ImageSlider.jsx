import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ImageSlider = ({
  images,
  title,
  autoPlay = true,
  autoPlayInterval = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto play functionality
  useEffect(() => {
    if (!autoPlay || isPaused || images.length <= 1) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, currentIndex, autoPlayInterval, images.length, isPaused]);

  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevious = () => {
    setDirection(-1);
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const goToIndex = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  const slideTransition = {
    duration: 0.5,
    ease: [0.43, 0.13, 0.23, 0.96],
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
        <span className="text-gray-500">No images available</span>
      </div>
    );
  }

  // If there's only one image, just display it without controls
  if (images.length === 1) {
    return (
      <div className="w-full h-full rounded-lg overflow-hidden">
        <img
          src={images[0]}
          alt={title || "Image"}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/800x500?text=Image+Error";
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="image-slider-container relative overflow-hidden rounded-lg"
      style={{ height: "500px" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main slider */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={slideTransition}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={images[currentIndex]}
            alt={`${title || "Image"} ${currentIndex + 1}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/800x500?text=Image+Error";
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="absolute inset-0 flex items-center justify-between p-4">
        <button
          onClick={goToPrevious}
          className="bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-2 text-gray-800 hover:text-gray-900 focus:outline-none transform transition hover:scale-105"
          aria-label="Previous image"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={goToNext}
          className="bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-2 text-gray-800 hover:text-gray-900 focus:outline-none transform transition hover:scale-105"
          aria-label="Next image"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Image counter */}
      <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white text-sm px-3 py-1 rounded-full">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Thumbnail navigation */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2 bg-black bg-opacity-50 rounded-full px-3 py-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={`w-2 h-2 rounded-full focus:outline-none ${
                index === currentIndex ? "bg-white" : "bg-gray-400"
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageSlider;
