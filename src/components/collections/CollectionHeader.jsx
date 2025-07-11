import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useData } from '../../contexts/DataContext';
import EditCollectionModal from './EditCollectionModal';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiChevronDown, FiChevronRight, FiPlus, FiMoreHorizontal, FiEdit2, FiTrash2, FiShare2 } = FiIcons;

const CollectionHeader = ({ collection, spaceId, onToggleCollapse, onAddBookmark, isPublic = false }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuButtonRef = useRef(null);
  const menuRef = useRef(null);
  const { deleteCollection } = useData();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && 
          menuButtonRef.current && !menuButtonRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenu]);

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    
    if (!showMenu && menuButtonRef.current) {
      const rect = menuButtonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.right + window.scrollX - 192, // 192px is menu width (w-48)
      });
    }
    
    setShowMenu(!showMenu);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this collection?')) {
      deleteCollection(spaceId, collection.id);
    }
    setShowMenu(false);
  };

  const handleEdit = () => {
    setShowEditModal(true);
    setShowMenu(false);
  };

  const handleShare = () => {
    // Generate shareable link
    const shareUrl = `${window.location.origin}/#/public/${collection.id}`;
    navigator.clipboard.writeText(shareUrl);
    // You could show a toast notification here
    setShowMenu(false);
  };

  // Menu component that renders in portal
  const MenuPortal = () => {
    if (!showMenu) return null;

    return createPortal(
      <div
        ref={menuRef}
        className="fixed w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-[9999]"
        style={{
          top: `${menuPosition.top}px`,
          left: `${menuPosition.left}px`,
        }}
      >
        <button
          onClick={handleEdit}
          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <SafeIcon icon={FiEdit2} className="w-4 h-4 mr-3" />
          Edit Collection
        </button>
        <button
          onClick={handleShare}
          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <SafeIcon icon={FiShare2} className="w-4 h-4 mr-3" />
          Share Collection
        </button>
        <button
          onClick={handleDelete}
          className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <SafeIcon icon={FiTrash2} className="w-4 h-4 mr-3" />
          Delete Collection
        </button>
      </div>,
      document.body
    );
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between py-2 px-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-0">
          {!isPublic && (
            <button
              onClick={onToggleCollapse}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <SafeIcon
                icon={collection.isCollapsed ? FiChevronRight : FiChevronDown}
                className="w-4 h-4 text-gray-500"
              />
            </button>
          )}
          <div className="flex items-center space-x-2">
            {collection.icon && <span className="text-lg">{collection.icon}</span>}
            <h3 className="font-semibold text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-none">
              {collection.name}
            </h3>
          </div>
          {collection.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
              {collection.description}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {!isPublic && (
            <>
              <button
                onClick={onAddBookmark}
                className="p-2 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
              >
                <SafeIcon icon={FiPlus} className="w-4 h-4" />
              </button>
              <button
                ref={menuButtonRef}
                onClick={handleMenuToggle}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <SafeIcon icon={FiMoreHorizontal} className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {collection.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 px-4 py-1 sm:hidden">
          {collection.description}
        </p>
      )}

      {!isPublic && <MenuPortal />}

      {!isPublic && (
        <EditCollectionModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          collection={collection}
          spaceId={spaceId}
        />
      )}
    </>
  );
};

export default CollectionHeader;