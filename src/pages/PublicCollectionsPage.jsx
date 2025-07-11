import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import CollectionCard from '../components/collections/CollectionCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../contexts/AuthContext';

const { FiArrowUp, FiArrowLeft, FiShare2 } = FiIcons;

const PublicCollectionsPage = () => {
  const { spaces, loading } = useData();
  const { user } = useAuth();
  const [publicCollections, setPublicCollections] = useState([]);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  useEffect(() => {
    if (!loading) {
      // Find all public collections across all spaces
      const collections = [];
      spaces.forEach(space => {
        space.collections.forEach(collection => {
          if (collection.isPublic) {
            collections.push({
              ...collection,
              spaceId: space.id,
              spaceName: space.name
            });
          }
        });
      });
      setPublicCollections(collections);
    }
  }, [spaces, loading]);

  const handleCopyShareLink = () => {
    const shareUrl = `${window.location.origin}/#/u/${user.username}`;
    navigator.clipboard.writeText(shareUrl);
    setShowShareTooltip(true);
    setTimeout(() => setShowShareTooltip(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center"
              >
                <SafeIcon icon={FiArrowUp} className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Public Collections
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Browse all your public collections
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={handleCopyShareLink}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                >
                  <SafeIcon icon={FiShare2} className="w-4 h-4" />
                  <span>Share Profile</span>
                </button>
                {showShareTooltip && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded shadow-lg">
                    Link copied!
                  </div>
                )}
              </div>

              <Link
                to="/dashboard"
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <SafeIcon icon={FiArrowLeft} className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {publicCollections.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {publicCollections.map(collection => (
                <div key={collection.id} className="flex flex-col">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 px-2">
                    From space: {collection.spaceName}
                  </div>
                  <CollectionCard
                    collection={collection}
                    spaceId={collection.spaceId}
                    transparentBackground={false}
                    isPublic={false}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  No Public Collections
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  You haven't made any of your collections public yet. Edit a
                  collection and toggle "Public Collection" to share it.
                </p>
                <Link
                  to="/dashboard"
                  className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
                >
                  Return to Dashboard
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default PublicCollectionsPage;