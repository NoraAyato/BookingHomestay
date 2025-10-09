import React, { useState } from "react";
import Pagination from "../common/Pagination";
import { getImageUrl } from "../../utils/imageUrl";
const RoomsList = ({ rooms, onSelectRoom, selectedRoom }) => {
  const roomsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = rooms.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPages = Math.ceil(rooms.length / roomsPerPage);

  return (
    <>
      <div className="space-y-4">
        {currentRooms.map((room) => (
          <div
            key={room.id}
            className={`border rounded-lg overflow-hidden cursor-pointer relative transition-colors duration-200 ${
              selectedRoom && selectedRoom.id === room.id
                ? "border-2 border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg"
                : "hover:border-gray-300 hover:bg-gray-50"
            }`}
            onClick={() => {
              if (onSelectRoom) {
                onSelectRoom(room);
              } else {
                alert(
                  `Đã chọn phòng: ${room.name}. Giá: ${(
                    room.discountPrice || room.price
                  ).toLocaleString("vi-VN")}đ/đêm`
                );
              }
            }}
          >
            {/* Room type tag on top right - màu nền theo loại phòng */}
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
            {/* Selected room indicator */}
            {selectedRoom && selectedRoom.id === room.id && (
              <div className="absolute top-0 left-0 z-30 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-br-lg shadow-md flex items-center">
                <i className="fas fa-check-circle mr-1"></i>
                Đã chọn
              </div>
            )}
            {/* Discount tag */}
            {room.discountPrice && (
              <div className="absolute top-7 right-0 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-bl-md">
                -{Math.round(100 - (room.discountPrice * 100) / room.price)}%
              </div>
            )}
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 relative">
                <img
                  src={getImageUrl(room.images[0])}
                  alt={room.name}
                  className="w-full h-48 md:h-full object-cover"
                />
              </div>
              <div className="p-4 md:w-2/3">
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="mb-3 md:mb-0">
                    <h3 className="text-lg font-bold mb-2 text-orange-600 md:hidden">
                      {room.roomType}
                    </h3>

                    <p className="text-black mb-2 font-semibold">{room.name}</p>
                    <div className="flex items-center text-black text-base font-semibold mb-3">
                      <i className="fas fa-user-friends mr-1"></i>
                      <span>Tối đa {room.maxOccupancy} người</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {room.amenities && room.amenities.length > 0 ? (
                        room.amenities.map((amenity, index) => (
                          <span
                            key={index}
                            className="bg-orange-100 text-orange-700 rounded-full px-3 py-1 text-sm font-medium shadow"
                          >
                            {amenity}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-sm font-bold">
                          Hiện không có tiện nghi
                        </span>
                      )}
                    </div>
                    <p className="text-gray-800 text-base mt-3 font-medium">
                      {room.description}
                    </p>
                  </div>
                  <div className="text-right flex flex-col justify-center">
                    <div>
                      {room.discountPrice ? (
                        <>
                          <p className="text-gray-400 text-sm line-through">
                            {room.price.toLocaleString("vi-VN")}đ
                          </p>
                          <p className="text-gray-900 font-bold text-xl">
                            {room.discountPrice.toLocaleString("vi-VN")}đ
                          </p>
                        </>
                      ) : (
                        <p className="text-gray-900 font-bold text-xl">
                          {room.price.toLocaleString("vi-VN")}đ
                        </p>
                      )}
                      <p className="text-gray-500 text-sm">mỗi đêm</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {rooms.length > roomsPerPage && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onChangePage={setCurrentPage}
            prevLabel="Trước"
            nextLabel="Sau"
          />
        </div>
      )}
    </>
  );
};

export default RoomsList;
