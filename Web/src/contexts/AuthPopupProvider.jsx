import React, { createContext, useContext, useState, useEffect } from "react";
import AuthPopup from "../components/auth/AuthPopup";
import { showToast } from "../components/common/Toast";
export const AuthPopupContext = createContext();

export function AuthPopupProvider({ children }) {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const openAuthPopup = (mode = "login") => {
    setAuthMode(mode);
    setShowAuth(true);
  };
  const closeAuthPopup = () => setShowAuth(false);

  // Event bus cho các logic ngoài React tree
  useEffect(() => {
    const handler = (e) => {
      if (e.detail?.type === "openAuthPopup") {
        openAuthPopup(e.detail.mode || "login");
      }
      if (e.detail?.type === "showToast" && e.detail?.message) {
        showToast("error", e.detail.message);
      }
    };
    window.addEventListener("AUTH_POPUP_EVENT", handler);
    return () => window.removeEventListener("AUTH_POPUP_EVENT", handler);
  }, []);

  const value = {
    showAuth,
    authMode,
    openAuthPopup,
    closeAuthPopup,
    setAuthMode,
    setShowAuth,
  };

  return (
    <AuthPopupContext.Provider value={value}>
      {children}
      <AuthPopup
        showAuth={showAuth}
        authMode={authMode}
        setAuthMode={setAuthMode}
        closeAuth={closeAuthPopup}
        setShowAuth={setShowAuth}
      />
    </AuthPopupContext.Provider>
  );
}

export const useAuthPopup = () => useContext(AuthPopupContext);
