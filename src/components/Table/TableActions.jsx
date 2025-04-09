import React, { memo } from 'react';

const TableActions = memo(({ selectedRows, onExportCSV, hasExport }) => {
  return (
    <div className="flex space-x-2">
      {hasExport && (
        <button
          onClick={onExportCSV}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Export 
          {selectedRows > 0 ? ` (${selectedRows} Selected)` : ' All'}
        </button>
      )}
    </div>
  );
});

export default TableActions