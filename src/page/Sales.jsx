import React, { useEffect, useMemo, useState } from 'react'
import TransactionModal from '../components/Modal/TransactionModal';
import ReusableTable from '../components/Table/ReusableTable';
import useTableData from '../hooks/useTableData';
import { formatCurrency, formatDate } from '../utils/formatters';
import { createColumnHelper } from '@tanstack/react-table';
import ThemeToggle from '../components/ThemeToggle';
import salesData from '../salesData.json'

const Sales = () => {

  const [data, setData] = useState([]);
  const columnHelper = createColumnHelper();

  useEffect(() => {
    setData(salesData.salesData);
  }, []);

  const columns = useMemo(() => [
    columnHelper.accessor('select', {
      id: 'select',
      header: ({ table }) => (
        <div className="px-1">
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="px-1">
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        </div>
      ),
      enableSorting: false,
      size: 50,
    }),
    columnHelper.accessor('transactionId', {
      header: 'Transaction ID',
      cell: info => info.getValue(),
      enableSorting: true,
    }),
    columnHelper.accessor('date', {
      header: 'Date',
      cell: info => formatDate(info.getValue()),
      enableSorting: true,
    }),
    columnHelper.accessor('customerName', {
      header: 'Customer',
      cell: info => info.getValue(),
      enableSorting: true,
    }),
    columnHelper.accessor('product', {
      header: 'Product',
      cell: info => info.getValue(),
      enableSorting: true,
    }),
    columnHelper.accessor('quantity', {
      header: 'Quantity',
      cell: info => info.getValue(),
      enableSorting: true,
    }),
    columnHelper.accessor('unitPrice', {
      header: 'Unit Price',
      cell: info => formatCurrency(info.getValue()),
      enableSorting: true,
    }),
    columnHelper.accessor('totalAmount', {
      header: 'Total Amount',
      cell: info => formatCurrency(info.getValue()),
      enableSorting: true,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => {
        const status = info.getValue();
        let bgColor = 'bg-gray-100 text-gray-800';

        if (status === 'Completed') {
          bgColor = 'bg-green-100 text-green-800';
        } else if (status === 'Pending') {
          bgColor = 'bg-yellow-100 text-yellow-800';
        } else if (status === 'Canceled') {
          bgColor = 'bg-red-100 text-red-800';
        }

        return (
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor}`}>
            {status}
          </span>
        );
      },
      enableSorting: true,
      filterFn: 'equals',
    }),
    columnHelper.accessor('actions', {
      header: 'Actions',
      cell: ({ row }) => (
        <button
          onClick={() => showTransactionDetails(row.original)}
          className="text-blue-600 hover:text-blue-900"
        >
          View
        </button>
      ),
      enableSorting: false,
    }),
  ], []);

  const {
    selectedTransaction,
    isModalOpen,
    columnFilters,
    handleExport,
    handleExportAll,
    showTransactionDetails,
    closeModal
  } = useTableData(data, columns);

  const exportOptions = {
    onExport: handleExport,
    onExportAll: handleExportAll
  };

  const filterConfig = {
    statuses: ['Completed', 'Pending', 'Canceled']
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-4 sm:py-6 transition-colors">
    <div className="relative px-2 py-3 sm:px-6 sm:max-w-screen-2xl sm:mx-auto">
        <div className="relative px-2 py-4 sm:px-6 bg-white dark:bg-gray-800 shadow-lg sm:rounded-3xl sm:p-8 transition-colors">
          <div className="max-w-full mx-auto">
            <div>
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div className="w-full flex justify-center">
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-6 sm:mb-8 text-center transition-colors">
                  Sales Transactions
                </h1>
              </div>
                <ThemeToggle />
            </div>
              <ReusableTable
                data={data}
                columns={columns}
                exportOptions={exportOptions}
                filterConfig={filterConfig}
              />
              {isModalOpen && (
                <TransactionModal
                  transaction={selectedTransaction}
                  onClose={closeModal}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sales
