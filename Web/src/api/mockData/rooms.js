// Dữ liệu mẫu cho các phòng của homestay, tổ chức theo homestay
const mockRoomsData = [
  {
    homestayId: "hs-001",
    rooms: [
      {
        id: "room-001",
        name: "Phòng Master Suite",
        description:
          "Phòng rộng rãi với giường king size, tầm nhìn ra biển và phòng tắm riêng cao cấp",
        price: 900000,
        discountPrice: 765000,
        roomType: "1 giường king size",
        maxOccupancy: 2,
        amenities: [
          "TV màn hình phẳng",
          "Điều hòa",
          "Minibar",
          "Wifi",
          "Bồn tắm",
          "Máy sấy tóc",
        ],
        images: [
          "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2071",
          "https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?q=80&w=2070",
        ],
        available: true,
      },
      {
        id: "room-002",
        name: "Phòng Deluxe A",
        description:
          "Phòng thoáng mát với ban công riêng, giường queen size và khu vực tiếp khách",
        price: 700000,
        roomType: "1 giường queen size",
        maxOccupancy: 2,
        amenities: ["TV", "Điều hòa", "Wifi", "Bàn làm việc", "Tủ lạnh mini"],
        images: [
          "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=2070",
          "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2074",
        ],
        available: true,
      },
      {
        id: "room-003",
        name: "Phòng Deluxe B",
        description:
          "Phòng thoáng mát với view thành phố, giường queen size và ban công rộng",
        price: 750000,
        roomType: "1 giường queen size",
        maxOccupancy: 2,
        amenities: [
          "TV",
          "Điều hòa",
          "Wifi",
          "Bàn làm việc",
          "Tủ lạnh mini",
          "Ghế thư giãn",
        ],
        images: [
          "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070",
          "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2074",
        ],
        available: true,
      },
      {
        id: "room-004",
        name: "Phòng Family Suite",
        description:
          "Phòng gia đình rộng rãi với khu vực sinh hoạt chung và tầm nhìn ra biển",
        price: 1200000,
        discountPrice: 960000,
        roomType: "1 giường king size và 2 giường đơn",
        maxOccupancy: 4,
        amenities: [
          "TV màn hình phẳng",
          "Điều hòa",
          "Minibar",
          "Wifi",
          "Bồn tắm",
          "Máy pha cà phê",
          "Khu vực ăn uống",
        ],
        images: [
          "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1974",
          "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1939",
        ],
        available: true,
      },
    ],
  },

  {
    homestayId: "hs-002",
    rooms: [
      {
        id: "room-005",
        name: "Phòng Studio",
        description:
          "Phòng thiết kế hiện đại với cửa sổ panorama, khu vực bếp nhỏ và góc làm việc",
        price: 1200000,
        roomType: "1 giường queen size",
        maxOccupancy: 2,
        amenities: [
          "TV 4K",
          "Điều hòa",
          "Bếp mini",
          "Wifi tốc độ cao",
          "Bàn làm việc",
          "Tủ quần áo",
        ],
        images: [
          "https://images.unsplash.com/photo-1560448204-61dc36dc98c8?q=80&w=2070",
          "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1939",
        ],
        available: true,
      },
    ],
  },

  {
    homestayId: "hs-003",
    rooms: [
      {
        id: "room-006",
        name: "Phòng Garden View",
        description:
          "Phòng phong cách truyền thống với ban công nhìn ra khu vườn nhiệt đới",
        price: 750000,
        discountPrice: 600000,
        roomType: "1 giường đôi hoặc 2 giường đơn",
        maxOccupancy: 2,
        amenities: [
          "Quạt trần",
          "Điều hòa",
          "Wifi",
          "Tủ lạnh",
          "Bàn trang điểm",
          "Phòng tắm riêng",
        ],
        images: [
          "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=2070",
          "https://images.unsplash.com/photo-1598928636135-d146006ff4be?q=80&w=2070",
        ],
        available: true,
      },
      {
        id: "room-007",
        name: "Phòng Family",
        description:
          "Phòng rộng rãi cho gia đình với khu vực sinh hoạt chung và 2 phòng ngủ",
        price: 1200000,
        roomType: "1 giường queen size và 2 giường đơn",
        maxOccupancy: 4,
        amenities: [
          "TV",
          "Điều hòa",
          "Wifi",
          "Bàn ăn",
          "Tủ lạnh",
          "Máy pha cà phê",
        ],
        images: [
          "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1939",
          "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070",
        ],
        available: true,
      },
    ],
  },

  {
    homestayId: "hs-004",
    rooms: [
      {
        id: "room-008",
        name: "Phòng Mountain View",
        description:
          "Phòng ấm cúng với cửa sổ nhìn ra dãy núi Hoàng Liên Sơn hùng vĩ",
        price: 650000,
        roomType: "1 giường đôi",
        maxOccupancy: 2,
        amenities: [
          "Lò sưởi",
          "Điều hòa",
          "Wifi",
          "Nước nóng",
          "Ấm đun nước",
          "Trà và cà phê",
        ],
        images: [
          "https://images.unsplash.com/photo-1566195992011-5f6b21e539aa?q=80&w=1974",
          "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070",
        ],
        available: true,
      },
    ],
  },

  {
    homestayId: "hs-005",
    rooms: [
      {
        id: "room-009",
        name: "Phòng Beach Front",
        description:
          "Phòng sang trọng nằm ngay sát bãi biển với tầm nhìn ra đại dương xanh biếc",
        price: 1800000,
        discountPrice: 1530000,
        roomType: "1 giường king size",
        maxOccupancy: 2,
        amenities: [
          "TV",
          "Điều hòa",
          "Wifi",
          "Minibar",
          "Hệ thống âm thanh",
          "Phòng tắm ngoài trời",
        ],
        images: [
          "https://images.unsplash.com/photo-1602002418082-dd4a3f5d2b74?q=80&w=1974",
          "https://images.unsplash.com/photo-1605537964075-42d3e7c63388?q=80&w=2069",
        ],
        available: true,
      },
      {
        id: "room-010",
        name: "Phòng Garden Bungalow",
        description:
          "Bungalow độc lập nằm trong khu vườn nhiệt đới, thiết kế mở với sự riêng tư tuyệt đối",
        price: 1500000,
        roomType: "1 giường queen size",
        maxOccupancy: 2,
        amenities: [
          "TV",
          "Điều hòa",
          "Wifi",
          "Tủ lạnh",
          "Máy pha cà phê",
          "Ghế nằm ngoài trời",
        ],
        images: [
          "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070",
          "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070",
        ],
        available: true,
      },
    ],
  },
];

// Tạo một mảng phẳng chứa tất cả các phòng để tương thích với code cũ nếu cần
const mockRooms = mockRoomsData.flatMap((item) =>
  item.rooms.map((room) => ({
    ...room,
    homestayId: item.homestayId,
  }))
);

// Hàm lấy danh sách phòng theo homestay ID
export const getRoomsByHomestayId = (homestayId) => {
  const homestay = mockRoomsData.find((item) => item.homestayId === homestayId);
  return homestay ? homestay.rooms : [];
};

// Hàm lấy thông tin chi tiết một phòng theo ID
export const getRoomById = (roomId) => {
  for (const homestay of mockRoomsData) {
    const room = homestay.rooms.find((r) => r.id === roomId);
    if (room) {
      return { ...room, homestayId: homestay.homestayId };
    }
  }
  return null;
};

// Hàm lấy tổng số phòng của một homestay
export const getTotalRoomsByHomestayId = (homestayId) => {
  const homestay = mockRoomsData.find((item) => item.homestayId === homestayId);
  return homestay ? homestay.rooms.length : 0;
};

export default mockRoomsData;
