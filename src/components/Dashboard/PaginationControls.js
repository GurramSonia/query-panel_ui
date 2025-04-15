// components/PaginationControls.js
import React from 'react';

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => (
  <div className="pagination">
    <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
      Previous
    </button>
    {Array.from({ length: totalPages }, (_, index) => (
      <button
        key={index + 1}
        className={currentPage === index + 1 ? 'active' : ''}
        onClick={() => onPageChange(index + 1)}
      >
        {index + 1}
      </button>
    ))}
    <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
      Next
    </button>
  </div>
);

export default PaginationControls;
