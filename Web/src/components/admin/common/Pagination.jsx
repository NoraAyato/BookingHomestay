import React from "react";

const Pagination = ({ page, pageSize, total, onPageChange }) => {
  const totalPages = Math.ceil(total / pageSize);

  // Hàm tạo mảng số trang hiển thị với dấu ...
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (page > 3) {
        pages.push("...");
      }

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-700">
          Hiển thị{" "}
          <span className="font-medium">{(page - 1) * pageSize + 1}</span> đến{" "}
          <span className="font-medium">
            {Math.min(page * pageSize, total)}
          </span>{" "}
          trong <span className="font-medium">{total}</span> kết quả
        </p>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
          >
            Trước
          </button>
          {pageNumbers.map((pageNum, index) =>
            pageNum === "..." ? (
              <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                ...
              </span>
            ) : (
              <button
                key={pageNum}
                className={`px-3 py-1 rounded text-sm ${
                  page === pageNum
                    ? "bg-blue-600 text-white"
                    : "border border-gray-300 hover:bg-gray-50 transition-colors"
                }`}
                onClick={() => onPageChange(pageNum)}
              >
                {pageNum}
              </button>
            )
          )}
          <button
            className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
