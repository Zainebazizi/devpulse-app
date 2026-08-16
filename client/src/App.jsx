import React, { useState } from 'react';
import Dashboard from './Dashboard';
import BugJournal from './BugJournal';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [theme, setTheme] = useState('dark'); // 'dark' or 'light'

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div>
      {currentView === 'dashboard' ? (
        <Dashboard 
          onNavigateToJournal={() => setCurrentView('journal')} 
          theme={theme}
          toggleTheme={toggleTheme}
        />
      ) : (
        <BugJournal 
          onNavigateToDashboard={() => setCurrentView('dashboard')} 
          theme={theme}
          toggleTheme={toggleTheme}
        />
      )}
    </div>
  );
}