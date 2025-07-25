
import React from 'react';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import DashboardScreen from './screens/DashboardScreen';
import AddActivityScreen from './screens/AddActivityScreen';
import HistoryScreen from './screens/HistoryScreen';
import Header from './components/Header';
import { useAppContext } from './hooks/useAppContext';

const App: React.FC = () => {
  const { page, currentUser } = useAppContext();

  const renderPage = () => {
    if (!currentUser) {
      switch (page) {
        case 'signup':
          return <SignupScreen />;
        default:
          return <LoginScreen />;
      }
    }

    switch (page) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'addActivity':
        return <AddActivityScreen />;
      case 'history':
        return <HistoryScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-brand-dark font-sans">
      {currentUser && <Header />}
      <main className="p-4 sm:p-6 lg:p-8">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;
