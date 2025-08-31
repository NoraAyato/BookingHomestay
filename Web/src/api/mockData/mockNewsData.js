// Mock data for news
export const mockNewsData = {
  success: true,
  data: {
    items: [
      {
        id: 1,
        title: "Top 10 Homestay đẹp nhất tại Đà Lạt năm 2025",
        summary:
          "Khám phá những homestay đẹp nhất, view núi đồi thơ mộng tại thành phố ngàn hoa Đà Lạt.",
        content: `<p>Đà Lạt, thành phố của sương mù và những ngọn đồi thơ mộng, là điểm đến lý tưởng cho những ai muốn trốn khỏi cái nóng oi bức của thành phố. Và không có gì tuyệt vời hơn việc được nghỉ ngơi trong một căn homestay view đẹp, thiết kế ấn tượng và dịch vụ tuyệt vời.</p>
                 <h2>1. The Wilder Nest</h2>
                 <p>Nằm trên đồi thông, The Wilder Nest mang đến cảm giác như bạn đang sống trong một khu rừng nhỏ. Với thiết kế tối giản nhưng ấm cúng, homestay này là lựa chọn hoàn hảo cho những ai yêu thích thiên nhiên và sự tĩnh lặng.</p>
                 <p>Điểm nổi bật:</p>
                 <ul>
                   <li>View rừng thông tuyệt đẹp</li>
                   <li>Không gian sống xanh, gần gũi với thiên nhiên</li>
                   <li>Có khu vực BBQ ngoài trời</li>
                   <li>Phòng tắm với bồn tắm view núi</li>
                 </ul>
                 <h2>2. The Dreamers House</h2>
                 <p>Được thiết kế theo phong cách châu Âu cổ điển, The Dreamers House mang đến không gian sống sang trọng và lãng mạn. Từ ban công, bạn có thể ngắm nhìn toàn cảnh thành phố Đà Lạt.</p>`,
        image:
          "https://images.unsplash.com/photo-1615460549969-36fa19521a4f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mzl8fGhvbWVzdGF5fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        category: "Điểm đến",
        author: "Nguyễn Văn A",
        tags: ["Đà Lạt", "Homestay", "Du lịch", "Nghỉ dưỡng"],
        views: 1520,
        createdAt: "2025-08-15T08:30:00Z",
      },
      {
        id: 2,
        title: "Kinh nghiệm du lịch tiết kiệm cho gia đình có trẻ nhỏ",
        summary:
          "Chia sẻ những mẹo hữu ích giúp các gia đình có con nhỏ có thể du lịch tiết kiệm mà vẫn đảm bảo trải nghiệm tuyệt vời.",
        content: `<p>Du lịch cùng trẻ nhỏ luôn là thách thức đối với các bậc phụ huynh. Làm sao để chuyến đi vừa tiết kiệm, vừa an toàn và thú vị cho cả gia đình?</p>
                 <h2>1. Lựa chọn thời điểm thích hợp</h2>
                 <p>Tránh du lịch vào mùa cao điểm khi giá cả đắt đỏ và điểm đến đông đúc. Thay vào đó, hãy chọn mùa thấp điểm hoặc giữa tuần để được hưởng giá ưu đãi hơn.</p>
                 <h2>2. Đặt phòng homestay thay vì khách sạn</h2>
                 <p>Homestay thường rộng rãi hơn và có bếp để bạn có thể nấu ăn cho con, tiết kiệm chi phí ăn uống. Nhiều homestay còn có sân vườn để trẻ vui chơi.</p>
                 <h2>3. Lập kế hoạch chi tiết</h2>
                 <p>Lên lịch trình và dự trù chi phí trước chuyến đi sẽ giúp bạn kiểm soát tốt hơn ngân sách du lịch. Đừng quên tìm kiếm các ưu đãi, khuyến mãi dành cho gia đình.</p>`,
        image:
          "https://images.unsplash.com/photo-1606046604972-77cc76aee944?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8ZmFtaWx5JTIwdHJhdmVsfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        category: "Kinh nghiệm du lịch",
        author: "Trần Thị B",
        tags: ["Du lịch gia đình", "Tiết kiệm", "Trẻ em"],
        views: 2150,
        createdAt: "2025-08-10T10:15:00Z",
      },
      {
        id: 3,
        title: "Trải nghiệm homestay làng chài tại Phú Quốc",
        summary:
          "Khám phá cuộc sống ngư dân đảo ngọc qua trải nghiệm homestay độc đáo tại làng chài Hàm Ninh.",
        content: `<p>Phú Quốc không chỉ nổi tiếng với những bãi biển đẹp mà còn có nét văn hóa làng chài đặc trưng. Trải nghiệm homestay tại làng chài là cách tuyệt vời để du khách hiểu hơn về cuộc sống của người dân địa phương.</p>
                 <h2>Làng chài Hàm Ninh - Nét đẹp hoang sơ</h2>
                 <p>Làng chài Hàm Ninh là một trong những làng chài lâu đời nhất tại Phú Quốc, nơi du khách có thể tận mắt chứng kiến cuộc sống thường ngày của ngư dân.</p>
                 <h2>Homestay làng chài - Trải nghiệm độc đáo</h2>
                 <p>Các homestay tại làng chài được thiết kế đơn giản nhưng đầy đủ tiện nghi, mang đến cảm giác gần gũi với thiên nhiên và con người nơi đây.</p>
                 <h2>Hoạt động thú vị</h2>
                 <p>Du khách có thể tham gia vào các hoạt động cùng ngư dân như đánh bắt hải sản, chế biến món ăn địa phương và tham quan các điểm đến nổi tiếng lân cận.</p>`,
        image:
          "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8ZmlzaGluZyUyMHZpbGxhZ2V8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60",
        category: "Điểm đến",
        author: "Lê Văn C",
        tags: ["Phú Quốc", "Làng chài", "Trải nghiệm", "Homestay"],
        views: 1820,
        createdAt: "2025-08-05T14:20:00Z",
      },
      {
        id: 4,
        title: "Giảm 30% cho đặt phòng homestay dịp Lễ 2/9",
        summary:
          "Chương trình khuyến mãi đặc biệt nhân dịp Lễ Quốc khánh 2/9 với nhiều ưu đãi hấp dẫn cho khách hàng.",
        content: `<p>Nhân dịp Lễ Quốc khánh 2/9, Home Feel triển khai chương trình khuyến mãi lớn dành cho khách hàng đặt phòng trong giai đoạn từ 30/8 đến 5/9/2025.</p>
                 <h2>Chi tiết chương trình</h2>
                 <p>Giảm 30% cho tất cả các đơn đặt phòng homestay trên toàn quốc. Áp dụng cho cả đặt phòng ngắn hạn và dài hạn.</p>
                 <h2>Điều kiện áp dụng</h2>
                 <ul>
                   <li>Đặt phòng và thanh toán trong thời gian từ 20/8 đến 31/8/2025</li>
                   <li>Thời gian lưu trú từ 30/8 đến 5/9/2025</li>
                   <li>Áp dụng cho tất cả khách hàng thành viên của Home Feel</li>
                 </ul>
                 <h2>Làm sao để nhận ưu đãi?</h2>
                 <p>Khách hàng chỉ cần nhập mã <strong>QUOCKHANH30</strong> khi thanh toán để nhận ngay ưu đãi giảm 30%.</p>`,
        image:
          "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZGlzY291bnR8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60",
        category: "Khuyến mãi",
        author: "Đội Marketing",
        tags: ["Khuyến mãi", "Lễ 2/9", "Giảm giá"],
        views: 3250,
        createdAt: "2025-08-20T09:00:00Z",
      },
      {
        id: 5,
        title: "Festival Homestay Việt Nam 2025 sẽ diễn ra tại Hội An",
        summary:
          "Sự kiện lớn nhất trong năm về homestay sẽ được tổ chức tại phố cổ Hội An vào tháng 10/2025.",
        content: `<p>Festival Homestay Việt Nam 2025 dự kiến quy tụ hơn 200 đơn vị kinh doanh homestay từ khắp các tỉnh thành trong cả nước, hứa hẹn mang đến nhiều hoạt động thú vị và cơ hội kết nối kinh doanh.</p>
                 <h2>Thời gian và địa điểm</h2>
                 <p>Festival sẽ diễn ra từ ngày 15/10 đến 20/10/2025 tại phố cổ Hội An, Quảng Nam.</p>
                 <h2>Các hoạt động chính</h2>
                 <ul>
                   <li>Triển lãm giới thiệu các mô hình homestay tiêu biểu</li>
                   <li>Hội thảo chia sẻ kinh nghiệm kinh doanh và xu hướng du lịch</li>
                   <li>Chương trình kết nối doanh nghiệp và nhà đầu tư</li>
                   <li>Trải nghiệm văn hóa địa phương và ẩm thực đặc sắc</li>
                 </ul>
                 <h2>Đăng ký tham gia</h2>
                 <p>Các đơn vị kinh doanh homestay muốn tham gia có thể đăng ký trực tuyến qua website chính thức của Festival hoặc liên hệ với ban tổ chức qua email: festival@homestayvietnam.vn</p>`,
        image:
          "https://images.unsplash.com/photo-1569388330292-79cc1ec67270?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8aG9pJTIwYW58ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60",
        category: "Sự kiện",
        author: "Phạm Văn D",
        tags: ["Festival", "Hội An", "Sự kiện", "Homestay"],
        views: 1980,
        createdAt: "2025-08-25T11:30:00Z",
      },
      {
        id: 6,
        title: "Homestay xanh - Xu hướng du lịch bền vững năm 2025",
        summary:
          "Khám phá mô hình homestay xanh đang ngày càng được ưa chuộng trong xu hướng du lịch bền vững.",
        content: `<p>Du lịch bền vững đang trở thành xu hướng được nhiều du khách quan tâm, và homestay xanh là một phần không thể thiếu trong phong trào này.</p>
                 <h2>Homestay xanh là gì?</h2>
                 <p>Homestay xanh là mô hình lưu trú thân thiện với môi trường, sử dụng vật liệu tự nhiên, tiết kiệm năng lượng và nước, giảm thiểu rác thải và khuyến khích du khách tham gia vào các hoạt động bảo vệ môi trường.</p>
                 <h2>Lợi ích của homestay xanh</h2>
                 <ul>
                   <li>Giảm thiểu tác động tiêu cực đến môi trường</li>
                   <li>Tạo trải nghiệm gần gũi thiên nhiên cho du khách</li>
                   <li>Hỗ trợ phát triển kinh tế địa phương một cách bền vững</li>
                   <li>Nâng cao nhận thức về bảo vệ môi trường</li>
                 </ul>
                 <h2>Các homestay xanh tiêu biểu tại Việt Nam</h2>
                 <p>Tại Việt Nam, mô hình homestay xanh đang phát triển mạnh với nhiều đơn vị tiêu biểu như Ecohost (Hà Nội), Green Valley Homestay (Đà Lạt), và Mekong Rustic (Đồng bằng sông Cửu Long).</p>`,
        image:
          "https://images.unsplash.com/photo-1593170308349-9d2db7897e29?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Z3JlZW4lMjBob21lc3RheXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
        category: "Kinh nghiệm du lịch",
        author: "Nguyễn Thị E",
        tags: ["Du lịch xanh", "Bền vững", "Eco", "Homestay"],
        views: 2350,
        createdAt: "2025-08-18T13:45:00Z",
      },
    ],
    featured: {
      id: 7,
      title: "10 trải nghiệm không thể bỏ qua khi đến Sapa mùa thu 2025",
      summary:
        "Khám phá vẻ đẹp của Sapa mùa thu với những trải nghiệm độc đáo từ homestay bản làng đến thưởng thức ẩm thực địa phương.",
      content: `<p>Sapa mùa thu - khi những thửa ruộng bậc thang chuyển màu vàng óng, sương mù phủ nhẹ trên đỉnh Fansipan và không khí se lạnh - là thời điểm tuyệt vời để ghé thăm vùng đất này.</p>
                <h2>1. Đêm homestay tại bản Cát Cát</h2>
                <p>Trải nghiệm một đêm tại homestay bản Cát Cát, nơi bạn có thể sống cùng người dân tộc H'Mông, tìm hiểu văn hóa và phong tục của họ. Những ngôi nhà gỗ truyền thống với lò sưởi ấm áp sẽ mang đến cảm giác bình yên hiếm có.</p>
                <h2>2. Khám phá ruộng bậc thang mùa vàng</h2>
                <p>Tháng 9 và tháng 10 là thời điểm ruộng bậc thang Sapa chuyển sang màu vàng rực rỡ, tạo nên khung cảnh tuyệt đẹp. Bạn có thể tham gia tour trekking qua các thửa ruộng để chụp những bức ảnh ấn tượng.</p>
                <h2>3. Chinh phục đỉnh Fansipan</h2>
                <p>Mùa thu là thời điểm lý tưởng để chinh phục "nóc nhà Đông Dương". Bạn có thể chọn đi cáp treo hoặc thử thách bản thân với hành trình leo núi 2 ngày 1 đêm.</p>
                <h2>4. Thưởng thức ẩm thực đặc trưng</h2>
                <p>Đừng bỏ lỡ cơ hội thưởng thức thắng cố, cá hồi nướng, lẩu rau rừng và thịt trâu gác bếp - những món ăn đặc trưng của vùng núi Tây Bắc.</p>`,
      image:
        "https://images.unsplash.com/photo-1577133192628-221963807a77?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8c2FwYXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
      category: "Điểm đến",
      author: "Hoàng Văn F",
      tags: ["Sapa", "Mùa thu", "Du lịch", "Homestay", "Tây Bắc"],
      views: 4500,
      createdAt: "2025-08-28T08:00:00Z",
    },
    totalPages: 2,
  },
};

