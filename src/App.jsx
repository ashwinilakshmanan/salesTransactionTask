import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import Sales from './page/Sales';

const App = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
        <ThemeToggle />
        <Sales />
      </div>
    </ThemeProvider>
  );
};

export default App;
