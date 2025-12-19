import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/common/AdminLayout";
import {
  Bell,
  Send,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Users,
  MessageSquare,
} from "lucide-react";
import { useBroadcastNotification } from "../../hooks/admin/useBroadcastNotification";

const BroadcastNotification = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { loading, error, success, sendNotification, reset } =
    useBroadcastNotification();

  // Reset success state after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        reset();
        setTitle("");
        setContent("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, reset]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      return;
    }

    await sendNotification(title.trim(), content.trim());
  };

  const isFormValid = title.trim() && content.trim();

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Bell className="h-7 w-7 text-blue-600" />
              Gửi thông báo cho tất cả người dùng
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Gửi thông báo đến tất cả người dùng trong hệ thống
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Tạo thông báo mới
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Điền thông tin thông báo để gửi đến tất cả người dùng
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Success Alert */}
                {success && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-green-900">
                          Gửi thành công!
                        </h4>
                        <p className="text-sm text-green-700 mt-1">
                          Thông báo đã được gửi đến tất cả người dùng trong hệ
                          thống.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Alert */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-red-900">
                          Có lỗi xảy ra
                        </h4>
                        <p className="text-sm text-red-700 mt-1">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Title Input */}
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Tiêu đề thông báo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Nhập tiêu đề thông báo..."
                    maxLength={100}
                    disabled={loading}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {title.length}/100 ký tự
                  </p>
                </div>

                {/* Content Input */}
                <div>
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nội dung thông báo <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Nhập nội dung thông báo..."
                    rows={6}
                    maxLength={500}
                    disabled={loading}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none transition-all"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {content.length}/500 ký tự
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setTitle("");
                      setContent("");
                      reset();
                    }}
                    disabled={loading}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Xóa
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !isFormValid}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Gửi thông báo
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Info Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Thông tin
              </h3>

              <div className="space-y-4">
                {/* Recipients Info */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-blue-900">
                        Người nhận
                      </h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Tất cả người dùng trong hệ thống
                      </p>
                    </div>
                  </div>
                </div>

                {/* Guidelines */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-200 rounded-lg">
                      <MessageSquare className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900">
                        Hướng dẫn
                      </h4>
                      <ul className="text-sm text-gray-600 mt-2 space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>Tiêu đề nên ngắn gọn và rõ ràng</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>Nội dung nên cung cấp đầy đủ thông tin</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>Kiểm tra kỹ trước khi gửi</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>Thông báo sẽ được gửi ngay lập tức</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Warning */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-yellow-900">
                        Lưu ý
                      </h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Thông báo sẽ được gửi đến tất cả người dùng và không thể
                        thu hồi sau khi gửi.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default BroadcastNotification;
