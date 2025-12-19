import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldOff, Home, ArrowLeft } from "lucide-react";

/**
 * Trang Access Denied - Hiển thị khi user không có quyền truy cập
 */
const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-red-200 blur-3xl opacity-40 rounded-full"></div>
            <div className="relative bg-white rounded-full p-6 shadow-xl border-4 border-red-100">
              <ShieldOff className="w-24 h-24 text-red-500" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 mb-8">
          <h1 className="text-6xl font-bold text-gray-900">403</h1>
          <h2 className="text-3xl font-bold text-gray-800">
            Truy cập bị từ chối
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Xin lỗi, bạn không có quyền truy cập vào trang này. Vui lòng liên hệ
            quản trị viên nếu bạn cho rằng đây là lỗi.
          </p>
        </div>

        {/* Additional Info */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 max-w-md mx-auto">
          <p className="text-sm text-red-800">
            <strong>Lưu ý:</strong> Trang này yêu cầu quyền truy cập đặc biệt.
            Hãy đảm bảo bạn đã đăng nhập với tài khoản có quyền phù hợp.
          </p>
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
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5" />
            Về trang chủ
          </button>
        </div>

        {/* Support Link */}
        <div className="mt-8 text-sm text-gray-500">
          Cần hỗ trợ?{" "}
          <a
            href="mailto:support@bookinghomestay.com"
            className="text-red-600 hover:text-red-700 font-medium underline"
          >
            Liên hệ với chúng tôi
          </a>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
