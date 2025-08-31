import React, { useEffect, useState } from "react";
import { getAccessToken, setAuthReturnPath } from "../../utils/session";
import { Navigate, useLocation } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

export default function ProtectedRoute({ children }) {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      setIsAuthenticated(true);
    } else {
      // Lưu trữ returnTo trực tiếp vào localStorage
      setAuthReturnPath(location.pathname);
      // Chỉ gửi sự kiện để mở popup
      window.dispatchEvent(
        new CustomEvent("AUTH_POPUP_EVENT", {
          detail: {
            type: "openAuthPopup",
            mode: "login",
            to: "/",
          },
        })
      );
    }
    setIsCheckingAuth(false);
  }, [location.pathname]);

  if (isCheckingAuth) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
}
