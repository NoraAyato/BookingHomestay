import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { handleGoogleCallback } = useAuth();

  useEffect(() => {
    handleGoogleCallback(navigate);
  }, []);

  return <div>Đang đăng nhập Google...</div>;
};

export default GoogleCallback;
