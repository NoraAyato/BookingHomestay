import React, { useState } from 'react';

const RoomImageGallery = ({ images, title }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Ensure there are images to display
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
        <span className="text-gray-500">No images available</span>
      </div>
    );
  }

  // Get the main image and thumbnails
  const mainImage = images[activeIndex];
  // Use up to 2 thumbnails
  const thumbnails = images.length > 1 ? images.filter((_, index) => index !== activeIndex).slice(0, 2) : [];
  
  return (
    <div className="room-image-gallery h-full relative">
      {/* Main image */}
      <div className="main-image-container rounded-lg overflow-hidden mb-2" style={{ height: 'calc(100% - 70px)' }}>
        <img
          src={mainImage}
          alt={`${title || 'Room'} - Main`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/600x400?text=Room";
          }}
        />
      </div>
      
      {/* Thumbnails */}
      {thumbnails.length > 0 && (
        <div className="thumbnails-container grid grid-cols-2 gap-2">
          {thumbnails.map((image, index) => {
            // Calculate the actual index in the original images array
            const originalIndex = images.findIndex(img => img === image);
            
            return (
              <button
                key={index}
                onClick={() => setActiveIndex(originalIndex)}
                className="thumbnail-item relative rounded-lg overflow-hidden h-[60px]"
              >
                <img
                  src={image}
                  alt={`${title || 'Room'} - Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/200x100?text=Room";
                  }}
                />
              </button>
            );
          })}
        </div>
      )}
      
      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
          {activeIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
};

export default RoomImageGallery;
