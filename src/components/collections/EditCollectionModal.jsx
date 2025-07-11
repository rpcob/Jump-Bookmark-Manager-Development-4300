import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import IconSelector from '../ui/IconSelector';
import ColorPicker from '../ui/ColorPicker';
import toast from 'react-hot-toast';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiGrid, FiList } = FiIcons;

const EditCollectionModal = ({ isOpen, onClose, collection, spaceId }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '📁',
    color: '#3B82F6',
    width: 1,
    viewMode: 'grid',
    isPublic: false,
  });
  const [loading, setLoading] = useState(false);
  const { updateCollection } = useData();

  useEffect(() => {
    if (collection) {
      setFormData({
        name: collection.name || '',
        description: collection.description || '',
        icon: collection.icon || '📁',
        color: collection.color || '#3B82F6',
        width: collection.width || 1,
        viewMode: collection.viewMode || 'grid',
        isPublic: collection.isPublic || false,
      });
    }
  }, [collection]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Collection name is required');
      return;
    }

    setLoading(true);
    try {
      await updateCollection(spaceId, collection.id, formData);
      toast.success('Collection updated successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to update collection');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : name === 'width' ? parseInt(value) : value,
    }));
  };

  const handleIconChange = (icon) => {
    setFormData(prev => ({
      ...prev,
      icon
    }));
  };

  const handleColorChange = (color) => {
    setFormData(prev => ({
      ...prev,
      color
    }));
  };

  const handleViewModeChange = (viewMode) => {
    setFormData(prev => ({
      ...prev,
      viewMode
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Collection">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter collection name"
            required
          />
          <IconSelector
            label="Icon"
            value={formData.icon}
            onChange={handleIconChange}
          />
        </div>

        <Input
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Optional description"
        />

        <div className="grid grid-cols-2 gap-4">
          <ColorPicker
            label="Color"
            value={formData.color}
            onChange={handleColorChange}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Width
            </label>
            <select
              name="width"
              value={formData.width}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value={1}>1 Column</option>
              <option value={2}>2 Columns</option>
              <option value={3}>3 Columns</option>
              <option value={4}>4 Columns</option>
            </select>
          </div>
        </div>

        {/* View Mode Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Default View Mode
          </label>
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1 w-fit">
            <button
              type="button"
              onClick={() => handleViewModeChange('grid')}
              className={`p-2 rounded transition-colors flex items-center ${
                formData.viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-600 text-primary-500'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <SafeIcon icon={FiGrid} className="w-4 h-4 mr-2" />
              Grid View
            </button>
            <button
              type="button"
              onClick={() => handleViewModeChange('list')}
              className={`p-2 rounded transition-colors flex items-center ${
                formData.viewMode === 'list'
                  ? 'bg-white dark:bg-gray-600 text-primary-500'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <SafeIcon icon={FiList} className="w-4 h-4 mr-2" />
              List View
            </button>
          </div>
        </div>

        {/* Public Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">Public Collection</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Make this collection accessible via a public link
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="isPublic"
              checked={formData.isPublic}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
          </label>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Update Collection
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditCollectionModal;