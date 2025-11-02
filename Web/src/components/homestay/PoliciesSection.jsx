import React from "react";

const PoliciesSection = ({ policies }) => {
  // If no policies provided, show default fallback
  if (!policies) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">
          Điều khoản và điều kiện
        </h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Thời gian nhận phòng: 14:00 - 22:00</li>
          <li>• Thời gian trả phòng: 08:00 - 12:00</li>
          <li>• Có thể hủy miễn phí trước 24 giờ check-in</li>
          <li>• Không được phép hút thuốc trong phòng</li>
          <li>• Không được tổ chức tiệc tùng, gây ồn ào</li>
        </ul>
      </div>
    );
  }

  return (
    <div className="border-b pb-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Chính sách đặt phòng
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Check-in/Check-out Times */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">
              Thời gian nhận/trả phòng
            </h3>
            <div className="flex flex-col text-gray-700 space-y-1">
              <div className="flex items-center">
                <i className="fas fa-sign-in-alt text-rose-500 w-6"></i>
                <span>Nhận phòng: từ {policies.checkIn}</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-sign-out-alt text-rose-500 w-6"></i>
                <span>Trả phòng: trước {policies.checkOut}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cancellation Policy */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">
              Chính sách hủy phòng
            </h3>
            <div className="text-gray-700">
              <div className="flex items-start">
                <i className="fas fa-calendar-alt text-rose-500 mt-1 mr-2"></i>
                <span>{policies.cancellation}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliciesSection;
