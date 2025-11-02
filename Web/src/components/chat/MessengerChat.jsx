import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { authenticateFirebase } from "../../api/chat";
import ConversationsList from "./ConversationsList";
import MessengerChatBox from "./MessengerChatBox";
import { getImageUrl } from "../../utils/imageUrl";

const MessengerChat = ({ onClose }) => {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isFirebaseAuthenticated, setIsFirebaseAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  // Authenticate với Firebase khi component mount
  useEffect(() => {
    const initFirebase = async () => {
      setLoading(true);
      const result = await authenticateFirebase();
      if (result.success) {
        setIsFirebaseAuthenticated(true);
        console.log("✅ Firebase authenticated successfully!");
      } else {
        console.error(
          "❌ Failed to authenticate with Firebase:",
          result.message
        );
      }
      setLoading(false);
    };

    if (user) {
      initFirebase();
    }
  }, [user]);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
  };

  // Helper function để lấy thông tin người chat
  const getOtherParticipant = () => {
    if (!selectedConversation) return null;

    const isHost = user?.userId === selectedConversation.hostId;

    if (isHost) {
      return {
        name: selectedConversation.userName || "Người dùng",
        avatar: selectedConversation.userAvatar,
        id: selectedConversation.userId,
      };
    } else {
      return {
        name: selectedConversation.hostName || "Chủ nhà",
        avatar: selectedConversation.hostAvatar,
        id: selectedConversation.hostId,
      };
    }
  };

  const otherParticipant = getOtherParticipant();

  return (
    <div className="fixed bottom-4 right-4 w-[360px] bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] overflow-hidden z-50">
      {/* Header */}
      <div className="bg-[#2481CC] text-white px-3 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          {/* Back button - Chỉ hiện khi đang chat */}
          {selectedConversation && (
            <button
              onClick={handleBackToList}
              className="hover:bg-white/10 p-1.5 rounded-full transition-colors flex-shrink-0"
              title="Quay lại danh sách"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {/* Avatar hoặc Icon mặc định */}
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
            {selectedConversation && otherParticipant?.avatar ? (
              <img
                src={getImageUrl(otherParticipant.avatar)}
                alt={otherParticipant.name}
                className="w-full h-full object-cover"
              />
            ) : selectedConversation && otherParticipant ? (
              <span className="text-white font-medium text-base">
                {otherParticipant.name?.charAt(0)?.toUpperCase() || "?"}
              </span>
            ) : (
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17l-.59.59-.58.58V4h16v12zm-9-4h2v2h-2zm0-6h2v4h-2z" />
              </svg>
            )}
          </div>

          {/* Title */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-[14px] truncate leading-tight">
              {otherParticipant?.name || "Tin nhắn"}
            </h3>
            <p className="text-[12px] text-white/80 leading-tight">
              {isFirebaseAuthenticated ? "Đang hoạt động" : "Đang kết nối..."}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-white/10 p-2 rounded transition-colors"
            title={isMinimized ? "Mở rộng" : "Thu nhỏ"}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMinimized ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              )}
            </svg>
          </button>
          <button
            onClick={onClose}
            className="hover:bg-white/10 p-2 rounded transition-colors"
            title="Đóng"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      {!isMinimized && (
        <div className="h-[500px] bg-white">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-10 h-10 border-3 border-[#2481CC]/30 border-t-[#2481CC] rounded-full animate-spin"></div>
              <p className="text-gray-500 text-sm mt-3">Đang kết nối...</p>
            </div>
          ) : !isFirebaseAuthenticated ? (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-3">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
              </div>
              <p className="text-gray-700 font-medium">
                Không thể kết nối đến máy chủ
              </p>
              <p className="text-gray-500 text-sm mt-1">Vui lòng thử lại sau</p>
            </div>
          ) : selectedConversation ? (
            <MessengerChatBox
              conversation={selectedConversation}
              onBack={handleBackToList}
            />
          ) : (
            <ConversationsList
              onSelectConversation={handleSelectConversation}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default MessengerChat;
