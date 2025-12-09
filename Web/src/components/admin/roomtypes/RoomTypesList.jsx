import { Pencil, Trash2 } from "lucide-react";

const RoomTypesList = ({ roomTypes, onEdit, onDelete }) => {
  return (
    <table className="w-full">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            ID
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Tên loại phòng
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
        {roomTypes.map((roomType) => (
          <tr key={roomType.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {roomType.id}
            </td>
            <td className="px-6 py-4 text-sm text-gray-900">{roomType.name}</td>
            <td className="px-6 py-4 text-sm text-gray-500">
              {roomType.description}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                onClick={() => onEdit(roomType)}
                className="text-blue-600 hover:text-blue-900 mr-4"
              >
                <Pencil className="h-4 w-4 inline" />
              </button>
              <button
                onClick={() => onDelete(roomType.id)}
                className="text-red-600 hover:text-red-900"
              >
                <Trash2 className="h-4 w-4 inline" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RoomTypesList;
