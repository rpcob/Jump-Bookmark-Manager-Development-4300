import React from 'react';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import BookmarkItem from './BookmarkItem';

const BookmarkGrid = ({ bookmarks, collectionId, spaceId, isPublic = false }) => {
  const handleDragEnd = (result) => {
    // Implement drag and drop logic here
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId={`collection-${collectionId}`} direction="horizontal">
        {(provided) => (
          <div 
            className="bookmark-grid"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {bookmarks.map((bookmark, index) => (
              <Draggable 
                key={bookmark.id} 
                draggableId={bookmark.id} 
                index={index}
                isDragDisabled={isPublic}
              >
                {(provided, snapshot) => (
                  <motion.div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={snapshot.isDragging ? 'dragging' : ''}
                  >
                    <BookmarkItem
                      bookmark={bookmark}
                      collectionId={collectionId}
                      spaceId={spaceId}
                      viewMode="grid"
                      isPublic={isPublic}
                    />
                  </motion.div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default BookmarkGrid;