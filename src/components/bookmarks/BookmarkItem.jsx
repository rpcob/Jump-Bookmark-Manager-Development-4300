import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useData } from '../../contexts/DataContext';
import { useEditMode } from '../../contexts/EditModeContext';
import { useTheme } from '../../contexts/ThemeContext';
import EditBookmarkModal from './EditBookmarkModal';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiMoreHorizontal, FiEdit2, FiTrash2, FiExternalLink } = FiIcons;

const BookmarkItem = ({ bookmark, collectionId, spaceId, viewMode, isPublic = false }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuButtonRef = useRef(null);
  const menuRef = useRef(null);
  const { deleteBookmark } = useData();
  const { iconSize } = useTheme();
  const { isEditMode } = useEditMode();

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
        left: rect.right + window.scrollX - 128, // 128px is menu width (w-32)
      });
    }
    setShowMenu(!showMenu);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this bookmark?')) {
      deleteBookmark(spaceId, collectionId, bookmark.id);
    }
    setShowMenu(false);
  };

  const handleEdit = () => {
    setShowEditModal(true);
    setShowMenu(false);
  };

  const handleClick = () => {
    if (!isEditMode && bookmark.url) {
      window.open(bookmark.url, '_blank', 'noopener,noreferrer');
    }
  };

  const getFaviconUrl = (url) => {
    // Always use the stored favicon first (could be custom or auto-fetched)
    if (bookmark.favicon) return bookmark.favicon;
    if (!url) return null;
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return null;
    }
  };

  const faviconUrl = getFaviconUrl(bookmark.url);

  // Icon size configurations
  const iconSizes = {
    small: { container: 'w-8 h-8', icon: 'w-4 h-4' },
    medium: { container: 'w-10 h-10', icon: 'w-5 h-5' },
    large: { container: 'w-12 h-12', icon: 'w-6 h-6' },
    xl: { container: 'w-14 h-14', icon: 'w-7 h-7' },
  };

  const currentIconSize = iconSizes[iconSize] || iconSizes.medium;

  // Menu component that renders in portal
  const MenuPortal = () => {
    if (!showMenu) return null;

    return createPortal(
      <div
        ref={menuRef}
        className="fixed w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-[9999]"
        style={{
          top: `${menuPosition.top}px`,
          left: `${menuPosition.left}px`,
        }}
      >
        <button
          onClick={handleEdit}
          className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <SafeIcon icon={FiEdit2} className="w-4 h-4 mr-2" />
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="w-full flex items-center px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <SafeIcon icon={FiTrash2} className="w-4 h-4 mr-2" />
          Delete
        </button>
      </div>,
      document.body
    );
  };

  const editModeClass = isEditMode ? 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-gray-800' : '';

  if (viewMode === 'grid') {
    return (
      <>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`relative group cursor-pointer ${editModeClass}`}
        >
          <div
            onClick={isEditMode ? handleMenuToggle : handleClick}
            className={`${currentIconSize.container} bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors relative`}
            title={bookmark.title || bookmark.url}
          >
            {faviconUrl ? (
              <img
                src={faviconUrl}
                alt={bookmark.title}
                className={`${currentIconSize.icon} rounded object-cover`}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <SafeIcon
              icon={FiExternalLink}
              className={`${currentIconSize.icon} text-gray-500 ${faviconUrl ? 'hidden' : 'flex'}`}
            />
            
            {/* Custom icon indicator */}
            {bookmark.hasCustomIcon && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
            )}
          </div>

          {!isPublic && !isEditMode && (
            <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                ref={menuButtonRef}
                onClick={handleMenuToggle}
                className="p-1 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <SafeIcon icon={FiMoreHorizontal} className="w-3 h-3 text-gray-500" />
              </button>
            </div>
          )}
        </motion.div>

        {!isPublic && <MenuPortal />}
        {!isPublic && (
          <EditBookmarkModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            bookmark={bookmark}
            collectionId={collectionId}
            spaceId={spaceId}
          />
        )}
      </>
    );
  }

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`group flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${editModeClass}`}
        onClick={isEditMode ? handleMenuToggle : handleClick}
      >
        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center flex-shrink-0 relative">
          {faviconUrl ? (
            <img
              src={faviconUrl}
              alt={bookmark.title}
              className="w-5 h-5 rounded object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <SafeIcon
            icon={FiExternalLink}
            className={`w-4 h-4 text-gray-500 ${faviconUrl ? 'hidden' : 'flex'}`}
          />
          
          {/* Custom icon indicator */}
          {bookmark.hasCustomIcon && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-white dark:border-gray-800" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {bookmark.title}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {bookmark.description || bookmark.url}
          </p>
        </div>

        {bookmark.tags && bookmark.tags.length > 0 && (
          <div className="flex-shrink-0 hidden sm:block">
            <div className="flex flex-wrap gap-1">
              {bookmark.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400 rounded"
                >
                  {tag}
                </span>
              ))}
              {bookmark.tags.length > 2 && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400 rounded">
                  +{bookmark.tags.length - 2}
                </span>
              )}
            </div>
          </div>
        )}

        {!isPublic && !isEditMode && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              ref={menuButtonRef}
              onClick={handleMenuToggle}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
            >
              <SafeIcon icon={FiMoreHorizontal} className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        )}
      </motion.div>

      {!isPublic && <MenuPortal />}
      {!isPublic && (
        <EditBookmarkModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          bookmark={bookmark}
          collectionId={collectionId}
          spaceId={spaceId}
        />
      )}
    </>
  );
};

export default BookmarkItem;