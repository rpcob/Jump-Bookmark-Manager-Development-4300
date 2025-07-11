import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import IconUpload from '../ui/IconUpload';
import toast from 'react-hot-toast';

const EditBookmarkModal = ({ isOpen, onClose, bookmark, collectionId, spaceId }) => {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    tags: '',
    notes: '',
    customIcon: null,
  });
  const [loading, setLoading] = useState(false);
  const { updateBookmark } = useData();

  useEffect(() => {
    if (bookmark) {
      setFormData({
        title: bookmark.title || '',
        url: bookmark.url || '',
        description: bookmark.description || '',
        tags: bookmark.tags ? bookmark.tags.join(',') : '',
        notes: bookmark.notes || '',
        customIcon: bookmark.hasCustomIcon ? bookmark.favicon : null,
      });
    }
  }, [bookmark]);

  const fetchMetadata = async (url) => {
    try {
      const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      if (data.status === 'success') {
        return {
          title: data.data.title || '',
          description: data.data.description || '',
        };
      }
    } catch (error) {
      console.error('Error fetching metadata:', error);
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.url.trim()) {
      toast.error('URL is required');
      return;
    }

    setLoading(true);
    try {
      let metadata = null;
      if (!formData.title.trim()) {
        metadata = await fetchMetadata(formData.url);
      }

      // Use custom icon if provided, otherwise use auto-fetched favicon
      const favicon = formData.customIcon || 
        `https://www.google.com/s2/favicons?domain=${new URL(formData.url).hostname}&sz=32`;

      const bookmarkData = {
        ...formData,
        title: formData.title || (metadata?.title || formData.url),
        description: formData.description || (metadata?.description || ''),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        favicon,
        hasCustomIcon: !!formData.customIcon,
      };

      await updateBookmark(spaceId, collectionId, bookmark.id, bookmarkData);
      toast.success('Bookmark updated successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to update bookmark');
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

  const handleIconUpload = (iconDataUrl) => {
    setFormData(prev => ({
      ...prev,
      customIcon: iconDataUrl,
    }));
  };

  const handleIconRemove = () => {
    setFormData(prev => ({
      ...prev,
      customIcon: null,
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Bookmark">
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

        <IconUpload
          label="Custom Icon"
          value={formData.customIcon}
          onUpload={handleIconUpload}
          onRemove={handleIconRemove}
          fallbackUrl={formData.url ? `https://www.google.com/s2/favicons?domain=${new URL(formData.url).hostname}&sz=32` : null}
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
            Update Bookmark
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditBookmarkModal;