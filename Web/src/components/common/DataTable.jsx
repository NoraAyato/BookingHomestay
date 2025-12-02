import React from "react";
import Pagination from "../admin/common/Pagination";

const DataTable = ({
  columns,
  data,
  loading,
  page,
  pageSize,
  total,
  onPageChange,
  renderActions,
  emptyText,
}) => {
  // Đảm bảo data luôn là mảng
  const safeData = Array.isArray(data) ? data : [];
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-900"
                  style={{ minWidth: col.minWidth || 0 }}
                >
                  {col.title}
                </th>
              ))}
              {renderActions && (
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Thao tác
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (renderActions ? 1 : 0)}
                  className="px-6 py-8 text-center text-gray-400"
                >
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : safeData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (renderActions ? 1 : 0)}
                  className="px-6 py-8 text-center text-gray-400"
                >
                  {emptyText || "Không có dữ liệu"}
                </td>
              </tr>
            ) : (
              safeData.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-6 py-4 text-sm text-gray-900"
                    >
                      {col.render
                        ? col.render(row[col.key], row)
                        : row[col.key]}
                    </td>
                  ))}
                  {renderActions && (
                    <td className="px-6 py-4">{renderActions(row)}</td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination - chỉ hiển thị khi có dữ liệu */}
      {!loading && safeData.length > 0 && (
        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default DataTable;
