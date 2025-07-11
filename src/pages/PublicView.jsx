import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import CollectionCard from '../components/collections/CollectionCard';
import { useData } from '../contexts/DataContext';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiHome, FiArrowUp } = FiIcons;

const PublicView = () => {
  const { collectionId } = useParams();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { spaces } = useData();

  useEffect(() => {
    const loadPublicCollection = () => {
      try {
        // Find the collection across all spaces
        let foundCollection = null;
        let spaceId = null;

        for (const space of spaces) {
          const found = space.collections.find(c => c.id === collectionId && c.isPublic);
          if (found) {
            foundCollection = found;
            spaceId = space.id;
            break;
          }
        }

        if (foundCollection) {
          setCollection({
            ...foundCollection,
            spaceId
          });
        } else {
          setError('Collection not found or not public');
        }
      } catch (err) {
        setError('Failed to load shared collection');
      } finally {
        setLoading(false);
      }
    };

    loadPublicCollection();
  }, [collectionId, spaces]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Collection Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            This shared collection is not available or has been removed.
          </p>
        </div>
        <Link to="/" className="flex items-center space-x-2 text-primary-500 hover:text-primary-600">
          <SafeIcon icon={FiHome} className="w-5 h-5" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
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
                  Jump
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Shared Collection
                </p>
              </div>
            </div>
            <Link 
              to="/" 
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <CollectionCard
            collection={collection}
            spaceId={collection.spaceId}
            isPublic={true}
            transparentBackground={false}
          />
        </motion.div>
      </main>
    </div>
  );
};

export default PublicView;