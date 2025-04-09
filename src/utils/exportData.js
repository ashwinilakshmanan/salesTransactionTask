export const exportToCSV = (rows, columns) => {
    const headers = columns
      .filter(column => column.id !== 'actions' && column.id !== 'select')
      .map(column => column.header);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => {
        return columns
          .filter(column => column.id !== 'actions' && column.id !== 'select')
          .map(column => {
            const cellValue = row.original[column.id];
            
            let value = cellValue;
            if (typeof cellValue === 'object' && cellValue !== null) {
              value = JSON.stringify(cellValue).replace(/"/g, '""');
            }
            
            if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
              value = `"${value}"`;
            }
            
            return value;
          })
          .join(',');
      })
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `sales_data_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
    