import { useState } from "react";
import { useAIChatSessions, useAIChatHistory } from "../../hooks/useAIChat";
import LoadingSpinner from "../common/LoadingSpinner";

const AIChatSessions = ({ onSelectSession, selectedSessionId }) => {
  const { sessions, loading, error, reload } = useAIChatSessions();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
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
          onClick={reload}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {sessions.length === 0 ? (
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-indigo-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2c4.41 0 8 3.59 8 8s-3.59 8-8 8-8-3.59-8-8 3.59-8 8-8z" />
                <circle cx="9" cy="9" r="1" />
                <circle cx="15" cy="9" r="1" />
                <path
                  d="M9 14c.5 1 1.5 2 3 2s2.5-1 3-2"
                  stroke="currentColor"
                  strokeWidth="1"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chưa có cuộc trò chuyện
            </h3>
            <p className="text-gray-500 text-sm">
              Bắt đầu trò chuyện với AI để nhận hỗ trợ đặt phòng
            </p>
          </div>
        ) : (
          <div className="space-y-2 p-4">
            {sessions.map((session) => (
              <div
                key={session.sessionId}
                onClick={() => onSelectSession(session.sessionId)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedSessionId === session.sessionId
                    ? "bg-indigo-50 border-indigo-200"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {session.title ||
                        `Cuộc trò chuyện ${session.sessionId.slice(0, 8)}`}
                    </h4>
                    {session.lastMessage && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {session.lastMessage}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-400">
                        {new Date(session.lastActivityAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          session.status === "ACTIVE"
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {session.status}
                      </span>
                      {session.unreadCount > 0 && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                          {session.unreadCount} chưa đọc
                        </span>
                      )}
                    </div>
                  </div>

                  {selectedSessionId === session.sessionId && (
                    <div className="flex-shrink-0 ml-2">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t bg-gray-50 p-4">
        <button
          onClick={reload}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
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
          Làm mới
        </button>
      </div>
    </div>
  );
};

export default AIChatSessions;
