import { useState } from "react";
import AIChatManager from "./AIChatManager";
import "./styles/chat.css";

const AIChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* AI Chat Manager */}
      {isOpen && <AIChatManager onClose={handleClose} />}

      {/* AI Chat Button */}
      <div className="fixed bottom-24 right-6 z-40 ai-button-container">
        <div className="relative">
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-3 bg-gradient-to-br from-slate-50 to-white border border-slate-200 px-5 py-3 rounded-2xl shadow-xl backdrop-blur-sm ai-tooltip">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Trực tuyến
              </span>
            </div>
            <div className="font-bold text-slate-900 text-base whitespace-nowrap">
              AI Assistant
            </div>
            <div className="text-slate-600 text-sm whitespace-nowrap">
              Hỗ trợ đặt phòng 24/7
            </div>
          </div>

          {/* Animated Ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 opacity-20 animate-ping"></div>

          {/* Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="relative w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 text-white shadow-2xl hover:shadow-violet-500/50 transition-all duration-500 hover:scale-110 flex items-center justify-center group overflow-hidden ai-main-button"
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 ai-shimmer"></div>

            {/* Modern AI Brain Icon */}
            <div className="relative z-10">
              <svg
                className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300 ai-icon-float"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  fill="currentColor"
                  className="opacity-20"
                />
                <circle cx="12" cy="12" r="3" fill="currentColor" />
                <path
                  d="M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C16.97 21 21 16.97 21 12C21 7.03 16.97 3 12 3ZM12 19C8.13 19 5 15.87 5 12C5 8.13 8.13 5 12 5C15.87 5 19 8.13 19 12C19 15.87 15.87 19 12 19Z"
                  stroke="currentColor"
                  strokeWidth="1"
                  fill="none"
                />
                <circle cx="8" cy="10" r="1" fill="currentColor" />
                <circle cx="16" cy="10" r="1" fill="currentColor" />
                <path
                  d="M9 14C9.5 15 10.5 16 12 16C13.5 16 14.5 15 15 14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default AIChatButton;
