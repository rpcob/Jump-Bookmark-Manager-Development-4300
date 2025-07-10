import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../../contexts/DataContext';
import EditBookmarkModal from './EditBookmarkModal';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiMoreHorizontal, FiEdit2, FiTrash2, FiExternalLink } = FiIcons;

const BookmarkItem = ({ bookmark, collectionId, spaceId, viewMode, isPublic = false }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { deleteBookmark } = useData();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this bookmark?')) {
      deleteBookmark(spaceId, collectionId, bookmark.id);
    }
    setShowMenu(false);
  };

  const handleClick = () => {
    if (bookmark.url) {
      window.open(bookmark.url, '_blank', 'noopener,noreferrer');
    }
  };

  const getFaviconUrl = (url) => {
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

  if (viewMode === 'grid') {
    return (
      <>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative group cursor-pointer"
        >
          <div
            onClick={handleClick}
            className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {faviconUrl ? (
              <img
                src={faviconUrl}
                alt={bookmark.title}
                className="w-6 h-6 rounded"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <SafeIcon icon={FiExternalLink} className="w-5 h-5 text-gray-500" />
            )}
          </div>
          
          {!isPublic && (
            <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                  }}
                  className="p-1 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <SafeIcon icon={FiMoreHorizontal} className="w-3 h-3 text-gray-500" />
                </button>
                
                {showMenu && (
                  <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowEditModal(true);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center px-3 py-1 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <SafeIcon icon={FiEdit2} className="w-3 h-3 mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete();
                      }}
                      className="w-full flex items-center px-3 py-1 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <SafeIcon icon={FiTrash2} className="w-3 h-3 mr-2" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>

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
        className="group flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
        onClick={handleClick}
      >
        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center flex-shrink-0">
          {faviconUrl ? (
            <img
              src={faviconUrl}
              alt={bookmark.title}
              className="w-5 h-5 rounded"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <SafeIcon icon={FiExternalLink} className="w-4 h-4 text-gray-500" />
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
          <div className="flex-shrink-0">
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
        
        {!isPublic && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
              >
                <SafeIcon icon={FiMoreHorizontal} className="w-4 h-4 text-gray-500" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowEditModal(true);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center px-3 py-1 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <SafeIcon icon={FiEdit2} className="w-3 h-3 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete();
                    }}
                    className="w-full flex items-center px-3 py-1 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <SafeIcon icon={FiTrash2} className="w-3 h-3 mr-2" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>

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