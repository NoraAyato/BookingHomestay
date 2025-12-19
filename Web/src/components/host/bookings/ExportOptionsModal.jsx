import React, { useState } from "react";
import { X, Download, Calendar } from "lucide-react";

const ExportOptionsModal = ({ isOpen, onClose, onExport, isExporting }) => {
  const [selectedDays, setSelectedDays] = useState(7);

  const handleExport = () => {
    onExport(selectedDays);
  };

  if (!isOpen) return null;

  const options = [
    {
      value: 0,
      label: "Hôm nay",
      description: "Xuất booking trong ngày hôm nay",
    },
    {
      value: 7,
      label: "7 ngày gần nhất",
      description: "Xuất booking trong 7 ngày qua",
    },
    {
      value: 14,
      label: "14 ngày gần nhất",
      description: "Xuất booking trong 14 ngày qua",
    },
    {
      value: 30,
      label: "30 ngày gần nhất",
      description: "Xuất booking trong 30 ngày qua",
    },
    {
      value: 90,
      label: "90 ngày gần nhất",
      description: "Xuất booking trong 90 ngày qua",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="h-6 w-6" />
            <h2 className="text-xl font-bold">Xuất báo cáo booking</h2>
          </div>
          <button
            onClick={onClose}
            disabled={isExporting}
            className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors disabled:opacity-50"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            Chọn khoảng thời gian để xuất báo cáo:
          </p>

          {/* Options */}
          <div className="space-y-2 mb-6">
            {options.map((option) => (
              <label
                key={option.value}
                className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedDays === option.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="exportDays"
                  value={option.value}
                  checked={selectedDays === option.value}
                  onChange={(e) => setSelectedDays(parseInt(e.target.value))}
                  className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
                  disabled={isExporting}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <p className="font-semibold text-gray-900">
                      {option.label}
                    </p>
                  </div>
                  <p className="text-xs text-gray-600">{option.description}</p>
                </div>
              </label>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isExporting}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hủy
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Đang xuất...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5" />
                  Xuất báo cáo
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportOptionsModal;
