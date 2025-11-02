import { formatPrice } from "../../utils/price";
import { getImageUrl } from "../../utils/imageUrl";

export default function PromotionsSection({
  availablePromotions = [],
  selectedPromotion,
  priceBreakdown,
  bookingData,
  onPromotionSelect,
  isLocked = false,
}) {
  return (
    <div className="bg-white rounded-xl p-6 border-2 border-orange-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900">Khuyến mãi có sẵn</h3>
        </div>
        {isLocked && (
          <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
            <svg
              className="w-4 h-4 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span className="text-xs font-semibold text-green-700">
              Đã áp dụng
            </span>
          </div>
        )}
      </div>

      {availablePromotions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 px-4 bg-gray-50 rounded-lg border border-gray-200">
          <svg
            className="w-16 h-16 text-gray-300 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
          <p className="text-sm font-medium text-gray-900 mb-1">
            Hiện không có khuyến mãi khả dụng
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-transparent">
          {availablePromotions.map((promotion) => {
            const isEligible =
              bookingData &&
              priceBreakdown.basePrice + priceBreakdown.servicesTotal >=
                promotion.minSpend;
            const isSelected = selectedPromotion?.id === promotion.id;

            return (
              <div
                key={promotion.id}
                onClick={() =>
                  !isLocked && isEligible && onPromotionSelect(promotion)
                }
                className={`p-3 rounded-lg border transition-all ${
                  isLocked ? "cursor-not-allowed opacity-80" : "cursor-pointer"
                } ${
                  isSelected
                    ? "border-orange-500 bg-orange-50 shadow-md"
                    : isEligible
                    ? "border-gray-300 hover:border-orange-300 bg-white hover:shadow-sm"
                    : "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Promotion Image */}
                    {promotion.image && (
                      <div className="flex-shrink-0">
                        <img
                          src={getImageUrl(promotion.image)}
                          alt={promotion.title}
                          className="w-16 h-16 object-cover rounded-md border border-gray-200"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {promotion.title}
                        </h4>
                        <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded font-medium flex-shrink-0">
                          {promotion.code}
                        </span>
                        {isLocked && isSelected && (
                          <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded font-medium flex-shrink-0 flex items-center gap-1">
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Đã chọn
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 leading-snug">
                        {promotion.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Từ {formatPrice(promotion.minSpend)}
                      </p>
                      {!isEligible && (
                        <p className="text-xs text-red-500 mt-0.5">
                          Chưa đủ điều kiện
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="font-bold text-orange-600 text-sm flex-shrink-0">
                    {promotion.discountType?.toLowerCase() === "percentage"
                      ? `-${promotion.discountValue}%`
                      : `-${formatPrice(promotion.discountValue)}₫`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
