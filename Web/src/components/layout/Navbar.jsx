import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";
import { BASE_URL } from "../../api/config";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import UserActions from "./UserActions";
import AuthPopup from "../auth/AuthPopup";
import { useAuth } from "../../hooks/useAuth";
import { useAuthPopup } from "../../contexts/AuthPopupProvider";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [showUserDropdown, setShowUserDropdown] = React.useState(false);
  const location = useLocation();
  const { user, logout, loading } = useAuth();
  const { openAuthPopup } = useAuthPopup();

  React.useEffect(() => {
    setShowUserDropdown(false);
  }, [user]);

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
                Home Feel
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
              openAuth={openAuthPopup}
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
          openAuth={openAuthPopup}
        />
      </nav>
    </>
  );
};

export default Navbar;
