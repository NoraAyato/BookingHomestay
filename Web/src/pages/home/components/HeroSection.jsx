import React from "react";

const HeroSection = () => {
  return (
    <div className="relative h-[300px] md:h-[400px] lg:h-[500px] flex items-center justify-center mt-0">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1568605114967-8130f3a36994"
          alt="Hero Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
          Tìm homestay cho chuyến đi của bạn
        </h1>
        <p className="text-lg md:text-xl mb-6">
          Khám phá những địa điểm độc đáo và trải nghiệm đáng nhớ
        </p>

        {/* Search Box */}
        <div className="bg-white rounded-lg shadow-xl p-4 max-w-4xl mx-auto">
          <form className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Bạn muốn đi đâu?"
                className="w-full px-4 py-3 rounded-md border-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-gray-700 text-base"
              />
            </div>
            <div className="flex gap-4">
              <input
                type="date"
                className="px-4 py-3 rounded-md border-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-gray-700 text-base w-40"
              />
              <input
                type="date"
                className="px-4 py-3 rounded-md border-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-gray-700 text-base w-40"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors text-base font-medium"
            >
              Tìm kiếm
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
