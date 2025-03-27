import { Button } from "@material-tailwind/react";
import React from "react";

const TablePagination = ({
  totalRecords,
  pageLimit,
  currentPage,
  onPageChanged,
}) => {
  const totalPages = Math.ceil(totalRecords / pageLimit);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    onPageChanged({ currentPage: page });
  };

  return (
    <div className="flex justify-between items-center mt-6">
      <Button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        السابق
      </Button>
      <span className="text-gray-600">
        {currentPage} / {totalPages}
      </span>
      <Button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        التالي
      </Button>
    </div>
  );
};

export default TablePagination;
