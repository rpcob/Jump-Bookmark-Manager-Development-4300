import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import Header from '../components/layout/Header';
import CollectionGrid from '../components/collections/CollectionGrid';
import CreateCollectionModal from '../components/collections/CreateCollectionModal';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Dashboard = () => {
  const { getCurrentSpace, loading } = useData();
  const { backgroundImage, transparentCollections, isDark } = useTheme();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const currentSpace = getCurrentSpace();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  const backgroundStyle = backgroundImage ? {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  } : {};

  const overlayStyle = backgroundImage ? {
    backgroundColor: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.3)',
  } : {};

  return (
    <div className="min-h-screen" style={backgroundStyle}>
      <div className="min-h-screen" style={overlayStyle}>
        <Header onCreateCollection={() => setShowCreateModal(true)} />
        
        <main className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {currentSpace && currentSpace.collections.length > 0 ? (
              <CollectionGrid 
                collections={currentSpace.collections}
                transparentCollections={transparentCollections}
              />
            ) : (
              <div className="text-center py-20">
                <div className="max-w-md mx-auto">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Welcome to Jump
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-8">
                    Start organizing your bookmarks by creating your first collection.
                  </p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Create Collection
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </main>

        <CreateCollectionModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      </div>
    </div>
  );
};

export default Dashboard;