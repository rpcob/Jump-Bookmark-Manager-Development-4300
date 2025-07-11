import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import CollectionCard from '../components/collections/CollectionCard';
import { supabase } from '../lib/supabase';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiHome, FiArrowUp } = FiIcons;

const PublicView = () => {
  const { collectionId } = useParams();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPublicCollection = async () => {
      try {
        // Fetch the collection data
        const { data: collectionData, error: collectionError } = await supabase
          .from('collections_jump_rndm1234')
          .select(`
            id,
            name,
            description,
            icon,
            color,
            width,
            view_mode,
            is_public,
            is_collapsed,
            created_at,
            user_id
          `)
          .eq('id', collectionId)
          .eq('is_public', true)
          .single();
          
        if (collectionError) throw collectionError;
        if (!collectionData) throw new Error('Collection not found or not public');
        
        // Fetch the bookmarks for this collection
        const { data: bookmarksData, error: bookmarksError } = await supabase
          .from('bookmarks_jump_rndm1234')
          .select('*')
          .eq('collection_id', collectionId);
          
        if (bookmarksError) throw bookmarksError;
        
        // Format the data to match our frontend structure
        const formattedCollection = {
          id: collectionData.id,
          name: collectionData.name,
          description: collectionData.description,
          icon: collectionData.icon,
          color: collectionData.color,
          width: collectionData.width,
          viewMode: collectionData.view_mode,
          isPublic: collectionData.is_public,
          isCollapsed: collectionData.is_collapsed,
          createdAt: collectionData.created_at,
          spaceId: 'public',
          bookmarks: bookmarksData.map(bookmark => ({
            id: bookmark.id,
            title: bookmark.title,
            url: bookmark.url,
            description: bookmark.description,
            favicon: bookmark.favicon,
            hasCustomIcon: bookmark.has_custom_icon,
            tags: bookmark.tags || [],
            notes: bookmark.notes,
            createdAt: bookmark.created_at
          }))
        };
        
        setCollection(formattedCollection);
      } catch (err) {
        console.error('Error loading public collection:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadPublicCollection();
  }, [collectionId]);

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