import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiChevronDown } = FiIcons;

const ICON_OPTIONS = [
  { value: '📁', label: 'Folder', category: 'General' },
  { value: '📚', label: 'Books', category: 'General' },
  { value: '🔖', label: 'Bookmark', category: 'General' },
  { value: '⭐', label: 'Star', category: 'General' },
  { value: '❤️', label: 'Heart', category: 'General' },
  { value: '🎯', label: 'Target', category: 'General' },
  { value: '🚀', label: 'Rocket', category: 'General' },
  { value: '💡', label: 'Lightbulb', category: 'General' },
  { value: '🔥', label: 'Fire', category: 'General' },
  { value: '⚡', label: 'Lightning', category: 'General' },
  { value: '💼', label: 'Briefcase', category: 'Work' },
  { value: '📊', label: 'Chart', category: 'Work' },
  { value: '📈', label: 'Trending Up', category: 'Work' },
  { value: '📋', label: 'Clipboard', category: 'Work' },
  { value: '🖥️', label: 'Computer', category: 'Work' },
  { value: '⚙️', label: 'Settings', category: 'Work' },
  { value: '🔧', label: 'Tools', category: 'Work' },
  { value: '📝', label: 'Note', category: 'Work' },
  { value: '🎮', label: 'Gaming', category: 'Entertainment' },
  { value: '🎵', label: 'Music', category: 'Entertainment' },
  { value: '🎬', label: 'Movie', category: 'Entertainment' },
  { value: '📺', label: 'TV', category: 'Entertainment' },
  { value: '🎨', label: 'Art', category: 'Entertainment' },
  { value: '📷', label: 'Camera', category: 'Entertainment' },
  { value: '🎪', label: 'Circus', category: 'Entertainment' },
  { value: '🏠', label: 'Home', category: 'Personal' },
  { value: '🏃', label: 'Running', category: 'Personal' },
  { value: '🍕', label: 'Food', category: 'Personal' },
  { value: '✈️', label: 'Travel', category: 'Personal' },
  { value: '🛒', label: 'Shopping', category: 'Personal' },
  { value: '💰', label: 'Money', category: 'Personal' },
  { value: '🎓', label: 'Education', category: 'Personal' },
  { value: '🏥', label: 'Health', category: 'Personal' },
];

const CATEGORIES = ['General', 'Work', 'Entertainment', 'Personal'];

const IconSelector = ({ label, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('General');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleIconSelect = (icon) => {
    onChange(icon);
    setIsOpen(false);
  };

  const filteredIcons = ICON_OPTIONS.filter(icon => icon.category === selectedCategory);

  return (
    <div ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors dark:bg-gray-800 dark:border-gray-600 dark:text-white bg-white flex items-center justify-between"
        >
          <div className="flex items-center space-x-2">
            <span className="text-lg">{value}</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {ICON_OPTIONS.find(icon => icon.value === value)?.label || 'Select icon'}
            </span>
          </div>
          <SafeIcon 
            icon={FiChevronDown} 
            className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-80 overflow-hidden"
            >
              {/* Category Tabs */}
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                      selectedCategory === category
                        ? 'text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-primary-900/20'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Icon Grid */}
              <div className="p-2 max-h-64 overflow-y-auto">
                <div className="grid grid-cols-6 gap-1">
                  {filteredIcons.map((icon) => (
                    <button
                      key={icon.value}
                      type="button"
                      onClick={() => handleIconSelect(icon.value)}
                      className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center ${
                        value === icon.value ? 'bg-primary-100 dark:bg-primary-900/20' : ''
                      }`}
                      title={icon.label}
                    >
                      <span className="text-lg">{icon.value}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default IconSelector;