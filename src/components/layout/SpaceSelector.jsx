import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../../contexts/DataContext';
import CreateSpaceModal from '../spaces/CreateSpaceModal';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiChevronDown, FiPlus } = FiIcons;

const SpaceSelector = ({ fullWidth = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const menuRef = useRef(null);
  const { spaces, currentSpace, setCurrentSpace, getCurrentSpace } = useData();
  const currentSpaceData = getCurrentSpace();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSpaceSelect = (spaceId) => {
    setCurrentSpace(spaceId);
    setIsOpen(false);
  };

  return (
    <>
      <div className={`relative ${fullWidth ? 'w-full' : ''}`} ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
            fullWidth ? 'w-full justify-between' : ''
          }`}
        >
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
            {currentSpaceData?.name || 'Select Space'}
          </span>
          <SafeIcon
            icon={FiChevronDown}
            className={`w-4 h-4 text-gray-500 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className={`absolute mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 ${
                fullWidth ? 'w-full' : 'w-48 right-0'
              }`}
            >
              {spaces.map((space) => (
                <button
                  key={space.id}
                  onClick={() => handleSpaceSelect(space.id)}
                  className={`w-full flex items-center px-4 py-2 text-sm transition-colors ${
                    currentSpace === space.id
                      ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {space.name}
                </button>
              ))}
              <hr className="my-2 border-gray-200 dark:border-gray-700" />
              <button
                onClick={() => {
                  setShowCreateModal(true);
                  setIsOpen(false);
                }}
                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <SafeIcon icon={FiPlus} className="w-4 h-4 mr-3" />
                Create Space
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <CreateSpaceModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </>
  );
};

export default SpaceSelector;