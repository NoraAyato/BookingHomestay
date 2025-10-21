import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import ChatBox from "./ChatBox";

const ChatButton = ({ hostId, homestayId, hostName, hostAvatar }) => {
  const { user } = useAuth();
  const [showChat, setShowChat] = useState(false);

  const handleOpenChat = () => {
    if (!user) {
      // Hiển thị popup đăng nhập
      window.dispatchEvent(
        new CustomEvent("AUTH_POPUP_EVENT", {
          detail: {
            type: "openAuthPopup",
            mode: "login",
            message: "Vui lòng đăng nhập để nhắn tin với chủ nhà",
          },
        })
      );
      return;
    }

    setShowChat(true);
  };

  return (
    <>
      <button
        onClick={handleOpenChat}
        className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-white border-2 border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors font-medium"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <span>Liên hệ chủ nhà</span>
      </button>

      {showChat && user && (
        <ChatBox
          hostId={hostId}
          homestayId={homestayId}
          hostName={hostName}
          hostAvatar={hostAvatar}
          onClose={() => setShowChat(false)}
        />
      )}
    </>
  );
};

export default ChatButton;
