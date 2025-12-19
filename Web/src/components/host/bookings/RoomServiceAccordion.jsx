import React, { useState } from "react";
import { ChevronDown, ChevronUp, BedDouble, Sparkles } from "lucide-react";

const RoomServiceAccordion = ({ rooms, commonServices, pricing }) => {
  const [expandedRooms, setExpandedRooms] = useState([]);

  const toggleRoom = (roomId) => {
    setExpandedRooms((prev) =>
      prev.includes(roomId)
        ? prev.filter((id) => id !== roomId)
        : [...prev, roomId]
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (!rooms || rooms.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Không có thông tin phòng
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <BedDouble className="h-5 w-5 text-blue-600" />
        Chi tiết phòng và dịch vụ
      </h3>

      {/* Rooms */}
      {rooms.map((room, index) => {
        const isExpanded = expandedRooms.includes(room.id);
        const totalRoomCost =
          room.subtotal +
          (room.services?.reduce((sum, s) => sum + s.subtotal, 0) || 0);

        return (
          <div
            key={room.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            {/* Room Header */}
            <button
              onClick={() => toggleRoom(room.id)}
              className="w-full px-4 py-3 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <div className="text-left">
                  <span className="text-sm font-bold text-gray-900 block">
                    {room.roomName}
                  </span>
                  <span className="text-xs text-gray-600">
                    {room.roomType} • {room.quantity} phòng
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-blue-600">
                  {formatCurrency(totalRoomCost)}
                </span>
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </button>

            {/* Room Details */}
            {isExpanded && (
              <div className="p-4 bg-white space-y-3">
                {/* Room Price */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Giá phòng
                      </p>
                      <p className="text-xs text-gray-500">
                        {room.quantity} phòng ×{" "}
                        {room.pricePerNight?.toLocaleString("vi-VN")}₫/đêm
                      </p>
                    </div>
                    <span className="text-base font-bold text-gray-900">
                      {formatCurrency(room.subtotal)}
                    </span>
                  </div>
                </div>

                {/* Services */}
                {room.services && room.services.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                      <p className="text-sm font-semibold text-gray-900">
                        Dịch vụ đi kèm ({room.services.length})
                      </p>
                    </div>
                    <div className="pl-4 border-l-2 border-purple-200 space-y-2">
                      {room.services.map((service) => (
                        <div
                          key={service.id}
                          className="bg-purple-50 rounded-lg p-3"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {service.serviceName}
                              </p>
                              {service.description && (
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {service.description}
                                </p>
                              )}
                              <p className="text-xs text-gray-600 mt-1">
                                {service.quantity} {service.unit}
                                {service.totalDays > 1 &&
                                  ` × ${service.totalDays} ngày`}{" "}
                                × {formatCurrency(service.pricePerUnit)}
                              </p>
                            </div>
                            <span className="text-sm font-bold text-purple-700 ml-4">
                              {formatCurrency(service.subtotal)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Room Total */}
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700">
                      Tổng phòng này:
                    </span>
                    <span className="text-base font-bold text-blue-600">
                      {formatCurrency(totalRoomCost)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Common Services */}
      {commonServices && commonServices.length > 0 && (
        <div className="border border-amber-200 rounded-lg bg-gradient-to-r from-amber-50 to-yellow-50 overflow-hidden">
          <div className="px-4 py-3 bg-amber-100 border-b border-amber-200">
            <h4 className="text-sm font-semibold text-amber-900 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Dịch vụ chung
            </h4>
          </div>
          <div className="p-4 space-y-2">
            {commonServices.map((service) => (
              <div
                key={service.id}
                className="flex justify-between items-start bg-white rounded-lg p-3"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {service.serviceName}
                  </p>
                  {service.description && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {service.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-600 mt-1">
                    {service.quantity} {service.unit} ×{" "}
                    {formatCurrency(service.pricePerUnit)}
                  </p>
                </div>
                <span className="text-sm font-bold text-amber-700">
                  {formatCurrency(service.subtotal)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pricing Summary */}
      {pricing && (
        <div className="border-t-2 border-gray-300 pt-4 mt-4 bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tổng tiền phòng:</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(pricing.roomsTotal)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tổng tiền dịch vụ:</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(pricing.servicesTotal)}
            </span>
          </div>
          <div className="flex justify-between text-sm border-t border-gray-200 pt-2">
            <span className="text-gray-600">Tổng cộng:</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(pricing.subtotal)}
            </span>
          </div>
          {pricing.discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-green-600">Giảm giá:</span>
              <span className="font-medium text-green-600">
                -{formatCurrency(pricing.discount)}
              </span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Phí nền tảng (10%):</span>
            <span className="font-medium text-red-600">
              -{formatCurrency(pricing.platformFee)}
            </span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t-2 border-gray-300 pt-2 mt-2">
            <span className="text-gray-900">Doanh thu host:</span>
            <span className="text-green-600">
              {formatCurrency(pricing.hostRevenue)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomServiceAccordion;
