import React from "react";
import { Link } from "react-router-dom";

const NavLink = ({ to, text, icon, active }) => (
  <Link
    to={to}
    className={`relative px-4 py-2 transition-colors duration-200 group flex items-center font-medium ${
      active ? "text-rose-600 font-bold" : "text-gray-700 hover:text-rose-600"
    }`}
  >
    <span className="flex items-center">
      <i className={`fas ${icon} mr-2 text-current`}></i>
      {text}
    </span>
    <span
      className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-rose-600 transition-all duration-300 ${
        active ? "w-3/4" : "w-0 group-hover:w-3/4"
      }`}
    ></span>
  </Link>
);

const DesktopNav = ({ location }) => (
  <div className="hidden md:flex items-center space-x-1 text-sm">
    <NavLink
      to="/"
      text="Trang chủ"
      icon="fa-home"
      active={location.pathname === "/"}
    />
    <NavLink
      to="/Homestay/Index"
      text="Tìm homestay"
      icon="fa-search"
      active={location.pathname === "/Homestay/Index"}
    />
    <NavLink
      to="/location"
      text="Địa điểm"
      icon="fa-map-marker-alt"
      active={location.pathname === "/location"}
    />
    <NavLink
      to="/Home/news"
      text="Tin tức"
      icon="fa-newspaper"
      active={location.pathname === "/Home/news"}
    />
    <NavLink
      to="/Home/AboutUs"
      text="Về chúng tôi"
      icon="fa-info-circle"
      active={location.pathname === "/Home/AboutUs"}
    />
  </div>
);

export default DesktopNav;
