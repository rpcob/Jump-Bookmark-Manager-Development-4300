import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import toast from 'react-hot-toast';

const GeneralSettings = () => {
  const [settings, setSettings] = useState({
    defaultView: 'grid',
    openLinksIn: 'new_tab',
    confirmDelete: true,
    autoSave: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    try {
      // Save settings logic here
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">General Settings</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Configure general application preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* View Preferences */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">View Preferences</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Default View
              </label>
              <select
                name="defaultView"
                value={settings.defaultView}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                <option value="grid">Grid View</option>
                <option value="list">List View</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Open Links In
              </label>
              <select
                name="openLinksIn"
                value={settings.openLinksIn}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                <option value="new_tab">New Tab</option>
                <option value="same_tab">Same Tab</option>
              </select>
            </div>
          </div>
        </div>

        {/* Behavior Settings */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Behavior</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Confirm Before Delete</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Show confirmation dialog before deleting items
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="confirmDelete"
                  checked={settings.confirmDelete}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Auto-save Changes</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automatically save changes as you make them
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="autoSave"
                  checked={settings.autoSave}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default GeneralSettings;