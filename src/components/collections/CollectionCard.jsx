import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../../contexts/DataContext';
import BookmarkGrid from '../bookmarks/BookmarkGrid';
import BookmarkList from '../bookmarks/BookmarkList';
import CollectionHeader from './CollectionHeader';
import AddBookmarkModal from '../bookmarks/AddBookmarkModal';

const CollectionCard = ({ 
  collection, 
  spaceId, 
  transparentBackground = false,
  isPublic = false 
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const { updateCollection } = useData();

  const handleToggleCollapse = () => {
    if (!isPublic) {
      updateCollection(spaceId, collection.id, {
        isCollapsed: !collection.isCollapsed,
      });
    }
  };

  const handleViewModeChange = (viewMode) => {
    if (!isPublic) {
      updateCollection(spaceId, collection.id, { viewMode });
    }
  };

  const cardClasses = `
    rounded-lg border transition-all duration-200 hover:shadow-lg
    ${transparentBackground 
      ? 'bg-white/70 dark:bg-gray-800/70 border-white/20 dark:border-gray-700/20 backdrop-blur-sm' 
      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
    }
  `;

  return (
    <motion.div
      layout
      className={cardClasses}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <CollectionHeader
        collection={collection}
        spaceId={spaceId}
        onToggleCollapse={handleToggleCollapse}
        onViewModeChange={handleViewModeChange}
        onAddBookmark={() => setShowAddModal(true)}
        isPublic={isPublic}
      />

      <AnimatePresence>
        {!collection.isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {collection.bookmarks.length > 0 ? (
              collection.viewMode === 'grid' ? (
                <BookmarkGrid
                  bookmarks={collection.bookmarks}
                  collectionId={collection.id}
                  spaceId={spaceId}
                  isPublic={isPublic}
                />
              ) : (
                <BookmarkList
                  bookmarks={collection.bookmarks}
                  collectionId={collection.id}
                  spaceId={spaceId}
                  isPublic={isPublic}
                />
              )
            ) : (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <p className="text-sm">No bookmarks yet</p>
                {!isPublic && (
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="mt-2 text-primary-500 hover:text-primary-600 text-sm font-medium"
                  >
                    Add your first bookmark
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!isPublic && (
        <AddBookmarkModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          collectionId={collection.id}
          spaceId={spaceId}
        />
      )}
    </motion.div>
  );
};

export default CollectionCard;