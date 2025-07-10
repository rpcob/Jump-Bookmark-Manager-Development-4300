import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import toast from 'react-hot-toast';

const CreateSpaceModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { createSpace } = useData();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Space name is required');
      return;
    }

    setLoading(true);
    try {
      await createSpace(name);
      toast.success('Space created successfully!');
      onClose();
      setName('');
    } catch (error) {
      toast.error('Failed to create space');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Space">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Space Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter space name (e.g., Work, Personal)"
          required
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Create Space
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateSpaceModal;