import { useState } from 'react';
import * as XLSX from 'xlsx';

const useTableData = (data, columns) => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [columnFilters, setColumnFilters] = useState([]);

  const showTransactionDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleExport = (selectedRows) => {
    if (selectedRows.length === 0) {
      alert('Please select at least one row to export');
      return;
    }

    const ws = XLSX.utils.json_to_sheet(selectedRows);
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Selected Transactions');
    
    XLSX.writeFile(wb, 'selected_transactions.xlsx');
  };

  const handleExportAll = () => {
    if (data.length === 0) {
      alert('No data available to export');
      return;
    }

    const exportData = data.map(item => {
      const exportItem = { ...item };
      delete exportItem.select;
      delete exportItem.actions;
      
      return exportItem;
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'All Transactions');
    
    XLSX.writeFile(wb, 'all_transactions.xlsx');
  };

  return {
    selectedTransaction,
    isModalOpen,
    columnFilters,
    setColumnFilters,
    handleExport,
    handleExportAll,
    showTransactionDetails,
    closeModal
  };
};

export default useTableData;