import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import UserInfo from "../../components/user/UserInfo";
import UserBookings from "../../components/user/UserBookings";
import UserFavorites from "../../components/user/UserFavorites";
import UserPromotions from "../../components/user/UserPromotions";
const UserPage = () => {
  const location = useLocation();
  const bookingTabRef = useRef(null);
  const promotionsTabRef = useRef(null);
  const [activeTab, setActiveTab] = useState("bookings");
  const [expandedBookings, setExpandedBookings] = useState({});

  const toggleBookingDetails = (bookingId) => {
    setExpandedBookings((prev) => ({
      ...prev,
      [bookingId]: !prev[bookingId],
    }));
  };

  useEffect(() => {
    if (location.pathname === "/user/booking-history") {
      setActiveTab("bookings");
      setTimeout(() => {
        if (bookingTabRef.current) {
          const rect = bookingTabRef.current.getBoundingClientRect();
          const scrollTop =
            window.pageYOffset || document.documentElement.scrollTop;
          window.scrollTo({
            top: rect.top + scrollTop,
            behavior: "smooth",
          });
        }
      }, 100);
    }
    if (location.pathname === "/user/promotions") {
      setActiveTab("promotions");
      setTimeout(() => {
        if (promotionsTabRef.current) {
          const rect = promotionsTabRef.current.getBoundingClientRect();
          const scrollTop =
            window.pageYOffset || document.documentElement.scrollTop;
          window.scrollTo({
            top: rect.top + scrollTop,
            behavior: "smooth",
          });
        }
      }, 100);
    }
  }, [location.pathname]);

  const favorites = [
    {
      id: "FAV001",
      name: "Villa Biển Nha Trang",
      location: "Nha Trang, Khánh Hòa",
      price: "1,800,000",
      rating: 4.9,
      image:
        "http://localhost:8080/img/uploads/Homestays/96ae073e-35d4-4a3f-85f6-aed6c7f4896c.jpg",
    },
    {
      id: "FAV002",
      name: "Homestay Phố Cổ Hội An",
      location: "Hội An, Quảng Nam",
      price: "1,200,000",
      rating: 4.7,
      image:
        "http://localhost:8080/img/uploads/Homestays/96ae073e-35d4-4a3f-85f6-aed6c7f4896c.jpg",
    },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-rose-50/20 via-white to-cyan-50/30 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-rose-600 to-rose-800 bg-clip-text text-transparent">
            Tài Khoản Cá Nhân
          </h1>
          <p className="text-gray-600 mt-2">
            Quản lý thông tin và đặt phòng của bạn
          </p>
        </motion.div>

        {/* User Info Section */}
        <UserInfo />

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex border-b border-gray-200 mb-8"
        >
          <button
            className={`px-4 py-3 font-medium text-sm md:text-base flex items-center ${
              activeTab === "bookings"
                ? "text-rose-600 border-b-2 border-rose-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("bookings")}
            ref={bookingTabRef}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Lịch sử đặt phòng
          </button>

          <button
            className={`px-4 py-3 font-medium text-sm md:text-base flex items-center ${
              activeTab === "favorites"
                ? "text-rose-600 border-b-2 border-rose-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("favorites")}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            Yêu thích
          </button>

          <button
            className={`px-4 py-3 font-medium text-sm md:text-base flex items-center ${
              activeTab === "promotions"
                ? "text-rose-600 border-b-2 border-rose-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("promotions")}
            ref={promotionsTabRef}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20 12v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7" />
              <rect x="2" y="7" width="20" height="5" rx="2" />
              <path d="M12 7V2m0 0a3 3 0 013 3v2m-3-5a3 3 0 00-3 3v2" />
            </svg>
            Khuyến mãi
          </button>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          key={activeTab}
        >
          {activeTab === "bookings" && (
            <UserBookings
              expandedBookings={expandedBookings}
              toggleBookingDetails={toggleBookingDetails}
            />
          )}
          {activeTab === "favorites" && <UserFavorites favorites={favorites} />}
          {activeTab === "promotions" && <UserPromotions />}
        </motion.div>
      </div>
    </section>
  );
};

export default UserPage;
