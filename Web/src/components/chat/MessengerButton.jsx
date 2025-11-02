import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import MessengerChat from "./MessengerChat";

const MessengerButton = () => {
  const { user } = useAuth();
  const [showMessenger, setShowMessenger] = useState(false);

  const handleToggleMessenger = () => {
    if (!user) {
      // Hiển thị popup đăng nhập
      window.dispatchEvent(
        new CustomEvent("AUTH_POPUP_EVENT", {
          detail: {
            type: "openAuthPopup",
            mode: "login",
            message: "Vui lòng đăng nhập để sử dụng tính năng chat",
          },
        })
      );
      return;
    }

    setShowMessenger(true);
  };

  const handleClose = () => {
    setShowMessenger(false);
  };

  return (
    <>
      {/* Floating Button - Chỉ hiện khi messenger đóng */}
      {!showMessenger && (
        <button
          onClick={handleToggleMessenger}
          className="fixed bottom-6 right-6 w-14 h-14 bg-[#2481CC] text-white rounded-full shadow-lg hover:bg-[#1f73b7] transition-all hover:scale-110 z-40 flex items-center justify-center"
          title="Tin nhắn"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17l-.59.59-.58.58V4h16v12zm-9-4h2v2h-2zm0-6h2v4h-2z" />
          </svg>
        </button>
      )}

      {/* Messenger Chat */}
      {showMessenger && user && <MessengerChat onClose={handleClose} />}
    </>
  );
};

export default MessengerButton;
