import React from "react";

const Pagination = ({
  currentPage,
  totalPages,
  onChangePage,
  prevLabel = "Trước",
  nextLabel = "Sau",
}) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-center mt-8 gap-2">
      <button
        className={`px-3 py-1 rounded font-medium transition-colors ${
          currentPage === 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-60"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
        disabled={currentPage === 1}
        onClick={() => onChangePage(currentPage - 1)}
        aria-disabled={currentPage === 1}
      >
        {prevLabel}
      </button>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          className={`px-3 py-1 rounded ${
            currentPage === i + 1
              ? "bg-rose-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
          onClick={() => onChangePage(i + 1)}
        >
          {i + 1}
        </button>
      ))}
      <button
        className={`px-3 py-1 rounded font-medium transition-colors ${
          currentPage === totalPages
            ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-60"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
        disabled={currentPage === totalPages}
        onClick={() => onChangePage(currentPage + 1)}
        aria-disabled={currentPage === totalPages}
      >
        {nextLabel}
      </button>
    </div>
  );
};

export default Pagination;
