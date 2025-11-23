import { useState } from "react";
import ChatBox from "./ChatBox";
import AIChatSessions from "./AIChatSessions";
import AIChatHistory from "./AIChatHistory";

const AIChatManager = ({ onClose }) => {
  const [view, setView] = useState("chat"); // 'chat', 'sessions', 'history'
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  const handleSelectSession = (sessionId) => {
    setSelectedSessionId(sessionId);
    setView("history");
  };

  const handleBackToChat = () => {
    setView("chat");
    setSelectedSessionId(null);
  };

  const handleViewSessions = () => {
    setView("sessions");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {view === "chat" && (
        <div className="relative">
          <ChatBox
            hostId="ai-support"
            homestayId={null}
            hostName="AI Assistant"
            hostAvatar={null}
            onClose={onClose}
            isAIChat={true}
          />

          {/* Sessions button */}
          <button
            onClick={handleViewSessions}
            className="absolute -left-12 top-4 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors shadow-lg"
            title="Xem lịch sử chat"
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>
      )}

      {view === "sessions" && (
        <div className="w-[400px] h-[500px] bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={handleBackToChat}
                className="hover:bg-white/10 p-1 rounded transition-colors"
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
              <h3 className="font-medium">Lịch sử trò chuyện</h3>
            </div>
            <button
              onClick={onClose}
              className="hover:bg-white/10 p-2 rounded transition-colors"
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

          {/* Sessions List */}
          <AIChatSessions
            onSelectSession={handleSelectSession}
            selectedSessionId={selectedSessionId}
          />
        </div>
      )}

      {view === "history" && selectedSessionId && (
        <div className="w-[400px] h-[500px] bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView("sessions")}
                className="hover:bg-white/10 p-1 rounded transition-colors"
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
              <h3 className="font-medium">Chi tiết cuộc trò chuyện</h3>
            </div>
            <button
              onClick={onClose}
              className="hover:bg-white/10 p-2 rounded transition-colors"
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

          {/* Chat History */}
          <AIChatHistory sessionId={selectedSessionId} />
        </div>
      )}
    </div>
  );
};

export default AIChatManager;
