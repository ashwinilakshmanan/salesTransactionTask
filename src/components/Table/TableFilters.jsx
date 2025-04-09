import React, { useState, useMemo, memo } from 'react';

const TableFilters = memo(({ table, setColumnFilters, filterConfig }) => {
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [status, setStatus] = useState('');

  const handleDateFilterChange = () => {
    const filters = [...table.getState().columnFilters];
    
    if (dateRange.from || dateRange.to) {
      const dateFilter = filters.find(f => f.id === 'date');
      const newFilter = { id: 'date', value: dateRange };
      
      if (dateFilter) {
        const filterIndex = filters.findIndex(f => f.id === 'date');
        filters[filterIndex] = newFilter;
      } else {
        filters.push(newFilter);
      }
    } else {
      const filterIndex = filters.findIndex(f => f.id === 'date');
      if (filterIndex >= 0) {
        filters.splice(filterIndex, 1);
      }
    }
    
    setColumnFilters(filters);
  };
  
  const handleStatusFilterChange = (selectedStatus) => {
    const filters = [...table.getState().columnFilters];
    setStatus(selectedStatus);
    
    if (selectedStatus) {
      const statusFilter = filters.find(f => f.id === 'status');
      const newFilter = { id: 'status', value: selectedStatus };
      
      if (statusFilter) {
        const filterIndex = filters.findIndex(f => f.id === 'status');
        filters[filterIndex] = newFilter;
      } else {
        filters.push(newFilter);
      }
    } else {
      const filterIndex = filters.findIndex(f => f.id === 'status');
      if (filterIndex >= 0) {
        filters.splice(filterIndex, 1);
      }
    }
    
    setColumnFilters(filters);
  };

  const statuses = useMemo(() => {
    return filterConfig.statuses || ['Completed', 'Pending', 'Canceled'];
  }, [filterConfig]);

  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-700">Date Range</label>
        <div className="mt-1 flex space-x-2">
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) => {
              setDateRange(prev => ({ ...prev, from: e.target.value }));
              handleDateFilterChange();
            }}
            className="block w-full sm:text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          <span className="text-gray-500 self-center">to</span>
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => {
              setDateRange(prev => ({ ...prev, to: e.target.value }));
              handleDateFilterChange();
            }}
            className="block w-full sm:text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          value={status}
          onChange={(e) => handleStatusFilterChange(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="">All Statuses</option>
          {statuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <div className="self-end">
        <button
          onClick={() => {
            setDateRange({ from: '', to: '' });
            setStatus('');
            setColumnFilters([]);
          }}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
});

export default TableFilters