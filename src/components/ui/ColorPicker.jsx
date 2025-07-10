import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiChevronDown, FiCheck } = FiIcons;

const PRESET_COLORS = [
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Yellow', value: '#EAB308' },
  { name: 'Green', value: '#10B981' },
  { name: 'Teal', value: '#14B8A6' },
  { name: 'Cyan', value: '#06B6D4' },
  { name: 'Indigo', value: '#6366F1' },
  { name: 'Gray', value: '#6B7280' },
  { name: 'Slate', value: '#64748B' },
];

const ColorPicker = ({ label, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState(value);
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

  useEffect(() => {
    setCustomColor(value);
  }, [value]);

  const handleColorSelect = (color) => {
    onChange(color);
    setIsOpen(false);
  };

  const handleCustomColorChange = (e) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
    onChange(newColor);
  };

  const selectedColorName = PRESET_COLORS.find(color => color.value === value)?.name || 'Custom';

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
            <div 
              className="w-5 h-5 rounded-full border border-gray-300 dark:border-gray-600"
              style={{ backgroundColor: value }}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedColorName}
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
              className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3"
            >
              {/* Preset Colors */}
              <div className="mb-3">
                <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preset Colors
                </h4>
                <div className="grid grid-cols-6 gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => handleColorSelect(color.value)}
                      className="relative w-8 h-8 rounded-lg border border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    >
                      {value === color.value && (
                        <SafeIcon 
                          icon={FiCheck} 
                          className="w-4 h-4 text-white absolute inset-0 m-auto drop-shadow-sm" 
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Color */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Custom Color
                </h4>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={customColor}
                    onChange={handleCustomColorChange}
                    className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customColor}
                    onChange={(e) => {
                      setCustomColor(e.target.value);
                      if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                        onChange(e.target.value);
                      }
                    }}
                    className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="#000000"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ColorPicker;