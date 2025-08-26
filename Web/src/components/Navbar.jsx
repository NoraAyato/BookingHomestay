import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";
import { BASE_URL } from "../api/config";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import UserActions from "./UserActions";
import AuthPopup from "./AuthPopup";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const location = useLocation();
  const { user, logout, loading } = useAuth();

  const openAuth = (mode = "login") => {
    setAuthMode(mode);
    setShowAuth(true);
  };
  React.useEffect(() => {
    setShowUserDropdown(false);
  }, [user]);
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
              userInfo={user}
              showUserDropdown={showUserDropdown}
              setShowUserDropdown={setShowUserDropdown}
              handleLogout={logout}
              openAuth={openAuth}
              BASE_URL={BASE_URL}
              loading={loading}
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
        setShowAuth={setShowAuth}
      />
    </>
  );
};

export default Navbar;
