import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Reusable image gallery component with multiple display modes
 * @param {Object} props Component props
 * @param {Array} props.images Array of image URLs
 * @param {string} props.title Optional title for accessibility
 * @param {string} props.mode Display mode: "slider", "grid", "simple", "thumbnails"
 * @param {boolean} props.autoPlay Enable auto-play for slider mode
 * @param {number} props.autoPlayInterval Interval for auto-play in milliseconds
 * @param {number} props.height Height for the gallery container
 * @param {number} props.maxThumbnails Maximum number of thumbnails to show
 * @param {string} props.className Additional CSS classes
 */
const ImageGallery = ({
  images,
  title = "Image Gallery",
  mode = "slider", // "slider", "grid", "simple", "thumbnails"
  autoPlay = true,
  autoPlayInterval = 5000,
  height = 500,
  maxThumbnails = 4,
  className = "",
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Handle empty image array
  if (!images || images.length === 0) {
    return (
      <div
        className={`w-full bg-gray-200 flex items-center justify-center rounded-lg ${className}`}
        style={{ height: typeof height === "number" ? `${height}px` : height }}
      >
        <span className="text-gray-500">No images available</span>
      </div>
    );
  }

  // Auto play functionality for slider mode
  useEffect(() => {
    if (mode !== "slider" || !autoPlay || isPaused || images.length <= 1)
      return;

    const interval = setInterval(() => {
      setDirection(1);
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, activeIndex, autoPlayInterval, images.length, isPaused, mode]);

  // Navigation functions
  const goToNext = () => {
    setDirection(1);
    setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevious = () => {
    setDirection(-1);
    setActiveIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const goToIndex = (index) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  // Lightbox functions
  const openLightbox = (index = activeIndex) => {
    setActiveIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  // Mouse event handlers
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // Animation variants for slider
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

  // If there's only one image, just display it without controls
  if (images.length === 1) {
    return (
      <div
        className={`w-full rounded-lg overflow-hidden ${className}`}
        style={{ height: typeof height === "number" ? `${height}px` : height }}
      >
        <img
          src={images[0]}
          alt={title || "Image"}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/800x500?text=Image+Error";
          }}
          onClick={() => openLightbox(0)}
        />
      </div>
    );
  }

  // Render different gallery modes
  const renderGalleryContent = () => {
    switch (mode) {
      case "slider":
        return (
          <div
            className={`image-gallery-slider relative overflow-hidden rounded-lg ${className}`}
            style={{
              height: typeof height === "number" ? `${height}px` : height,
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Main slider */}
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={slideTransition}
                className="absolute inset-0 w-full h-full"
              >
                <img
                  src={images[activeIndex]}
                  alt={`${title || "Image"} ${activeIndex + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/800x500?text=Image+Error";
                  }}
                  onClick={() => openLightbox()}
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
              {activeIndex + 1} / {images.length}
            </div>

            {/* Thumbnail navigation */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="flex space-x-2 bg-black bg-opacity-50 rounded-full px-3 py-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToIndex(index)}
                    className={`w-2 h-2 rounded-full focus:outline-none ${
                      index === activeIndex ? "bg-white" : "bg-gray-400"
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case "grid":
        // Grid layout for showing multiple images in a grid
        return (
          <div
            className={`image-gallery-grid grid grid-cols-2 gap-2 ${className}`}
          >
            {images.slice(0, maxThumbnails).map((image, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-lg cursor-pointer"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={image}
                  alt={`${title || "Image"} ${index + 1}`}
                  className="w-full h-full object-cover aspect-square"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/400x400?text=Image+Error";
                  }}
                />
                {index === maxThumbnails - 1 &&
                  images.length > maxThumbnails && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                      <span className="text-white text-lg font-medium">
                        +{images.length - maxThumbnails}
                      </span>
                    </div>
                  )}
              </div>
            ))}
          </div>
        );

      case "simple":
        // Simple horizontal scrolling gallery
        return (
          <div className={`image-gallery-simple mt-3 ${className}`}>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  className="flex-shrink-0 h-20 w-20 rounded-md overflow-hidden border border-gray-200 hover:border-rose-500 transition-colors"
                  onClick={() => openLightbox(index)}
                >
                  <img
                    src={image}
                    alt={`${title || "Image"} ${index + 1}`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/100x100?text=Image+Error";
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        );

      case "thumbnails":
        // Main image with thumbnails layout
        return (
          <div
            className={`image-gallery-thumbnails h-full relative ${className}`}
          >
            {/* Main image */}
            <div
              className="main-image-container rounded-lg overflow-hidden mb-2"
              style={{ height: "calc(100% - 70px)" }}
            >
              <img
                src={images[activeIndex]}
                alt={`${title || "Image"} - Main`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/600x400?text=Image+Error";
                }}
                onClick={() => openLightbox()}
              />

              {/* Image counter */}
              {images.length > 1 && (
                <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
                  {activeIndex + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="thumbnails-container grid grid-cols-4 gap-2">
                {images.slice(0, 4).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`thumbnail-item relative rounded-lg overflow-hidden h-[60px] ${
                      index === activeIndex ? "ring-2 ring-rose-500" : ""
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${title || "Image"} - Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://placehold.co/200x100?text=Image+Error";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {renderGalleryContent()}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-4xl max-h-screen p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 z-10 bg-white bg-opacity-25 rounded-full p-2 text-white hover:bg-opacity-50 focus:outline-none"
              onClick={closeLightbox}
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="relative">
              <img
                src={images[activeIndex]}
                alt={`Full size ${title || "image"} ${activeIndex + 1}`}
                className="max-h-[80vh] max-w-full mx-auto"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/800x600?text=Image+Error";
                }}
              />

              {images.length > 1 && (
                <>
                  <button
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-25 rounded-full p-2 text-white hover:bg-opacity-50 focus:outline-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToPrevious();
                    }}
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
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-25 rounded-full p-2 text-white hover:bg-opacity-50 focus:outline-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToNext();
                    }}
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
                </>
              )}

              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {activeIndex + 1} / {images.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;
