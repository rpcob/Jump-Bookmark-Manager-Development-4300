import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiUser, FiLayout, FiDatabase, FiSettings, FiArrowLeft } = FiIcons;

const SettingsSidebar = () => {
  const navigate = useNavigate();
  
  const navItems = [
    { path: 'profile', icon: FiUser, label: 'Profile' },
    { path: 'appearance', icon: FiLayout, label: 'Appearance' },
    { path: 'data', icon: FiDatabase, label: 'Data Management' },
    { path: 'general', icon: FiSettings, label: 'General' },
  ];

  return (
    <div className="w-full md:w-64 border-r border-gray-200 dark:border-gray-700">
      {/* Mobile back button */}
      <div className="md:hidden p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <SafeIcon icon={FiArrowLeft} className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>
      </div>
      
      <nav className="p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }
          >
            <SafeIcon icon={item.icon} className="w-5 h-5 mr-3" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default SettingsSidebar;