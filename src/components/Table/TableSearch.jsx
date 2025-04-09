import React, { useState, useEffect, memo } from 'react';
import { useDebounce } from 'use-debounce';

const TableSearch = memo(({ value: initialValue, onChange }) => {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue] = useDebounce(value, 300);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  
  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  return (
    <div className="mb-4">
      <div className="relative mt-1 rounded-md shadow-sm">
        <input
          type="text"
          className="block w-full pr-10 sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search transactions..."
          value={value || ''}
          onChange={e => setValue(e.target.value)}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
});

export default TableSearch