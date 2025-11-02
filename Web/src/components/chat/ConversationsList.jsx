import { useState, useEffect } from "react";
import { useConversations } from "../../hooks/useChat";
import { getImageUrl } from "../../utils/imageUrl";
import { useAuth } from "../../hooks/useAuth";

const ConversationsList = ({ onSelectConversation }) => {
  const { user } = useAuth();
  const { conversations, loading, error, reload } = useConversations();
  const [searchQuery, setSearchQuery] = useState("");
  console.log("Conversations:", conversations);
  // Helper function để lấy thông tin người chat (không phải mình)
  const getOtherParticipant = (conversation) => {
    const isHost = user?.userId === conversation.hostId;

    if (isHost) {
      // Nếu mình là host → Hiển thị thông tin user
      return {
        name: conversation.userName || "Người dùng",
        avatar: conversation.userAvatar,
        id: conversation.userId,
      };
    } else {
      // Nếu mình là user → Hiển thị thông tin host
      return {
        name: conversation.hostName || "Chủ nhà",
        avatar: conversation.hostAvatar,
        id: conversation.hostId,
      };
    }
  };

  // Helper function để lấy unreadCount dựa trên role
  const getUnreadCount = (conversation) => {
    const isHost = user?.userId === conversation.hostId;
    return isHost
      ? conversation.unreadCountForHost || 0
      : conversation.unreadCountForUser || 0;
  };

  // Filter conversations theo search query
  const filteredConversations = conversations.filter((conv) => {
    const searchLower = searchQuery.toLowerCase();
    const otherParticipant = getOtherParticipant(conv);
    return (
      otherParticipant.name?.toLowerCase().includes(searchLower) ||
      conv.homestayName?.toLowerCase().includes(searchLower) ||
      conv.lastMessage?.toLowerCase().includes(searchLower)
    );
  });

  const formatTime = (timestamp) => {
    if (!timestamp) return "";

    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffMs = now - messageTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút`;
    if (diffHours < 24) return `${diffHours} giờ`;
    if (diffDays < 7) return `${diffDays} ngày`;

    return messageTime.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Search Bar */}
      <div className="p-2.5 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm..."
            className="w-full bg-gray-100 rounded-full px-4 py-2 pl-10 text-sm outline-none focus:bg-gray-200 transition-colors"
          />
          <svg
            className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-10 h-10 border-3 border-[#2481CC]/30 border-t-[#2481CC] rounded-full animate-spin"></div>
            <p className="text-gray-500 text-sm mt-3">Đang tải...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full px-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-2">
              <svg
                className="w-6 h-6 text-red-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
            </div>
            <p className="text-gray-700 text-sm font-medium">{error}</p>
            <button
              onClick={reload}
              className="mt-3 px-4 py-2 bg-[#2481CC] text-white text-sm rounded-lg hover:bg-[#1f73b7] transition-colors"
            >
              Thử lại
            </button>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-6 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
              </svg>
            </div>
            <p className="text-gray-600 font-medium">
              {searchQuery ? "Không tìm thấy kết quả" : "Chưa có tin nhắn nào"}
            </p>
            <p className="text-gray-500 text-sm mt-1">
              {searchQuery
                ? "Thử tìm kiếm với từ khóa khác"
                : "Bắt đầu trò chuyện với chủ nhà"}
            </p>
          </div>
        ) : (
          <div>
            {filteredConversations.map((conversation) => {
              const otherParticipant = getOtherParticipant(conversation);

              return (
                <button
                  key={conversation.conversationId}
                  onClick={() => onSelectConversation(conversation)}
                  className="w-full px-3 py-2.5 flex items-center gap-3 hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-0"
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {otherParticipant.avatar ? (
                        <img
                          src={getImageUrl(otherParticipant.avatar)}
                          alt={otherParticipant.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-600 font-medium text-lg">
                          {otherParticipant.name?.charAt(0)?.toUpperCase() ||
                            "?"}
                        </span>
                      )}
                    </div>
                    {/* Unread badge */}
                    {getUnreadCount(conversation) > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold">
                          {getUnreadCount(conversation) > 9
                            ? "9+"
                            : getUnreadCount(conversation)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4
                        className={`text-[14px] truncate ${
                          getUnreadCount(conversation) > 0
                            ? "font-semibold text-gray-900"
                            : "font-medium text-gray-800"
                        }`}
                      >
                        {otherParticipant.name}
                      </h4>
                      <span className="text-[11px] text-gray-500 ml-2 flex-shrink-0">
                        {formatTime(conversation.lastMessageAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <p
                        className={`text-[13px] truncate ${
                          getUnreadCount(conversation) > 0
                            ? "font-medium text-gray-900"
                            : "text-gray-600"
                        }`}
                      >
                        {conversation.lastMessage || "Chưa có tin nhắn"}
                      </p>
                    </div>
                    {conversation.homestayName && (
                      <p className="text-[11px] text-gray-500 truncate mt-0.5">
                        📍 {conversation.homestayName}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationsList;
