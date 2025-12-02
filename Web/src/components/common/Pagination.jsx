import React from "react";

const Pagination = ({
  currentPage,
  totalPages,
  onChangePage,
  prevLabel = "Trước",
  nextLabel = "Sau",
  maxVisiblePages = 7,
}) => {
  if (totalPages <= 1) return null;

  // Generate page numbers with ellipsis logic
  const getPageNumbers = () => {
    const pages = [];

    // If total pages is less than max visible, show all
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Always show first page
    pages.push(1);

    // Calculate range around current page
    const halfVisible = Math.floor((maxVisiblePages - 3) / 2);
    let startPage = Math.max(2, currentPage - halfVisible);
    let endPage = Math.min(totalPages - 1, currentPage + halfVisible);

    // Adjust if we're near the start
    if (currentPage <= halfVisible + 2) {
      endPage = Math.min(totalPages - 1, maxVisiblePages - 2);
    }

    // Adjust if we're near the end
    if (currentPage >= totalPages - halfVisible - 1) {
      startPage = Math.max(2, totalPages - maxVisiblePages + 3);
    }

    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pages.push("...");
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pages.push("...");
    }

    // Always show last page
    pages.push(totalPages);

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center mt-8 gap-2">
      {/* Previous Button */}
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

      {/* Page Numbers */}
      {pageNumbers.map((page, index) =>
        page === "..." ? (
          <span
            key={`ellipsis-${index}`}
            className="px-3 py-1 text-gray-600 flex items-center"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              currentPage === page
                ? "bg-rose-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            onClick={() => onChangePage(page)}
          >
            {page}
          </button>
        )
      )}

      {/* Next Button */}
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
