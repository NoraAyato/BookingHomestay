// Mock data for reviews
const mockReviews = [
  {
    id: "rev-001",
    homestayId: "hs-001",
    userId: "user-001",
    userName: "Nguyễn Văn Minh",
    userAvatar: "https://i.pravatar.cc/150?img=11",
    rating: 5,
    comment:
      "Vị trí tuyệt vời, homestay rất sạch sẽ và thoải mái. Chủ nhà rất thân thiện và nhiệt tình. Sẽ quay lại vào lần sau!",
    date: "2025-06-12",
    image:
      "https://images.unsplash.com/photo-1564078516393-cf04bd966897?q=80&w=2187",
  },
  {
    id: "rev-002",
    homestayId: "hs-001",
    userId: "user-002",
    userName: "Trần Thị Hoa",
    userAvatar: "https://i.pravatar.cc/150?img=12",
    rating: 4,
    comment:
      "Không gian rất đẹp, đầy đủ tiện nghi. Tôi rất hài lòng với kỳ nghỉ tại đây! Phòng ốc sạch sẽ, nhưng vị trí hơi xa trung tâm một chút.",
    date: "2025-05-27",
    image:
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2071",
  },
  {
    id: "rev-003",
    homestayId: "hs-001",
    userId: "user-003",
    userName: "Lê Anh Tú",
    userAvatar: "https://i.pravatar.cc/150?img=13",
    rating: 5,
    comment:
      "Tuyệt vời! Homestay có view đẹp, nhân viên phục vụ chu đáo. Phòng ốc rộng rãi và thoáng mát. Sẽ quay lại trong tương lai.",
    date: "2025-05-10",
    image: "",
  },
  {
    id: "rev-004",
    homestayId: "hs-001",
    userId: "user-004",
    userName: "Phạm Thanh Hằng",
    userAvatar: "https://i.pravatar.cc/150?img=14",
    rating: 4,
    comment:
      "Nhân viên rất thân thiện, phòng ốc sạch sẽ. Tuy nhiên bữa sáng hơi ít lựa chọn. Nhìn chung là một trải nghiệm tốt.",
    date: "2025-04-25",
    image:
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=2070",
  },
  {
    id: "rev-005",
    homestayId: "hs-001",
    userId: "user-005",
    userName: "Hoàng Minh Đức",
    userAvatar: "https://i.pravatar.cc/150?img=15",
    rating: 5,
    comment:
      "Mọi thứ đều hoàn hảo! Từ dịch vụ, không gian, đến ẩm thực. Đặc biệt là view từ ban công phòng ngủ, có thể ngắm hoàng hôn rất đẹp.",
    date: "2025-04-18",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070",
  },
  {
    id: "rev-006",
    homestayId: "hs-001",
    userId: "user-006",
    userName: "Ngô Thị Mai",
    userAvatar: "https://i.pravatar.cc/150?img=16",
    rating: 4,
    comment:
      "Phòng ốc thiết kế hiện đại, giá cả hợp lý. Chỉ có điều hơi ồn vào buổi tối do gần đường lớn.",
    date: "2025-03-30",
    image: "",
  },
  {
    id: "rev-007",
    homestayId: "hs-001",
    userId: "user-007",
    userName: "Vũ Quang Huy",
    userAvatar: "https://i.pravatar.cc/150?img=17",
    rating: 5,
    comment:
      "Đội ngũ nhân viên rất chuyên nghiệp và thân thiện. Phòng sạch sẽ, tiện nghi đầy đủ. Đặc biệt khu vực hồ bơi rất tuyệt vời.",
    date: "2025-03-15",
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070",
  },
  {
    id: "rev-008",
    homestayId: "hs-001",
    userId: "user-008",
    userName: "Đỗ Thị Hồng",
    userAvatar: "https://i.pravatar.cc/150?img=18",
    rating: 3,
    comment:
      "Vị trí thuận tiện, gần các điểm tham quan. Tuy nhiên phòng hơi nhỏ so với giá tiền và có một số vấn đề nhỏ về nước nóng.",
    date: "2025-02-28",
    image: "",
  },
  {
    id: "rev-009",
    homestayId: "hs-001",
    userId: "user-009",
    userName: "Trịnh Văn Nam",
    userAvatar: "https://i.pravatar.cc/150?img=19",
    rating: 5,
    comment:
      "Trải nghiệm tuyệt vời! Đội ngũ nhân viên rất nhiệt tình, hỗ trợ tôi đặt tour và gợi ý nhiều địa điểm ăn uống ngon trong khu vực.",
    date: "2025-02-15",
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2074",
  },
  {
    id: "rev-010",
    homestayId: "hs-002",
    userId: "user-010",
    userName: "Nguyễn Thị Lan",
    userAvatar: "https://i.pravatar.cc/150?img=20",
    rating: 4,
    comment:
      "Căn hộ rất xinh xắn, view đẹp. Nội thất mới và hiện đại. Chủ nhà dễ thương và đáp ứng mọi yêu cầu của chúng tôi.",
    date: "2025-06-10",
    image:
      "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=2069",
  },
];

export const getReviewsByHomestayId = (homestayId) => {
  return mockReviews.filter((review) => review.homestayId === homestayId);
};

export default mockReviews;
