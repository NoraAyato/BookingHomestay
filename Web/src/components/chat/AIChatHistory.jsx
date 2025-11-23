import { useAIChatHistory } from "../../hooks/useAIChat";
import { useAuth } from "../../hooks/useAuth";
import LoadingSpinner from "../common/LoadingSpinner";

const AIChatHistory = ({ sessionId }) => {
  const { user } = useAuth();
  const { history, loading, error, hasMore, loadMore, refresh } =
    useAIChatHistory(sessionId);

  if (loading && history.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && history.length === 0) {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 mb-4">
          <svg
            className="w-12 h-12 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm">{error}</p>
        </div>
        <button
          onClick={refresh}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {history.length === 0 ? (
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-indigo-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">
              Chưa có tin nhắn trong phiên này
            </p>
          </div>
        ) : (
          <>
            {/* Load more button - style giống Messenger */}
            {hasMore && (
              <div className="text-center py-3">
                <button
                  onClick={() => {
                    const container =
                      document.querySelector(".overflow-y-auto");
                    if (!container) {
                      loadMore();
                      return;
                    }

                    // Lưu vị trí scroll
                    const previousScrollHeight = container.scrollHeight;
                    const previousScrollTop = container.scrollTop;

                    loadMore();

                    // Restore scroll sau khi load xong
                    setTimeout(() => {
                      const newScrollHeight = container.scrollHeight;
                      const scrollDiff = newScrollHeight - previousScrollHeight;
                      container.scrollTop = previousScrollTop + scrollDiff;
                    }, 100);
                  }}
                  disabled={loading}
                  className="flex items-center gap-2 mx-auto bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
                      <span>Đang tải...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                      <span>Xem tin nhắn cũ hơn</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Messages */}
            {history.map((message, index) => {
              const isMyMessage =
                message.senderId === user?.userId ||
                message.senderId !== "ai-assistant";

              return (
                <div
                  key={message.id || index}
                  className={`flex ${
                    isMyMessage ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] ${isMyMessage ? "ml-auto" : ""}`}
                  >
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        isMyMessage
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-200 text-gray-900"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {message.content}
                      </p>

                      <div
                        className={`flex items-center justify-end gap-1 mt-1`}
                      >
                        <span
                          className={`text-xs ${
                            isMyMessage ? "text-white/70" : "text-gray-500"
                          }`}
                        >
                          {new Date(message.timestamp).toLocaleTimeString(
                            "vi-VN",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                    </div>

                    {!isMyMessage && (
                      <div className="flex items-center gap-1 mt-1 ml-2">
                        <div className="w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center">
                          <svg
                            className="w-2.5 h-2.5 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                            <circle cx="9" cy="9" r="1" />
                            <circle cx="15" cy="9" r="1" />
                          </svg>
                        </div>
                        <span className="text-xs text-gray-500">
                          {message.senderName || "AI Assistant"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Refresh button */}
      <div className="border-t bg-gray-50 p-4">
        <button
          onClick={refresh}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {loading ? "Đang làm mới..." : "Làm mới"}
        </button>
      </div>
    </div>
  );
};

export default AIChatHistory;