export const mockNewsDetail = {
  success: true,
  data: {
    id: 7,
    title: "10 trải nghiệm không thể bỏ qua khi đến Sapa mùa thu 2025",
    summary:
      "Khám phá vẻ đẹp của Sapa mùa thu với những trải nghiệm độc đáo từ homestay bản làng đến thưởng thức ẩm thực địa phương.",
    content: `<p>Sapa mùa thu - khi những thửa ruộng bậc thang chuyển màu vàng óng, sương mù phủ nhẹ trên đỉnh Fansipan và không khí se lạnh - là thời điểm tuyệt vời để ghé thăm vùng đất này.</p>
              <h2>1. Đêm homestay tại bản Cát Cát</h2>
              <p>Trải nghiệm một đêm tại homestay bản Cát Cát, nơi bạn có thể sống cùng người dân tộc H'Mông, tìm hiểu văn hóa và phong tục của họ. Những ngôi nhà gỗ truyền thống với lò sưởi ấm áp sẽ mang đến cảm giác bình yên hiếm có.</p>
              <div class="my-6">
                <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8aG1vbmclMjB2aWxsYWdlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60" alt="Bản Cát Cát" class="w-full h-auto rounded-lg shadow-md">
                <p class="text-sm text-center text-gray-500 mt-2">Một góc bản Cát Cát trong sương sớm</p>
              </div>
              <h2>2. Khám phá ruộng bậc thang mùa vàng</h2>
              <p>Tháng 9 và tháng 10 là thời điểm ruộng bậc thang Sapa chuyển sang màu vàng rực rỡ, tạo nên khung cảnh tuyệt đẹp. Bạn có thể tham gia tour trekking qua các thửa ruộng để chụp những bức ảnh ấn tượng.</p>
              <div class="my-6">
                <img src="https://images.unsplash.com/photo-1570098920183-021aa70ff5df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHJpY2UlMjB0ZXJyYWNlcyUyMHZpZXRuYW18ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60" alt="Ruộng bậc thang mùa vàng" class="w-full h-auto rounded-lg shadow-md">
                <p class="text-sm text-center text-gray-500 mt-2">Ruộng bậc thang Sapa vào mùa thu hoạch</p>
              </div>
              <h2>3. Chinh phục đỉnh Fansipan</h2>
              <p>Mùa thu là thời điểm lý tưởng để chinh phục "nóc nhà Đông Dương". Bạn có thể chọn đi cáp treo hoặc thử thách bản thân với hành trình leo núi 2 ngày 1 đêm.</p>
              <p>Từ đỉnh Fansipan, bạn có thể chiêm ngưỡng toàn cảnh Sapa và dãy Hoàng Liên Sơn hùng vĩ. Đặc biệt vào những ngày trời quang, tầm nhìn có thể trải dài đến tận biên giới Việt - Trung.</p>
              <h2>4. Thưởng thức ẩm thực đặc trưng</h2>
              <p>Đừng bỏ lỡ cơ hội thưởng thức thắng cố, cá hồi nướng, lẩu rau rừng và thịt trâu gác bếp - những món ăn đặc trưng của vùng núi Tây Bắc.</p>
              <p>Bạn có thể tìm thấy những món ăn này tại các nhà hàng trong thị trấn Sapa hoặc thậm chí tại các bản làng, nơi bạn sẽ được thưởng thức phiên bản nguyên bản nhất của ẩm thực địa phương.</p>
              <h2>5. Chợ tình Sapa</h2>
              <p>Mặc dù chợ tình truyền thống đã ít nhiều thay đổi theo thời gian, nhưng vào mỗi tối thứ 7, bạn vẫn có thể chứng kiến những tiết mục văn nghệ đặc sắc của đồng bào dân tộc thiểu số tại khu vực gần nhà thờ đá Sapa.</p>
              <h2>6. Khám phá hang động Tả Phìn</h2>
              <p>Cách thị trấn Sapa khoảng 12km, hang động Tả Phìn là điểm đến hấp dẫn với những thạch nhũ độc đáo và không gian huyền bí. Đây từng là nơi trú ẩn của quân đội Việt Nam trong thời kỳ kháng chiến.</p>
              <h2>7. Homestay tại bản Tả Van</h2>
              <p>Bản Tả Van là nơi sinh sống của người Giáy và Dao đỏ. Ở lại homestay tại đây, bạn sẽ được tham gia vào các hoạt động thường ngày của người dân như dệt vải, làm nông và nấu các món ăn truyền thống.</p>
              <h2>8. Tham quan thác Bạc và thác Tình Yêu</h2>
              <p>Thác Bạc và thác Tình Yêu là hai thắng cảnh nổi tiếng của Sapa. Vào mùa thu, khi lượng nước vừa phải, đây là thời điểm lý tưởng để tham quan và chụp ảnh.</p>
              <h2>9. Đạp xe khám phá thung lũng Mường Hoa</h2>
              <p>Thuê một chiếc xe đạp và khám phá thung lũng Mường Hoa - nơi có những cảnh quan thiên nhiên tuyệt đẹp với ruộng bậc thang, sông suối và những ngôi làng nhỏ nằm rải rác.</p>
              <h2>10. Trải nghiệm tắm lá thuốc của người Dao đỏ</h2>
              <p>Tắm lá thuốc là phương pháp chăm sóc sức khỏe truyền thống của người Dao đỏ, sử dụng hơn 10 loại thảo mộc khác nhau. Trải nghiệm này không chỉ giúp thư giãn mà còn giúp bạn hiểu thêm về y học cổ truyền của đồng bào dân tộc thiểu số.</p>
              <h2>Lời khuyên khi du lịch Sapa mùa thu</h2>
              <ul>
                <li>Mang theo quần áo ấm vì nhiệt độ có thể xuống thấp, đặc biệt là vào buổi sáng sớm và tối</li>
                <li>Chuẩn bị áo mưa hoặc ô vì thời tiết có thể thay đổi đột ngột</li>
                <li>Đặt phòng homestay trước chuyến đi, đặc biệt là vào các dịp cuối tuần</li>
                <li>Mang giày đi bộ chắc chắn nếu bạn có kế hoạch trekking qua các bản làng</li>
              </ul>
              <p>Sapa mùa thu thực sự là trải nghiệm không thể bỏ qua dành cho những ai yêu thích khám phá vẻ đẹp thiên nhiên và văn hóa bản địa của Việt Nam.</p>`,
    image:
      "https://images.unsplash.com/photo-1577133192628-221963807a77?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8c2FwYXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
    imageCaption:
      "Cảnh sắc Sapa vào mùa thu với những thửa ruộng bậc thang vàng óng",
    category: "Điểm đến",
    author: "Hoàng Văn F",
    tags: ["Sapa", "Mùa thu", "Du lịch", "Homestay", "Tây Bắc"],
    views: 4500,
    createdAt: "2025-08-28T08:00:00Z",
    relatedNews: [
      {
        id: 1,
        title: "Top 10 Homestay đẹp nhất tại Đà Lạt năm 2025",
        image:
          "https://images.unsplash.com/photo-1615460549969-36fa19521a4f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mzl8fGhvbWVzdGF5fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60",
        createdAt: "2025-08-15T08:30:00Z",
      },
      {
        id: 3,
        title: "Trải nghiệm homestay làng chài tại Phú Quốc",
        image:
          "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8ZmlzaGluZyUyMHZpbGxhZ2V8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60",
        createdAt: "2025-08-05T14:20:00Z",
      },
      {
        id: 6,
        title: "Homestay xanh - Xu hướng du lịch bền vững năm 2025",
        image:
          "https://images.unsplash.com/photo-1593170308349-9d2db7897e29?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Z3JlZW4lMjBob21lc3RheXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60",
        createdAt: "2025-08-18T13:45:00Z",
      },
    ],
  },
};
