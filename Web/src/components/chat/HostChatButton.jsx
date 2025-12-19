import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import ChatBox from "./ChatBox";
import { MessageSquare } from "lucide-react";

/**
 * Button for host to chat with customer
 * Props: customerId, customerName, customerAvatar, homestayId
 */
const HostChatButton = ({
  customerId,
  customerName,
  customerAvatar,
  homestayId,
  className = "",
}) => {
  const { user } = useAuth();
  const [showChat, setShowChat] = useState(false);

  const handleOpenChat = () => {
    if (!user) {
      window.dispatchEvent(
        new CustomEvent("AUTH_POPUP_EVENT", {
          detail: {
            type: "openAuthPopup",
            mode: "login",
            message: "Vui lòng đăng nhập để nhắn tin với khách hàng",
          },
        })
      );
      return;
    }

    setShowChat(true);
  };

  // Prevent chat if trying to chat with self
  const isSelf = user && String(user.userId) === String(customerId);

  return (
    <>
      <button
        onClick={handleOpenChat}
        disabled={isSelf}
        className={
          className ||
          `flex-1 px-3 py-2 ${
            isSelf
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          } rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-semibold`
        }
        title={
          isSelf
            ? "Không thể nhắn tin với chính mình"
            : "Nhắn tin với khách hàng"
        }
      >
        <MessageSquare className="h-4 w-4" />
        Nhắn tin với Khách
      </button>

      {showChat && user && !isSelf && (
        <ChatBox
          hostId={customerId}
          homestayId={homestayId}
          hostName={customerName}
          hostAvatar={customerAvatar}
          onClose={() => setShowChat(false)}
          isHostMode={true}
        />
      )}
    </>
  );
};

export default HostChatButton;
