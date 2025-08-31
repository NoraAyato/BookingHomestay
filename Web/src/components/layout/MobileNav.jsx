import React from "react";
import ReloadLink from "../common/ReloadLink";

const MobileNavLink = ({ to, text, icon, onClick }) => (
  <ReloadLink
    to={to}
    className="block px-2 py-1 rounded-md text-sm font-medium text-gray-700 hover:text-rose-600 hover:bg-rose-50 transition-colors duration-200"
    onClick={onClick}
  >
    <i className={`fas ${icon} mr-2`}></i> {text}
  </ReloadLink>
);

const MobileNav = ({ isMenuOpen, setIsMenuOpen, openAuth }) => (
  <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
      <MobileNavLink
        to="/"
        text="Trang chủ"
        icon="fa-home"
        onClick={() => setIsMenuOpen(false)}
      />
      <MobileNavLink
        to="/Homestay/Index"
        text="Tìm homestay"
        icon="fa-search"
        onClick={() => setIsMenuOpen(false)}
      />
      <MobileNavLink
        to="/location"
        text="Địa điểm"
        icon="fa-map-marker-alt"
        onClick={() => setIsMenuOpen(false)}
      />
      <MobileNavLink
        to="/news"
        text="Tin tức"
        icon="fa-newspaper"
        onClick={() => setIsMenuOpen(false)}
      />
      <MobileNavLink
        to="/aboutus"
        text="Về chúng tôi"
        icon="fa-info-circle"
        onClick={() => setIsMenuOpen(false)}
      />
      <button
        className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-rose-600 hover:bg-rose-50 transition-colors duration-200"
        onClick={() => {
          setIsMenuOpen(false);
          openAuth("login");
        }}
      >
        <i className="fas fa-sign-in-alt mr-2"></i> Đăng nhập
      </button>
    </div>
  </div>
);

export default MobileNav;
