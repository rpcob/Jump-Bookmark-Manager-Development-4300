import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import CollectionCard from '../components/collections/CollectionCard';

const PublicView = () => {
  const { shareId } = useParams();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate loading public collection
    const loadPublicCollection = async () => {
      try {
        // In a real app, this would fetch from your backend
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data for demonstration
        const mockCollection = {
          id: shareId,
          name: 'Shared Collection',
          description: 'A publicly shared collection',
          icon: '🔗',
          color: '#3B82F6',
          bookmarks: [
            {
              id: '1',
              title: 'Example Site',
              url: 'https://example.com',
              description: 'An example website',
              favicon: 'https://example.com/favicon.ico',
              tags: ['example', 'demo'],
            },
          ],
          viewMode: 'grid',
          width: 1,
          isCollapsed: false,
        };
        
        setCollection(mockCollection);
      } catch (err) {
        setError('Failed to load shared collection');
      } finally {
        setLoading(false);
      }
    };

    loadPublicCollection();
  }, [shareId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Collection Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            This shared collection is not available or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">J</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Jump
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Shared Collection
                </p>
              </div>
            </div>
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
            spaceId="public"
            isPublic={true}
            transparentBackground={false}
          />
        </motion.div>
      </main>
    </div>
  );
};

export default PublicView;