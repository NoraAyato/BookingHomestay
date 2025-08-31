import React, { useState } from "react";
import Pagination from "../common/Pagination";

const RoomsList = ({ rooms, onSelectRoom }) => {
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
            className={`border rounded-lg overflow-hidden transition-all hover:shadow-md cursor-pointer relative`}
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
            {/* Discount tag */}
            {room.discountPrice && (
              <div className="absolute top-0 right-0 z-10 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-bl-md">
                -{Math.round(100 - (room.discountPrice * 100) / room.price)}%
              </div>
            )}
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 relative">
                <img
                  src={room.images[0]}
                  alt={room.name}
                  className="w-full h-48 md:h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <h3 className="text-white font-medium">{room.name}</h3>
                </div>
              </div>
              <div className="p-4 md:w-2/3">
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="mb-3 md:mb-0">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 md:hidden">
                      {room.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {room.description}
                    </p>
                    <p className="text-gray-700 mb-2">{room.roomType}</p>
                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      <i className="fas fa-user-friends mr-1"></i>
                      <span>Tối đa {room.maxOccupancy} người</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {room.amenities.map((amenity, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-600 rounded-full px-2 py-1 text-xs"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
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
