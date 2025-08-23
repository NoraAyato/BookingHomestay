import React from "react";
import styles from "./Navbar.module.css";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { loginWithGoogle } from "../api/auth";
import { showToast } from "./Toast";

const AuthPopup = ({
  showAuth,
  authMode,
  setAuthMode,
  closeAuth,
  setUserInfo,
  setShowAuth,
}) => {
  // Thêm script Google Identity Services khi mount
  React.useEffect(() => {
    if (!window.google && showAuth) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [showAuth]);

  // Xử lý đăng nhập Google
  const handleGoogleLogin = () => {
    if (!window.google || !window.google.accounts) {
      showToast("error", "Không thể khởi tạo Google Login");
      return;
    }
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async (response) => {
        const idToken = response.credential;
        try {
          const res = await loginWithGoogle(idToken);
          if (res.success) {
            showToast("success", "Đăng nhập Google thành công!");
            if (closeAuth) closeAuth();
            // Xử lý lưu user nếu cần
          } else {
            showToast("error", res.message || "Đăng nhập Google thất bại");
          }
        } catch {
          showToast("error", "Đăng nhập Google thất bại");
        }
      },
    });
    window.google.accounts.id.prompt();
  };

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
                    {authMode === "login" ? "Đăng nhập" : "Tạo tài khoản"}
                  </h2>
                  <p className={styles.popupDesc}>
                    {authMode === "login"
                      ? "Nhập thông tin để tiếp tục"
                      : "Bắt đầu với tài khoản của bạn"}
                  </p>
                </div>
                {authMode === "login" ? (
                  <LoginForm
                    switchToRegister={() => setAuthMode("register")}
                    small
                    setUserInfo={setUserInfo}
                    setShowAuth={setShowAuth}
                  />
                ) : (
                  <RegisterForm
                    switchToLogin={() => setAuthMode("login")}
                    small
                  />
                )}
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
