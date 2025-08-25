import React from "react";
import styles from "./Navbar.module.css";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { useAuth } from "../contexts/useAuth";
const AuthPopup = ({
  showAuth,
  authMode,
  setAuthMode,
  closeAuth,
  setShowAuth,
}) => {
  const { handleGoogleLogin } = useAuth();
  return (
    <>
      {showAuth && (
        <div className={styles.authOverlay} onClick={closeAuth}>
          <div
            className={styles.authPopup}
            style={{ pointerEvents: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col">
              {/* Form Panel */}
              <div className="w-full py-4 px-4">
                <button className={styles.closeButton} onClick={closeAuth}>
                  <i className="fas fa-times"></i>
                </button>
                <div className={styles.popupHeader}>
                  <h2 className={styles.popupTitle}>
                    {authMode === "login"
                      ? "Đăng nhập"
                      : authMode === "register"
                      ? "Tạo tài khoản"
                      : authMode === "forgot"
                      ? "Quên mật khẩu"
                      : ""}
                  </h2>
                  <p className={styles.popupDesc}>
                    {authMode === "login"
                      ? "Nhập thông tin để tiếp tục"
                      : authMode === "register"
                      ? "Bắt đầu với tài khoản của bạn"
                      : authMode === "forgot"
                      ? "Nhập email để nhận hướng dẫn lấy lại mật khẩu"
                      : ""}
                  </p>
                </div>
                {authMode === "login" ? (
                  <LoginForm
                    switchToRegister={() => setAuthMode("register")}
                    small
                    setShowAuth={setShowAuth}
                    switchToForgot={() => setAuthMode("forgot")}
                  />
                ) : authMode === "register" ? (
                  <RegisterForm
                    switchToLogin={() => setAuthMode("login")}
                    small
                  />
                ) : authMode === "forgot" ? (
                  <ForgotPasswordForm
                    switchToLogin={() => setAuthMode("login")}
                  />
                ) : null}
                <div className={styles.popupDividerWrap}>
                  <div className={styles.popupDivider}></div>
                  <span className={styles.popupDividerText}>
                    Hoặc tiếp tục với
                  </span>
                </div>
                <button
                  className={styles.googleButton}
                  onClick={handleGoogleLogin}
                >
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    className={styles.googleIcon}
                  />
                  <span>Google</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthPopup;
