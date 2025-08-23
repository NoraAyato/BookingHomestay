import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";
import { BASE_URL } from "../api/config";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import UserActions from "./UserActions";
import AuthPopup from "./AuthPopup";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [userInfo, setUserInfo] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    import("../utils/session").then(({ removeToken }) => {
      removeToken();
      setUserInfo(null);
      setShowUserDropdown(false);
    });
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      import("../api/http").then(({ default: http }) => {
        http.get("/api/users/me").then((res) => {
          if (res.success && res.data.data) {
            setUserInfo(res.data.data);
          }
        });
      });
    }
  }, []);

  const openAuth = (mode = "login") => {
    setAuthMode(mode);
    setShowAuth(true);
  };

  const closeAuth = () => setShowAuth(false);

  return (
    <>
      <nav className={styles.navbar}>
        <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4">
          <div className="flex justify-between h-14 items-center">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center group transform transition-all duration-300 hover:scale-105"
            >
              <div className={styles.navbarLogo}>
                <i className="fas fa-home text-white text-base"></i>
              </div>
              <span className={styles.navbarTitle} style={{ fontSize: "1rem" }}>
                Rose Homestay
              </span>
            </Link>

            {/* Desktop Navigation */}
            <DesktopNav location={location} />

            {/* User Actions */}
            <UserActions
              userInfo={userInfo}
              showUserDropdown={showUserDropdown}
              setShowUserDropdown={setShowUserDropdown}
              handleLogout={handleLogout}
              openAuth={openAuth}
              BASE_URL={BASE_URL}
            />

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-1 rounded-md text-gray-700 hover:text-rose-600 hover:bg-rose-50 focus:outline-none transition-colors duration-200"
              >
                <i
                  className={`fas ${
                    isMenuOpen ? "fa-times" : "fa-bars"
                  } text-base`}
                ></i>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <MobileNav
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          openAuth={openAuth}
        />
      </nav>

      {/* Auth Popup */}
      <AuthPopup
        showAuth={showAuth}
        authMode={authMode}
        setAuthMode={setAuthMode}
        closeAuth={closeAuth}
        setUserInfo={setUserInfo}
        setShowAuth={setShowAuth}
      />
    </>
  );
};

export default Navbar;
