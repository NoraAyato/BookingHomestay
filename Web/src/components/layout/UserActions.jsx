import React, { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useReloadNavigate } from "../../utils/useReloadNavigate";
import styles from "./UserActions.module.css";
import { getImageUrl } from "../../utils/imageUrl";
import NotificationBell from "../common/NotificationBell";

const UserActions = ({
  userInfo,
  showUserDropdown,
  setShowUserDropdown,
  handleLogout,
  openAuth,
  BASE_URL,
}) => {
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [setShowUserDropdown]);

  const navigate = useReloadNavigate();
  const location = useLocation();
  return (
    <div className={styles.container}>
      {userInfo ? (
        <>
          {/* User Dropdown */}
          <div className={styles.dropdownWrapper} ref={dropdownRef}>
            <button
              className={styles.userButton}
              onClick={(e) => {
                e.stopPropagation();
                setShowUserDropdown((prev) => !prev);
              }}
              aria-expanded={showUserDropdown}
              aria-haspopup="true"
            >
              <img
                src={getImageUrl(userInfo.picture)}
                alt="avatar"
                className={styles.avatar}
              />
              <span className={styles.userName}>{userInfo.userName}</span>
              <svg
                className={`${styles.chevron} ${
                  showUserDropdown ? styles.chevronOpen : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            <div
              className={`${styles.dropdownMenu} ${
                showUserDropdown ? styles.dropdownOpen : styles.dropdownClosed
              }`}
              style={{ willChange: "opacity, transform" }}
            >
              {/* Role-based item */}
              {userInfo.role === "Admin" && (
                <button
                  className={styles.menuItemAdmin}
                  onClick={() => navigate("/admin/dashboard")}
                >
                  <div className={styles.iconWrapper}>
                    <svg
                      className={styles.icon}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <span>Dashboard</span>
                </button>
              )}

              {userInfo.role === "Host" && (
                <button
                  className={styles.menuItemHost}
                  onClick={() => navigate("/host/homestays")}
                >
                  <div className={styles.iconWrapperHost}>
                    <svg
                      className={styles.iconHost}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                  </div>
                  <span>Homestay Manager</span>
                </button>
              )}

              {/* Divider if role-based item exists */}
              {(userInfo.role === "Admin" || userInfo.role === "Host") && (
                <div className={styles.divider}></div>
              )}

              {/* Regular menu items */}
              <button
                className={
                  location.pathname === "/user"
                    ? `${styles.menuItem} ${styles.menuItemActive}`
                    : styles.menuItem
                }
                onClick={() => navigate("/user")}
              >
                <div className={styles.iconWrapper}>
                  <svg
                    className={styles.icon}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <span className={styles.truncate} title="Thông tin cá nhân">
                  Thông tin cá nhân
                </span>
              </button>

              <button
                className={
                  location.pathname === "/user/booking-history"
                    ? `${styles.menuItem} ${styles.menuItemActive}`
                    : styles.menuItem
                }
                onClick={() => navigate("/user/booking-history")}
              >
                <div className={styles.iconWrapper}>
                  <svg
                    className={styles.icon}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span className={styles.truncate} title="Lịch sử đặt phòng">
                  Lịch sử đặt phòng
                </span>
              </button>

              <button
                className={
                  location.pathname === "/user/promotions"
                    ? `${styles.menuItem} ${styles.menuItemActive}`
                    : styles.menuItem
                }
                onClick={() => navigate("/user/promotions")}
              >
                <div className={styles.iconWrapper}>
                  <svg
                    className={styles.icon}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </div>
                <span className={styles.truncate} title="Khuyến mãi của tôi">
                  Khuyến mãi của tôi
                </span>
              </button>

              <div className={styles.divider}></div>

              <button className={styles.menuItemLogout} onClick={handleLogout}>
                <div className={styles.iconWrapperLogout}>
                  <svg
                    className={styles.iconLogout}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </div>
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>

          {/* Notification Bell - bên phải user button */}
          <NotificationBell />
        </>
      ) : (
        <button
          onClick={() => openAuth("login")}
          className={styles.loginButton}
        >
          <span>Đăng nhập</span>
          <svg
            className={styles.loginIcon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default UserActions;
