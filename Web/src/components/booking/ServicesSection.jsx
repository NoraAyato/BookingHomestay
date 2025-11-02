import { formatPrice } from "../../utils/price";
import { getImageUrl } from "../../utils/imageUrl";
export default function ServicesSection({
  availableServices = [],
  selectedServices = [],
  onServiceToggle,
}) {
  return (
    <div className="bg-white rounded-xl p-6 border-2 border-blue-200">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
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
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900">Dịch vụ bổ sung</h3>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
        {availableServices.map((service) => {
          const isSelected = selectedServices.includes(service.id);

          return (
            <div
              key={service.id}
              onClick={() => onServiceToggle(service.id)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                isSelected
                  ? "border-blue-500 bg-blue-50 shadow-md"
                  : "border-gray-300 hover:border-blue-300 bg-white hover:shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500 mt-4 flex-shrink-0"
                  />
                  <div className="flex items-center gap-3">
                    {/* Display service image */}

                    <img
                      src={getImageUrl(service.image)}
                      alt={service.name}
                      className="w-12 h-12 rounded-md object-cover flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm">
                        {service.name}
                      </h4>
                      <p className="text-xs text-gray-600 leading-snug">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <div className="bg-blue-500 text-white px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap">
                    {formatPrice(service.price)}
                  </div>
                  <div className="text-xs text-gray-500">/ngày</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
