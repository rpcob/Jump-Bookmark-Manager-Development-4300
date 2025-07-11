import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useEditMode } from '../../contexts/EditModeContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiUser, FiSettings, FiLogOut, FiSun, FiMoon, FiGlobe, FiEdit } = FiIcons;

const UserMenu = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { isEditMode, toggleEditMode } = useEditMode();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSettingsClick = () => {
    navigate('/settings');
    setIsOpen(false);
  };

  const handlePublicCollectionsClick = () => {
    navigate('/public');
    setIsOpen(false);
  };

  const menuItems = [
    {
      icon: isDark ? FiSun : FiMoon,
      label: isDark ? 'Light Mode' : 'Dark Mode',
      onClick: toggleTheme
    },
    {
      icon: FiEdit,
      label: 'Edit Mode',
      onClick: toggleEditMode,
      className: isEditMode ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : '',
      indicator: isEditMode
    },
    {
      icon: FiGlobe,
      label: 'Public Collections',
      onClick: handlePublicCollectionsClick
    },
    {
      icon: FiSettings,
      label: 'Settings',
      onClick: handleSettingsClick
    },
    {
      icon: FiLogOut,
      label: 'Sign Out',
      onClick: handleLogout,
      className: 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <div className="flex items-center">
        {isEditMode && (
          <div className="mr-3 px-2 py-1 text-xs font-medium bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 rounded">
            Edit Mode
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
            <SafeIcon icon={FiUser} className="w-4 h-4 text-white" />
          </div>
          <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
            {user?.name || 'User'}
          </span>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
          >
            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.email}
              </p>
            </div>

            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className={`w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${item.className || ''}`}
              >
                <SafeIcon icon={item.icon} className="w-4 h-4 mr-3" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.indicator && (
                  <div className="w-2 h-2 bg-primary-500 rounded-full" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;