import React from "react";
import { Edit2, Trash2 } from "lucide-react";

const AmenitiesList = ({ amenities, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên tiện nghi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mô tả
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {amenities.length > 0 ? (
              amenities.map((amenity) => (
                <tr
                  key={amenity.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    #{amenity.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {amenity.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 max-w-md truncate">
                      {amenity.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onEdit(amenity)}
                      className="text-blue-600 hover:text-blue-900 mr-3 inline-flex items-center gap-1"
                    >
                      <Edit2 className="h-4 w-4" />
                      Sửa
                    </button>
                    <button
                      onClick={() => onDelete(amenity.id)}
                      className="text-red-600 hover:text-red-900 inline-flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                  Không tìm thấy tiện nghi nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AmenitiesList;
