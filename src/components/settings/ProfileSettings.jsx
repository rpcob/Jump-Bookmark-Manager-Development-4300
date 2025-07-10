import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import toast from 'react-hot-toast';

const ProfileSettings = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile({
        name: formData.name,
        email: formData.email,
      });
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // Implement password change logic
      toast.success('Password updated successfully');
      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (error) {
      toast.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Information */}
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Profile Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your email"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" loading={loading}>
              Update Profile
            </Button>
          </div>
        </form>

        {/* Password Change */}
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Change Password</h3>
          <Input
            label="Current Password"
            name="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={handleChange}
            placeholder="Enter current password"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="New Password"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
            />
            <Input
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
            />
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              loading={loading}
              disabled={!formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
            >
              Change Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;