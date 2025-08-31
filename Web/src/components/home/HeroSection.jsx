import React, { useState, useEffect } from "react";
import { formatDateDisplay } from "../../utils/date";
const HeroSection = () => {
  // State cho các trường nhập liệu
  const [location, setLocation] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");

  // State cho hiển thị định dạng dd/mm/yyyy
  const [checkInDisplay, setCheckInDisplay] = useState("");
  const [checkOutDisplay, setCheckOutDisplay] = useState("");

  // State cho các giá trị min/max
  const [minCheckInDate, setMinCheckInDate] = useState("");
  const [maxCheckInDate, setMaxCheckInDate] = useState("");
  const [minCheckOutDate, setMinCheckOutDate] = useState("");
  const [maxCheckOutDate, setMaxCheckOutDate] = useState("");

  useEffect(() => {
    setCheckInDisplay(formatDateDisplay(checkInDate));
  }, [checkInDate]);

  useEffect(() => {
    setCheckOutDisplay(formatDateDisplay(checkOutDate));
  }, [checkOutDate]);

  useEffect(() => {
    const today = new Date();

    const oneMonthLater = new Date(today);
    oneMonthLater.setDate(today.getDate() + 30);

    const formatDate = (date) => {
      return date.toISOString().split("T")[0];
    };

    setMinCheckInDate(formatDate(today));
    setMaxCheckInDate(formatDate(oneMonthLater));
  }, []);

  useEffect(() => {
    if (checkInDate) {
      const checkIn = new Date(checkInDate);
      const nextDay = new Date(checkIn);
      nextDay.setDate(checkIn.getDate() + 1);

      setMinCheckOutDate(nextDay.toISOString().split("T")[0]);

      const oneMonthFromCheckIn = new Date(checkIn);
      oneMonthFromCheckIn.setDate(checkIn.getDate() + 30);

      setMaxCheckOutDate(oneMonthFromCheckIn.toISOString().split("T")[0]);

      const formatDate = (date) => {
        return date.toISOString().split("T")[0];
      };

      if (
        !checkOutDate ||
        new Date(checkOutDate) <= checkIn ||
        new Date(checkOutDate) > oneMonthFromCheckIn
      ) {
        setCheckOutDate(formatDate(nextDay));
      }
    }
  }, [checkInDate]);

  // Xử lý form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý tìm kiếm
    console.log("Tìm kiếm:", { location, checkInDate, checkOutDate });
  };

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
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-5xl mx-auto">
          <form
            className="flex flex-col md:flex-row gap-6"
            onSubmit={handleSubmit}
          >
            <div className="flex-1">
              <label
                htmlFor="location"
                className="block text-gray-700 text-sm font-medium mb-1 text-left"
              >
                <i className="fas fa-map-marker-alt mr-1 text-rose-500"></i> Địa
                điểm
              </label>
              <div className="relative">
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-rose-500"></i>
                <input
                  id="location"
                  type="text"
                  placeholder="Bạn muốn đi đâu?"
                  className="w-full pl-10 pr-4 py-3 rounded-md border-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-gray-700 text-base"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div>
                <label
                  htmlFor="checkin"
                  className="block text-gray-700 text-sm font-medium mb-1 text-left"
                >
                  <i className="far fa-calendar-alt mr-1 text-rose-500"></i>{" "}
                  Ngày nhận phòng
                </label>
                <div className="relative">
                  <i className="far fa-calendar-alt absolute left-3 top-1/2 transform -translate-y-1/2 text-rose-500"></i>
                  <input
                    type="text"
                    className="pl-10 pr-4 py-3 rounded-md border-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-gray-700 text-base w-48"
                    placeholder="Ngày nhận phòng"
                    value={checkInDisplay}
                    readOnly
                    onClick={() =>
                      document.getElementById("checkin-date").showPicker()
                    }
                  />
                  <input
                    id="checkin-date"
                    type="date"
                    className="absolute opacity-0 w-0 h-0"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    min={minCheckInDate}
                    max={maxCheckInDate}
                    required
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="checkout"
                  className="block text-gray-700 text-sm font-medium mb-1 text-left"
                >
                  <i className="far fa-calendar-check mr-1 text-rose-500"></i>{" "}
                  Ngày trả phòng
                </label>
                <div className="relative">
                  <i className="far fa-calendar-check absolute left-3 top-1/2 transform -translate-y-1/2 text-rose-500"></i>
                  <input
                    type="text"
                    className="pl-10 pr-4 py-3 rounded-md border-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-gray-700 text-base w-48"
                    placeholder="Ngày trả phòng"
                    value={checkOutDisplay}
                    readOnly
                    onClick={() =>
                      checkInDate &&
                      document.getElementById("checkout-date").showPicker()
                    }
                  />
                  <input
                    id="checkout-date"
                    type="date"
                    className="absolute opacity-0 w-0 h-0"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    min={minCheckOutDate}
                    max={maxCheckOutDate}
                    disabled={!checkInDate}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="px-8 py-3 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors text-base font-medium h-[50px]"
              >
                <i className="fas fa-search mr-2"></i>
                Tìm kiếm
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
