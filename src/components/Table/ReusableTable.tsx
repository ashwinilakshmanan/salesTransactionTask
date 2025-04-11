import React, { useState, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';

import './DataTable.css';
import { IoMdClose } from "react-icons/io";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { HiX } from 'react-icons/hi';
import {useTheme} from '../../context/ThemeContext';


const DraggableColumnHeader = ({ header, reorderColumn }) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: 'column',
    item: { id: header.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop({
    accept: 'column',
    drop: (draggedItem) => {
      const fromIndex = columns.findIndex(col => col.id === draggedItem.id);
      const toIndex = columns.findIndex(col => col.id === header.id);
      reorderColumn(fromIndex, toIndex);
    },
  });

  return (
    <th
      ref={(el) => {
        dragRef(el);
        dropRef(el);
      }}
      key={header.id}
      onClick={header.column.getToggleSortingHandler()}
      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-move
        ${isDragging ? 'opacity-50' : ''}
        ${header.column.getCanSort() ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600' : ''}`}
      style={{ width: header.column.columnDef.size ? `${header.column.columnDef.size}px` : 'auto' }}
    >
      <div className="flex items-center space-x-1">
        <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
        {header.column.getCanSort() && (
          <span className="ml-2">
            {header.column.getIsSorted() ? (
              header.column.getIsSorted() === 'asc' ? '▲' : '▼'
            ) : (
              '◆'
            )}
          </span>
        )}
      </div>
    </th>
  );
};

const ReusableTable = ({
  columns,
  data,
  fetchData,
  pageSize = 10,
  totalPages = 0,
  initialPage = 1,
  noDataMessage = 'No data available',
  exportOptions, filterConfig
}) => {
  const [pagination, setPagination] = useState({
    pageIndex: initialPage - 1,
    pageSize,
  });
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const [columnFilters, setColumnFilters] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredData, setFilteredData] = useState(data);

  const [columnOrder, setColumnOrder] = useState([]);

  const {isDarkMode} = useTheme()

  useEffect(() => {
    setColumnOrder(columns.map(col => col.id));
  }, [columns]);

  useEffect(() => {
    let result = [...data];

    // Apply date range filter if both dates are provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      result = result.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= start && itemDate <= end;
      });
    }

    setFilteredData(result);
  }, [data, startDate, endDate]);

  const reorderColumn = (draggedColumnId, targetColumnId) => {
    const newColumnOrder = [...columnOrder];
    const draggedIndex = newColumnOrder.indexOf(draggedColumnId);
    const targetIndex = newColumnOrder.indexOf(targetColumnId);

    newColumnOrder.splice(draggedIndex, 1);
    newColumnOrder.splice(targetIndex, 0, draggedColumnId);

    setColumnOrder(newColumnOrder);
  };

  const clearDateFilters = () => {
    setStartDate('');
    setEndDate('');
  };

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      pagination,
      columnFilters,
      globalFilter,
    },
    filterFns: {
      equals: (row, columnId, filterValue) => {
        return row.getValue(columnId) === filterValue;
      },
    },
    manualPagination: !!fetchData,
    pageCount: fetchData ? totalPages : undefined,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
  });

  useEffect(() => {
    if (statusFilter) {
      table.getColumn('status')?.setFilterValue(statusFilter);
    } else {
      table.getColumn('status')?.setFilterValue('');
    }
  }, [statusFilter, table]);

  useEffect(() => {
    if (fetchData) {
      fetchData(pagination.pageIndex + 1, pagination.pageSize, sorting, globalFilter);
    }
  }, [pagination.pageIndex, pagination.pageSize, sorting, globalFilter, fetchData]);

  const currentPage = pagination.pageIndex + 1;
  const totalRows = fetchData ? data.length * totalPages : data.length;
  const pageCount = fetchData ? totalPages : table.getPageCount();

  const handleExportSelected = () => {
    const selectedRows = table.getSelectedRowModel().rows.map(row => row.original);
    exportOptions.onExport(selectedRows);
  };

  const handleExportAll = () => {
    exportOptions.onExportAll();
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-colors">
        <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-gray-50 dark:bg-gray-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Date Range Filter */}
              <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="w-full sm:w-auto flex items-center gap-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">From:</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm transition-colors"
                />
              </div>
              <div className="w-full sm:w-auto flex items-center gap-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">To:</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm transition-colors"
                />
              </div>
              <button
                onClick={clearDateFilters}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
              >
                <IoMdClose size={20} />
              </button>
            </div>
            
            <div className="relative w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="w-full sm:w-auto appearance-none cursor-pointer pl-8 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm transition-colors"
              >
                <option value="">All Status</option>
                {filterConfig.statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search..."
                value={globalFilter || ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm transition-colors"
              />
              {globalFilter && (
                <button
                  onClick={() => setGlobalFilter('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                >
                  <HiX size={18} />
                </button>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleExportSelected}
              className="w-full sm:w-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
            >
              Export Selected
            </button>
            <button
              onClick={handleExportAll}
              className="w-full sm:w-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition-colors"
            >
              Export All
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <DraggableColumnHeader
                      key={header.id}
                      header={header}
                      reorderColumn={reorderColumn}
                    />
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row, i) => (
                  <tr
                    key={row.id}
                    className={`${i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'} hover:bg-gray-100 dark:hover:bg-gray-600`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center"
                  >
                    {noDataMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 sm:px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
            <div 
            className = {`  ${isDarkMode ? 'datatable-info-dark' : 'datatable-info'} mb-2`}
            >
              {totalRows > 0 ? (
                `Showing ${(currentPage - 1) * pagination.pageSize + 1} to ${Math.min(currentPage * pagination.pageSize, totalRows)
                } of ${totalRows} entries`
              ) : (
                'Showing 0 entries'
              )}
            </div> &nbsp; &nbsp;
            <span>Show</span>
            <select
              value={pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              className="rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              {[10, 20, 30, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span>entries</span>&nbsp; &nbsp;

            <span className="go-to-page">
              | Go to page:
              <input
                type="number"
                min="1"
                max={pageCount}
                defaultValue={currentPage}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0
                  table.setPageIndex(page)
                }}
                className="pagination-input"
              />
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => table.firstPage()}
              disabled={!table.getCanPreviousPage()}
              className="relative inline-flex items-center px-2 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {'<<'}
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="relative inline-flex items-center px-2 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {'<'}
            </button>

            <div className="flex -space-x-px">
              {Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
                let pageNum;
                if (pageCount <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= pageCount - 2) {
                  pageNum = pageCount - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => table.setPageIndex(pageNum - 1)}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium
                  ${currentPage === pageNum
                        ? 'z-10 bg-blue-600 text-white border-blue-600 dark:bg-blue-500 dark:border-blue-500'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="relative inline-flex items-center px-2 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {'>'}
            </button>
            <button
              onClick={() => table.lastPage()}
              disabled={!table.getCanNextPage()}
              className="relative inline-flex items-center px-2 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {'>>'}
            </button>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default ReusableTable;





