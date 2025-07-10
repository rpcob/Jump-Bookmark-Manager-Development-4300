import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import AppearanceSettings from '../components/settings/AppearanceSettings';
import ProfileSettings from '../components/settings/ProfileSettings';
import DataSettings from '../components/settings/DataSettings';
import GeneralSettings from '../components/settings/GeneralSettings';
import SettingsSidebar from '../components/settings/SettingsSidebar';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiX } = FiIcons;

const SettingsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleClose = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden relative"
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close settings"
          >
            <SafeIcon icon={FiX} className="w-5 h-5 text-gray-500" />
          </button>
          
          <div className="flex flex-col md:flex-row">
            <SettingsSidebar />
            <div className="flex-1 min-w-0 overflow-hidden">
              <Routes>
                <Route path="profile" element={<ProfileSettings />} />
                <Route path="appearance" element={<AppearanceSettings />} />
                <Route path="data" element={<DataSettings />} />
                <Route path="general" element={<GeneralSettings />} />
                <Route index element={<ProfileSettings />} />
              </Routes>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;