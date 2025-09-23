'use client';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      // Show all pages if small total
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Always show first page
      pages.push(1);

      // Left dots
      if (currentPage > 4) {
        pages.push("...");
      }

      // Pages around current
      const start = Math.max(2, currentPage - 2);
      const end = Math.min(totalPages - 1, currentPage + 2);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Right dots
      if (currentPage < totalPages - 3) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex justify-center gap-2 mt-4">
      {/* Prev button */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded bg-gray-200 text-gray-800 disabled:opacity-50"
      >
        Prev
      </button>

      {/* Numbered pages */}
      {getPageNumbers().map((page, idx) =>
  page === "..." ? (
    <span key={`ellipsis-${idx}`} className="px-3 py-1">
      ...
    </span>
  ) : (
    <button
      key={`page-${page}`}
      onClick={() => onPageChange(page as number)}
      className={`px-3 py-1 rounded ${
        page === currentPage ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
      }`}
    >
      {page}
    </button>
  )
)}


      {/* Next button */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded bg-gray-200 text-gray-800 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
