import React from 'react';
import { motion } from 'framer-motion';
import CollectionCard from './CollectionCard';
import { useData } from '../../contexts/DataContext';

const CollectionGrid = ({ collections, transparentCollections }) => {
  const { currentSpace } = useData();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="collection-grid"
    >
      {collections.map((collection) => (
        <motion.div
          key={collection.id}
          variants={itemVariants}
          className={`collection-${collection.width}`}
        >
          <CollectionCard
            collection={collection}
            spaceId={currentSpace}
            transparentBackground={transparentCollections}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default CollectionGrid;