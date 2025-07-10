import React from 'react';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import BookmarkItem from './BookmarkItem';

const BookmarkList = ({ bookmarks, collectionId, spaceId, isPublic = false }) => {
  const handleDragEnd = (result) => {
    // Implement drag and drop logic here
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId={`collection-${collectionId}`}>
        {(provided) => (
          <div 
            className="bookmark-list"
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
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={snapshot.isDragging ? 'dragging' : ''}
                  >
                    <BookmarkItem
                      bookmark={bookmark}
                      collectionId={collectionId}
                      spaceId={spaceId}
                      viewMode="list"
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

export default BookmarkList;