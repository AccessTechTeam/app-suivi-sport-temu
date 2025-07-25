
import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { APP_NAME } from '../constants';
import { LogoutIcon } from './icons';

const Header: React.FC = () => {
  const { currentUser, logout, setPage } = useAppContext();

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 
            className="text-2xl font-bold text-brand-primary cursor-pointer"
            onClick={() => setPage('dashboard')}
          >
            {APP_NAME}
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">
              Welcome, <span className="font-semibold">{currentUser?.username}</span>
              {currentUser?.isCoach && ' (Coach)'}
            </span>
            <button
              onClick={logout}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-brand-danger focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary"
              aria-label="Logout"
            >
              <LogoutIcon />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
