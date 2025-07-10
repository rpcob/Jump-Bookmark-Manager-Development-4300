import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import IconSelector from '../ui/IconSelector';
import ColorPicker from '../ui/ColorPicker';
import toast from 'react-hot-toast';

const EditCollectionModal = ({ isOpen, onClose, collection, spaceId }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '📁',
    color: '#3B82F6',
    width: 1,
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
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'width' ? parseInt(value) : value,
    }));
  };

  const handleIconChange = (icon) => {
    setFormData(prev => ({ ...prev, icon }));
  };

  const handleColorChange = (color) => {
    setFormData(prev => ({ ...prev, color }));
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