export const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  export const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  export const dateRangeFilter = (row, columnId, filterValue) => {
    const { from, to } = filterValue;
    const cellValue = row.getValue(columnId);
    
    if (!cellValue) return false;
    
    const rowDate = new Date(cellValue);
    
    if (from && !to) {
      return rowDate >= new Date(from);
    } else if (!from && to) {
      return rowDate <= new Date(to);
    } else if (from && to) {
      return rowDate >= new Date(from) && rowDate <= new Date(to);
    }
    
    return true;
  };
  
  export const statusFilter = (row, columnId, filterValue) => {
    if (!filterValue) return true;
    const status = row.getValue(columnId);
    return status === filterValue;
  };
  
  export const highlightSearchTerms = (value, searchTerm) => {
    if (!searchTerm || typeof value !== 'string') return value;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return value.replace(regex, '<mark>$1</mark>');
  };