import React from 'react';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import CollectionCard from './CollectionCard';
import { useData } from '../../contexts/DataContext';

const CollectionGrid = ({ collections, transparentCollections }) => {
  const { currentSpace, updateCollectionOrder } = useData();

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

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const { source, destination } = result;
    if (source.index === destination.index) return;
    
    const items = Array.from(collections);
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);

    // Update the collection order in the data context
    updateCollectionOrder(currentSpace, items);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="collections">
        {(provided) => (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="collection-grid"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {collections.map((collection, index) => (
              <Draggable
                key={collection.id}
                draggableId={collection.id}
                index={index}
              >
                {(provided, snapshot) => (
                  <motion.div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`collection-${collection.width} ${snapshot.isDragging ? 'dragging z-50' : ''}`}
                    style={{
                      ...provided.draggableProps.style,
                      transform: snapshot.isDragging
                        ? provided.draggableProps.style?.transform
                        : 'none',
                    }}
                  >
                    <div {...provided.dragHandleProps} className="h-full">
                      <CollectionCard
                        collection={collection}
                        spaceId={currentSpace}
                        transparentBackground={transparentCollections}
                      />
                    </div>
                  </motion.div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </motion.div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default CollectionGrid;