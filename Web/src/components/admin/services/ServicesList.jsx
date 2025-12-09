import { Pencil, Trash2 } from "lucide-react";

const ServicesList = ({ services, onEdit, onDelete }) => {
  return (
    <table className="w-full">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            ID
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Tên dịch vụ
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Thao tác
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {services.map((service) => (
          <tr key={service.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {service.id}
            </td>
            <td className="px-6 py-4 text-sm text-gray-900">{service.name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                onClick={() => onEdit(service)}
                className="text-blue-600 hover:text-blue-900 mr-4"
              >
                <Pencil className="h-4 w-4 inline" />
              </button>
              <button
                onClick={() => onDelete(service.id)}
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

export default ServicesList;
