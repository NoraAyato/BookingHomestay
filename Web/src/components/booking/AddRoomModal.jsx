import { useState } from "react";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Pagination from "../../components/common/Pagination";
import { formatDateDisplay } from "../../utils/date";
import { getImageUrl } from "../../utils/imageUrl";

const ROOMS_PER_PAGE = 2;

export default function AddRoomModal({
  isOpen,
  isLoading,
  availableRooms = [],
  selectedRooms = [],
  bookingData,
  onClose,
  onAddRoom,
}) {
  const [currentPage, setCurrentPage] = useState(1);

  if (!isOpen) return null;

  // Calculate pagination
  const totalPages = Math.ceil(availableRooms.length / ROOMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ROOMS_PER_PAGE;
  const endIndex = startIndex + ROOMS_PER_PAGE;
  const paginatedRooms = availableRooms.slice(startIndex, endIndex);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 flex items-center justify-between shadow-md">
          <div>
            <h3 className="text-2xl font-bold text-white">
              Chọn phòng để thêm
            </h3>
            <p className="text-blue-100 text-sm mt-1">
              Ngày {formatDateDisplay(bookingData?.checkIn)} -{" "}
              {formatDateDisplay(bookingData?.checkOut)} ({bookingData?.nights}{" "}
              đêm)
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
          >
            <svg
              className="w-6 h-6"
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

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="flex flex-col items-center gap-3">
                <LoadingSpinner />
                <p className="text-gray-500 font-medium">
                  Đang tải danh sách phòng...
                </p>
              </div>
            </div>
          ) : availableRooms.length > 0 ? (
            <>
              <div className="space-y-4">
                {paginatedRooms.map((room) => {
                  const isSelected = selectedRooms.some(
                    (r) => r.roomId === room.id
                  );
                  return (
                    <div
                      key={room.id}
                      className={`border-2 rounded-lg overflow-hidden cursor-pointer relative transition-all duration-200 ${
                        isSelected
                          ? "border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg"
                          : "border-gray-200 hover:border-blue-400 hover:shadow-md"
                      }`}
                      onClick={() => {
                        if (!isSelected) {
                          onAddRoom({
                            roomId: room.id,
                            roomName: room.name,
                            pricePerNight: room.discountPrice || room.price,
                          });
                        }
                      }}
                    >
                      {/* Room Type Badge - Top Right */}
                      {(() => {
                        let bgColor = "bg-gray-400";
                        switch (room.roomType) {
                          case "Dorm":
                            bgColor = "bg-blue-500";
                            break;
                          case "Double":
                            bgColor = "bg-pink-500";
                            break;
                          case "Family":
                            bgColor = "bg-green-600";
                            break;
                          case "Triple":
                            bgColor = "bg-purple-600";
                            break;
                          case "Twin":
                            bgColor = "bg-yellow-500";
                            break;
                          default:
                            bgColor = "bg-gray-400";
                        }
                        return (
                          <div
                            className={`absolute top-0 right-0 z-20 ${bgColor} text-white text-xs font-bold px-3 py-1 rounded-bl-lg shadow-md`}
                          >
                            {room.roomType}
                          </div>
                        );
                      })()}

                      {/* Selected Indicator - Top Left */}
                      {isSelected && (
                        <div className="absolute top-0 left-0 z-30 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-br-lg shadow-md flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Đã chọn
                        </div>
                      )}

                      {/* Discount Badge */}
                      {room.discountPrice && (
                        <div className="absolute top-7 right-0 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-bl-md">
                          -
                          {Math.round(
                            100 - (room.discountPrice * 100) / room.price
                          )}
                          %
                        </div>
                      )}

                      <div className="flex flex-col md:flex-row">
                        {/* Image Section */}
                        <div className="md:w-1/3 relative">
                          <img
                            src={getImageUrl(room.images?.[0])}
                            alt={room.name}
                            className="w-full h-48 md:h-full object-cover"
                          />
                        </div>

                        {/* Info Section */}
                        <div className="p-4 md:w-2/3 flex flex-col justify-between">
                          <div>
                            <h4 className="text-lg font-bold text-gray-900 mb-2">
                              {room.name}
                            </h4>

                            <div className="flex items-center text-gray-700 text-sm font-medium mb-3">
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v2h8v-2zM16 11a2 2 0 11-4 0 2 2 0 014 0zM18 15v2h4v-2z" />
                              </svg>
                              Tối đa {room.maxOccupancy} người
                            </div>

                            {/* Amenities */}
                            {room.amenities && room.amenities.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-3">
                                {room.amenities
                                  .slice(0, 3)
                                  .map((amenity, idx) => (
                                    <span
                                      key={idx}
                                      className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-xs font-medium shadow-sm"
                                    >
                                      {amenity}
                                    </span>
                                  ))}
                                {room.amenities.length > 3 && (
                                  <span className="bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-xs font-medium">
                                    +{room.amenities.length - 3}
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Description */}
                            {room.description && (
                              <p className="text-gray-600 text-sm line-clamp-2">
                                {room.description}
                              </p>
                            )}
                          </div>

                          {/* Price and Button */}
                          <div className="mt-3 flex items-center justify-between">
                            <div className="text-right">
                              {room.discountPrice ? (
                                <>
                                  <p className="text-gray-400 text-xs line-through">
                                    {room.price.toLocaleString("vi-VN")}đ
                                  </p>
                                  <p className="text-xl font-bold text-blue-600">
                                    {room.discountPrice.toLocaleString("vi-VN")}
                                    đ
                                  </p>
                                </>
                              ) : (
                                <p className="text-xl font-bold text-gray-900">
                                  {room.price.toLocaleString("vi-VN")}đ / đêm
                                </p>
                              )}
                            </div>

                            {!isSelected ? (
                              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 shadow-md">
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
                                    d="M12 4v16m8-8H4"
                                  />
                                </svg>
                                Thêm
                              </button>
                            ) : (
                              <button
                                disabled
                                className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 cursor-not-allowed opacity-75 shadow-md"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Đã chọn
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onChangePage={setCurrentPage}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <svg
                className="w-16 h-16 text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p className="text-gray-500 font-semibold text-lg mb-1">
                Không có phòng trống khác
              </p>
              <p className="text-gray-400 text-sm">
                Tất cả phòng khả dụng đã được thêm vào đơn đặt của bạn
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
