import React from "react";
import { useNavigate } from "react-router-dom";
import { FileQuestion, Home, Search, ArrowLeft } from "lucide-react";

/**
 * Trang 404 Not Found - Hiển thị khi route không tồn tại
 */
const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Animated Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-200 blur-3xl opacity-40 rounded-full animate-pulse"></div>
            <div className="relative bg-white rounded-full p-6 shadow-xl border-4 border-blue-100">
              <FileQuestion className="w-24 h-24 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 mb-8">
          <h1 className="text-8xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-3xl font-bold text-gray-800">
            Không tìm thấy trang
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di
            chuyển. Hãy kiểm tra lại URL hoặc quay về trang chủ.
          </p>
        </div>

        {/* Search Suggestion */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 max-w-md mx-auto">
          <div className="flex items-start gap-3">
            <Search className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
            <div className="text-left">
              <h3 className="font-semibold text-blue-900 mb-1">
                Một số gợi ý:
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Kiểm tra lại chính tả trong URL</li>
                <li>• Sử dụng thanh tìm kiếm để tìm homestay</li>
                <li>• Quay về trang chủ để khám phá</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all font-medium shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5" />
            Về trang chủ
          </button>
        </div>

        {/* Popular Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4">
            Hoặc khám phá các trang phổ biến:
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => navigate("/homestays")}
              className="px-4 py-2 text-sm bg-white border border-gray-200 text-gray-700 rounded-lg hover:border-blue-300 hover:text-blue-600 transition-colors"
            >
              Tìm homestay
            </button>
            <button
              onClick={() => navigate("/about")}
              className="px-4 py-2 text-sm bg-white border border-gray-200 text-gray-700 rounded-lg hover:border-blue-300 hover:text-blue-600 transition-colors"
            >
              Về chúng tôi
            </button>
            <button
              onClick={() => navigate("/news")}
              className="px-4 py-2 text-sm bg-white border border-gray-200 text-gray-700 rounded-lg hover:border-blue-300 hover:text-blue-600 transition-colors"
            >
              Tin tức
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
