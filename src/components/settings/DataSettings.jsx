import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import toast from 'react-hot-toast';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiDownload, FiUpload, FiTrash2 } = FiIcons;

const DataSettings = () => {
  const { spaces, importData, exportData, clearAllData } = useData();
  const [showClearModal, setShowClearModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleExport = () => {
    try {
      const data = exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `jump-bookmarks-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        // Check if event.target exists and has result property
        if (event.target && event.target.result) {
          const data = JSON.parse(event.target.result.toString());
          await importData(data);
          toast.success('Data imported successfully');
        }
      } catch (error) {
        toast.error('Failed to import data');
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = async () => {
    setLoading(true);
    try {
      await clearAllData();
      setShowClearModal(false);
      toast.success('All data cleared successfully');
    } catch (error) {
      toast.error('Failed to clear data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Data Management</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Export, import, or clear your bookmark data
        </p>
      </div>

      <div className="space-y-6">
        {/* Data Statistics */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Data Overview</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Spaces</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{spaces.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Collections</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {spaces.reduce((acc, space) => acc + space.collections.length, 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Export/Import */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Export & Import</h3>
          <div className="flex space-x-4">
            <Button onClick={handleExport} variant="secondary" className="flex-1">
              <SafeIcon icon={FiDownload} className="w-5 h-5 mr-2" />
              Export Data
            </Button>
            <Button variant="secondary" className="flex-1">
              <label className="flex items-center justify-center cursor-pointer">
                <SafeIcon icon={FiUpload} className="w-5 h-5 mr-2" />
                Import Data
                <input
                  type="file"
                  accept="application/json"
                  className="hidden"
                  onChange={handleImport}
                />
              </label>
            </Button>
          </div>
        </div>

        {/* Clear Data */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Danger Zone</h3>
          <div className="border border-red-200 dark:border-red-900 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-medium text-red-600 dark:text-red-400">Clear All Data</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This action cannot be undone. All spaces, collections, and bookmarks will be permanently deleted.
                </p>
              </div>
              <Button variant="danger" onClick={() => setShowClearModal(true)}>
                <SafeIcon icon={FiTrash2} className="w-5 h-5 mr-2" />
                Clear Data
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Clear Data Confirmation Modal */}
      <Modal isOpen={showClearModal} onClose={() => setShowClearModal(false)} title="Clear All Data">
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to clear all your data? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setShowClearModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleClearData} loading={loading}>
              Clear All Data
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DataSettings;