import React, { useState, useMemo } from "react";
import NewsCard from "./NewsCard";
import Pagination from "../common/Pagination";
import LoadingSpinner from "../common/LoadingSpinner";

const NewsList = ({ newsList, loading = false, itemsPerPage = 5 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(newsList.length / itemsPerPage);

  // Get current page items
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return newsList.slice(startIndex, endIndex);
  }, [newsList, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset to page 1 when newsList changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [newsList]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (newsList.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-rose-500 mb-4">
          <i className="far fa-newspaper text-5xl"></i>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Không có tin tức
        </h3>
        <p className="text-gray-500">
          Không có tin tức nào trong danh mục này.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* News grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentItems.map((news) => (
          <NewsCard key={news.id} news={news} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onChangePage={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default NewsList;
