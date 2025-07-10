import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import toast from 'react-hot-toast';

const AddBookmarkModal = ({ isOpen, onClose, collectionId, spaceId }) => {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    tags: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const { createBookmark } = useData();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.url.trim()) {
      toast.error('URL is required');
      return;
    }

    setLoading(true);
    try {
      // Simulate fetching metadata
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const bookmarkData = {
        ...formData,
        title: formData.title || formData.url,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        favicon: `https://www.google.com/s2/favicons?domain=${new URL(formData.url).hostname}&sz=32`,
      };

      await createBookmark(spaceId, collectionId, bookmarkData);
      toast.success('Bookmark added successfully!');
      onClose();
      setFormData({
        title: '',
        url: '',
        description: '',
        tags: '',
        notes: '',
      });
    } catch (error) {
      toast.error('Failed to add bookmark');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Bookmark">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="URL"
          name="url"
          type="url"
          value={formData.url}
          onChange={handleChange}
          placeholder="https://example.com"
          required
        />

        <Input
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Will be fetched automatically if empty"
        />

        <Input
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Optional description"
        />

        <Input
          label="Tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="tag1, tag2, tag3"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Optional notes"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Add Bookmark
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddBookmarkModal;