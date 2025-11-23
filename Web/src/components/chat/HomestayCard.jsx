import { getImageUrl } from "../../utils/imageUrl";
import { useNavigate } from "react-router-dom";

const HomestayCard = ({ homestay }) => {
  const navigate = useNavigate();

  // ⭐ Support cả format cũ (parsed từ text) và format mới (structuredData từ API)
  const cardData = {
    id: homestay.id,
    name: homestay.title || homestay.name, // API mới: title, cũ: name
    subtitle: homestay.subtitle,
    image: homestay.imageUrl || homestay.image, // API mới: imageUrl, cũ: image
    location:
      homestay.details?.find((d) => d.type === "text" && d.icon === "📍")
        ?.value || homestay.location,
    price: homestay.priceText || homestay.price, // API mới: priceText, cũ: price
    rating: homestay.rating,
    rooms:
      homestay.details?.find((d) => d.type === "rooms")?.value ||
      homestay.rooms, // API mới: details.rooms, cũ: rooms
    tags: homestay.tags || [],
    action: homestay.action,
  };

  const handleViewDetail = () => {
    if (
      cardData.action?.action === "view_detail" &&
      cardData.action?.targetId
    ) {
      navigate(`/homestay/detail/${cardData.action.targetId}`);
    } else if (cardData.id) {
      navigate(`/homestay/detail/${cardData.id}`);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 mb-2 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
      {/* Header với hình ảnh và thông tin */}
      <div className="flex items-start gap-3 mb-3">
        {cardData.image && (
          <div className="relative">
            <img
              src={getImageUrl(cardData.image)}
              alt={cardData.name}
              className="w-20 h-20 rounded-lg object-cover flex-shrink-0 shadow-sm"
              onError={(e) => {
                e.target.src =
                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTkiIGR5PSIuM2VtIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Ib21lc3RheTwvdGV4dD48L3N2Zz4=";
              }}
            />
            {cardData.rating && (
              <div className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-yellow-400 rounded-full border-2 border-white flex items-center gap-0.5">
                <span className="text-xs font-bold text-gray-800">
                  {cardData.rating}
                </span>
                <svg
                  className="w-2.5 h-2.5 text-gray-800"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            )}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-800 text-sm mb-1 leading-tight">
            {cardData.name}
          </h3>
          {cardData.subtitle && (
            <p className="text-gray-500 text-xs mb-1">{cardData.subtitle}</p>
          )}
          {cardData.location && (
            <div className="flex items-start gap-1 mb-2">
              <svg
                className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-gray-600 text-xs leading-relaxed">
                {cardData.location}
              </p>
            </div>
          )}
          {cardData.price && (
            <div className="flex items-center gap-1">
              <svg
                className="w-3 h-3 text-green-600 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-green-700 font-semibold text-sm">
                {cardData.price}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      {cardData.tags && cardData.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {cardData.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Details section - Hiển thị tất cả details (tiện nghi, chính sách, etc.) */}
      {homestay.details && homestay.details.length > 0 && (
        <div className="border-t border-blue-200 pt-3 mb-3">
          <div className="grid gap-2">
            {homestay.details.map((detail, index) => {
              // Skip location và rooms vì đã render ở trên
              if (detail.type === "text" && detail.icon === "📍") return null;
              if (detail.type === "rooms") return null;

              return (
                <div
                  key={index}
                  className="flex items-start gap-2 bg-white/70 border border-blue-100 rounded-md px-3 py-2"
                >
                  {detail.icon && (
                    <span className="text-base flex-shrink-0 mt-0.5">
                      {detail.icon}
                    </span>
                  )}
                  <div className="flex-1 min-w-0">
                    {detail.label && (
                      <p className="text-gray-700 text-xs font-semibold mb-0.5">
                        {detail.label}
                      </p>
                    )}
                    {detail.type === "list" &&
                    typeof detail.value === "string" ? (
                      // Tiện nghi list dạng string
                      <p className="text-gray-600 text-xs">{detail.value}</p>
                    ) : detail.type === "datetime" ? (
                      // Thời gian check-in/out
                      <p className="text-gray-600 text-xs font-medium">
                        {detail.value}
                      </p>
                    ) : (
                      // Text thông thường (chính sách hủy, etc.)
                      <p className="text-gray-600 text-xs">{detail.value}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Danh sách phòng - chỉ hiển thị nếu có rooms */}
      {cardData.rooms && cardData.rooms.length > 0 && (
        <div className="border-t border-blue-200 pt-3 mb-3">
          <div className="flex items-center gap-1 mb-2">
            <svg
              className="w-3 h-3 text-blue-600 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35.525 8.97 8.97 0 00-1.4.832z" />
            </svg>
            <p className="text-blue-800 text-xs font-semibold">Phòng có sẵn:</p>
          </div>
          <div className="grid gap-2">
            {cardData.rooms.map((room, index) => {
              // ⭐ Support cả format cũ {name, price, capacity} và format mới {roomId, price, capacity}
              const roomDisplay = room.name
                ? {
                    name: room.name,
                    price: room.price,
                    capacity: room.capacity,
                  }
                : {
                    name: `Phòng ${index + 1}`,
                    price:
                      typeof room.price === "number"
                        ? `${room.price.toLocaleString("vi-VN")} VNĐ`
                        : room.price,
                    capacity: room.capacity,
                  };

              return (
                <div
                  key={room.roomId || index}
                  className="bg-white/70 border border-blue-100 rounded-md px-3 py-2"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-gray-800 text-xs">
                      {roomDisplay.name}
                    </span>
                    <span className="text-blue-600 font-semibold text-xs">
                      {roomDisplay.price}
                    </span>
                  </div>
                  {roomDisplay.capacity && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <svg
                        className="w-3 h-3 text-gray-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                      <span className="text-gray-600 text-xs">
                        {roomDisplay.capacity} người
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action button */}
      <button
        onClick={handleViewDetail}
        className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white text-xs font-semibold py-2 px-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
      >
        {cardData.action?.label || "Xem chi tiết"}
      </button>
    </div>
  );
};

export default HomestayCard;
