import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import toast from 'react-hot-toast';

const { FiUpload, FiX, FiImage, FiRefreshCw } = FiIcons;

const IconUpload = ({ label, value, onUpload, onRemove, fallbackUrl }) => {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFiles = (files) => {
    const file = files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image too large. Maximum size is 2MB');
      return;
    }

    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Create a canvas to resize the image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size to 32x32 (favicon size)
        canvas.width = 32;
        canvas.height = 32;
        
        // Draw and resize the image
        ctx.drawImage(img, 0, 0, 32, 32);
        
        // Convert to data URL
        const dataUrl = canvas.toDataURL('image/png');
        onUpload(dataUrl);
        setLoading(false);
        toast.success('Icon uploaded successfully!');
      };
      img.onerror = () => {
        setLoading(false);
        toast.error('Failed to process image');
      };
      img.src = e.target.result;
    };
    reader.onerror = () => {
      setLoading(false);
      toast.error('Failed to read file');
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const currentIcon = value || fallbackUrl;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      
      <div className="flex items-start space-x-4">
        {/* Current Icon Preview */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center border border-gray-300 dark:border-gray-600">
            {currentIcon ? (
              <img
                src={currentIcon}
                alt="Icon preview"
                className="w-12 h-12 rounded object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <SafeIcon
              icon={FiImage}
              className={`w-8 h-8 text-gray-400 ${currentIcon ? 'hidden' : 'flex'}`}
            />
          </div>
          {value && (
            <p className="text-xs text-green-600 dark:text-green-400 mt-1 text-center">
              Custom
            </p>
          )}
          {!value && fallbackUrl && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
              Auto-fetched
            </p>
          )}
        </div>

        {/* Upload Area */}
        <div className="flex-1">
          <div
            className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
              dragActive
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileSelect}
            />
            
            {loading ? (
              <div className="flex flex-col items-center space-y-2">
                <SafeIcon icon={FiRefreshCw} className="w-6 h-6 text-primary-500 animate-spin" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Processing...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <SafeIcon icon={FiUpload} className="w-6 h-6 text-gray-400" />
                <div>
                  <button
                    type="button"
                    onClick={handleClick}
                    className="text-sm text-primary-600 hover:text-primary-500 font-medium"
                  >
                    Upload custom icon
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    PNG, JPG up to 2MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 mt-2">
            {value && (
              <button
                type="button"
                onClick={onRemove}
                className="flex items-center space-x-1 px-2 py-1 text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <SafeIcon icon={FiX} className="w-3 h-3" />
                <span>Remove custom</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Upload a custom icon to replace the auto-fetched favicon. Images will be resized to 32x32 pixels.
      </p>
    </div>
  );
};

export default IconUpload;