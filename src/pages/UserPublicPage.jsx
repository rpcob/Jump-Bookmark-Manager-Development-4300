import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import CollectionCard from '../components/collections/CollectionCard';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiArrowUp, FiHome } = FiIcons;

const UserPublicPage = () => {
  const { username } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const loadUserPublicCollections = async () => {
      try {
        // First get the user data
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('username', username)
          .single();
          
        if (userError) throw userError;
        if (!userData) throw new Error('User not found');
        
        setUserData(userData);
        
        // Then get their public collections
        const { data: collectionsData, error: collectionsError } = await supabase
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
            bookmarks:bookmarks_jump_rndm1234(*)
          `)
          .eq('user_id', userData.id)
          .eq('is_public', true)
          .order('created_at', { ascending: false });
          
        if (collectionsError) throw collectionsError;
        
        // Format the data to match our frontend structure
        const formattedCollections = collectionsData.map(collection => ({
          id: collection.id,
          name: collection.name,
          description: collection.description,
          icon: collection.icon,
          color: collection.color,
          width: collection.width,
          viewMode: collection.view_mode,
          isPublic: collection.is_public,
          isCollapsed: collection.is_collapsed,
          createdAt: collection.created_at,
          spaceId: 'public',
          bookmarks: collection.bookmarks.map(bookmark => ({
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
        }));
        
        setCollections(formattedCollections);
      } catch (err) {
        console.error('Error loading public collections:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserPublicCollections();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            User Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The user profile you're looking for doesn't exist or has been removed.
          </p>
        </div>
        <Link to="/" className="flex items-center space-x-2 text-primary-500 hover:text-primary-600">
          <SafeIcon icon={FiHome} className="w-5 h-5" />
          <span>Return to Home</span>
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
                  {userData.name}'s Collections
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  @{userData.username}
                </p>
              </div>
            </div>
            <Link
              to="/"
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Home
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {collections.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {collections.map(collection => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                  spaceId={collection.spaceId}
                  isPublic={true}
                  transparentBackground={false}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  No Public Collections
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  This user hasn't shared any collections yet.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default UserPublicPage;