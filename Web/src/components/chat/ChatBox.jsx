import { useState, useEffect, useRef } from "react";
import { useChatBox, useMessages } from "../../hooks/useChat";
import { getImageUrl } from "../../utils/imageUrl";
import { useAuth } from "../../hooks/useAuth";

const ChatBox = ({ hostId, homestayId, hostName, hostAvatar, onClose }) => {
  const { user } = useAuth();
  const {
    conversationId,
    loading: loadingConversation,
    initConversation,
    isFirebaseAuthenticated,
  } = useChatBox(hostId, homestayId);
  const {
    messages,
    loading: loadingMessages,
    sendMessage,
  } = useMessages(conversationId);
  const [inputMessage, setInputMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Init conversation khi Firebase đã authenticate
  useEffect(() => {
    if (isFirebaseAuthenticated && !conversationId && !loadingConversation) {
      initConversation();
    }
  }, [
    isFirebaseAuthenticated,
    conversationId,
    loadingConversation,
    initConversation,
  ]);
  console.log(hostAvatar);
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim() || sending || !conversationId) return;

    setSending(true);
    const result = await sendMessage(inputMessage.trim());

    if (result.success) {
      setInputMessage("");
    }
    setSending(false);
  };

  return (
    <div className="fixed bottom-4 right-4 w-[360px] bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] overflow-hidden z-50">
      {/* Header - Telegram style */}
      <div className="bg-[#2481CC] text-white px-3 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
              {hostAvatar ? (
                <img
                  src={getImageUrl(hostAvatar)}
                  alt={hostName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-medium text-base">
                  {hostName?.charAt(0)?.toUpperCase() || "H"}
                </span>
              )}
            </div>
            {/* Online status */}
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#4EC46E] rounded-full border-2 border-[#2481CC]"></div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-[14px] truncate leading-tight">
              {hostName || "Chủ nhà"}
            </h3>
            <p className="text-[12px] text-white/80 leading-tight">online</p>
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

      {/* Messages - Telegram style */}
      {!isMinimized && (
        <>
          <div className="h-[420px] overflow-y-auto px-2.5 py-2 bg-[#0F1419] telegram-pattern">
            {loadingConversation || loadingMessages ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="w-10 h-10 border-3 border-[#2481CC]/30 border-t-[#2481CC] rounded-full animate-spin"></div>
              </div>
            ) : !conversationId ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="w-10 h-10 border-3 border-[#2481CC]/30 border-t-[#2481CC] rounded-full animate-spin"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <div className="w-16 h-16 bg-[#2481CC]/10 rounded-full flex items-center justify-center mb-3">
                  <svg
                    className="w-8 h-8 text-[#2481CC]/50"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                  </svg>
                </div>
                <p className="text-white/60 text-sm">Chưa có tin nhắn nào</p>
              </div>
            ) : (
              <div className="space-y-[2px]">
                {messages.map((message, index) => {
                  const isMyMessage = message.senderId === user?.userId;
                  const prevMessage = messages[index - 1];
                  const nextMessage = messages[index + 1];
                  const showDate =
                    !prevMessage ||
                    new Date(message.sentAt).toDateString() !==
                      new Date(prevMessage.sentAt).toDateString();
                  const isGroupStart =
                    !prevMessage || prevMessage.senderId !== message.senderId;
                  const isGroupEnd =
                    !nextMessage || nextMessage.senderId !== message.senderId;

                  return (
                    <div key={message.id}>
                      {/* Date divider */}
                      {showDate && (
                        <div className="flex items-center justify-center my-4">
                          <span className="bg-[#2B5278]/80 backdrop-blur-sm text-white/90 text-xs px-3 py-1 rounded-full">
                            {new Date(message.sentAt).toLocaleDateString(
                              "vi-VN",
                              { day: "numeric", month: "long" }
                            )}
                          </span>
                        </div>
                      )}

                      <div
                        className={`flex items-end gap-1.5 ${
                          isMyMessage ? "justify-end" : "justify-start"
                        } ${isGroupStart ? "mt-2" : "mt-0.5"}`}
                      >
                        {/* Avatar - chỉ hiện ở tin nhắn cuối của group */}
                        {!isMyMessage && (
                          <div className="w-8 h-8 rounded-full flex-shrink-0 mb-0.5">
                            {isGroupEnd && hostAvatar ? (
                              <img
                                src={getImageUrl(hostAvatar)}
                                alt={hostName}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : isGroupEnd ? (
                              <div className="w-full h-full rounded-full bg-[#2481CC] flex items-center justify-center">
                                <span className="text-white text-xs font-medium">
                                  {hostName?.charAt(0)?.toUpperCase() || "H"}
                                </span>
                              </div>
                            ) : null}
                          </div>
                        )}

                        {/* Message bubble */}
                        <div
                          className={`max-w-[70%] ${
                            isMyMessage ? "ml-auto" : ""
                          }`}
                        >
                          <div
                            className={`px-3 py-2 ${
                              isMyMessage
                                ? "bg-[#2481CC] text-white rounded-l-xl rounded-tr-xl"
                                : "bg-[#182533] text-white rounded-r-xl rounded-tl-xl"
                            } ${
                              isGroupStart && !isMyMessage
                                ? "rounded-tl-sm"
                                : ""
                            } ${
                              isGroupEnd && !isMyMessage ? "rounded-bl-sm" : ""
                            } ${
                              isGroupStart && isMyMessage ? "rounded-tr-sm" : ""
                            } ${
                              isGroupEnd && isMyMessage ? "rounded-br-sm" : ""
                            }`}
                          >
                            <p className="text-[14.5px] leading-[1.4] break-words whitespace-pre-wrap">
                              {message.content || message.message}
                            </p>

                            {/* Time and status */}
                            <div className="flex items-center justify-end gap-1 mt-1">
                              <span
                                className={`text-[11px] ${
                                  isMyMessage
                                    ? "text-white/70"
                                    : "text-white/50"
                                }`}
                              >
                                {new Date(
                                  message.sentAt || message.timestamp
                                ).toLocaleTimeString("vi-VN", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                              {isMyMessage && (
                                <span className="ml-0.5">
                                  {message.isRead ? (
                                    <svg
                                      className="w-4 h-4 text-white/70"
                                      viewBox="0 0 18 13"
                                      fill="none"
                                    >
                                      <path
                                        d="M6 10.2L1.8 6L0.4 7.4L6 13L18 1L16.6-0.4L6 10.2Z"
                                        fill="currentColor"
                                      />
                                      <path
                                        d="M11 10.2L6.8 6L5.4 7.4L11 13L23 1L21.6-0.4L11 10.2Z"
                                        fill="currentColor"
                                      />
                                    </svg>
                                  ) : (
                                    <svg
                                      className="w-4 h-4 text-white/50"
                                      viewBox="0 0 12 10"
                                      fill="none"
                                    >
                                      <path
                                        d="M4 7.4L1.4 4.8L0 6.2L4 10.2L12 2.2L10.6 0.8L4 7.4Z"
                                        fill="currentColor"
                                      />
                                    </svg>
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input - Telegram style */}
          <form
            onSubmit={handleSendMessage}
            className="px-2.5 py-2 bg-white border-t border-gray-200"
          >
            <div className="flex items-end gap-1.5">
              <div className="flex-1 bg-white border border-gray-300 rounded-full px-3 py-1.5 focus-within:border-[#2481CC] transition-colors">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Nhắn tin..."
                  className="w-full text-[14px] outline-none bg-transparent placeholder:text-gray-400"
                  disabled={sending || !conversationId}
                />
              </div>
              <button
                type="submit"
                disabled={!inputMessage.trim() || sending || !conversationId}
                className="w-8 h-8 bg-[#2481CC] text-white rounded-full flex items-center justify-center hover:bg-[#1f73b7] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                title="Gửi"
              >
                {sending ? (
                  <svg
                    className="w-5 h-5 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                )}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default ChatBox;
