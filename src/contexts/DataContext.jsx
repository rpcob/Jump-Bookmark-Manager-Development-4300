import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [spaces, setSpaces] = useState([]);
  const [currentSpace, setCurrentSpace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      setSpaces([]);
      setCurrentSpace(null);
      setLoading(false);
    }
  }, [user]);

  const loadUserData = () => {
    const savedData = Cookies.get('jump_data');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setSpaces(data.spaces || []);
        setCurrentSpace(data.currentSpace || null);
      } catch (error) {
        console.error('Error parsing saved data:', error);
        initializeDefaultData();
      }
    } else {
      initializeDefaultData();
    }
    setLoading(false);
  };

  const initializeDefaultData = () => {
    const defaultSpace = {
      id: uuidv4(),
      name: 'Personal',
      collections: [],
      createdAt: new Date().toISOString(),
      backgroundImage: '', // Add background image property
    };
    setSpaces([defaultSpace]);
    setCurrentSpace(defaultSpace.id);
  };

  const saveData = (newSpaces, newCurrentSpace) => {
    const dataToSave = {
      spaces: newSpaces,
      currentSpace: newCurrentSpace,
    };
    Cookies.set('jump_data', JSON.stringify(dataToSave), { expires: 30 });
  };

  const createSpace = (name) => {
    const newSpace = {
      id: uuidv4(),
      name,
      collections: [],
      createdAt: new Date().toISOString(),
      backgroundImage: '', // Initialize with empty background
    };
    const newSpaces = [...spaces, newSpace];
    setSpaces(newSpaces);
    setCurrentSpace(newSpace.id);
    saveData(newSpaces, newSpace.id);
    return newSpace;
  };

  const updateSpace = (spaceId, updates) => {
    const newSpaces = spaces.map(space => 
      space.id === spaceId ? { ...space, ...updates } : space
    );
    setSpaces(newSpaces);
    saveData(newSpaces, currentSpace);
  };

  const deleteSpace = (spaceId) => {
    const newSpaces = spaces.filter(space => space.id !== spaceId);
    const newCurrentSpace = newSpaces.length > 0 ? newSpaces[0].id : null;
    setSpaces(newSpaces);
    setCurrentSpace(newCurrentSpace);
    saveData(newSpaces, newCurrentSpace);
  };

  const createCollection = (spaceId, collectionData) => {
    const newCollection = {
      id: uuidv4(),
      ...collectionData,
      bookmarks: [],
      isCollapsed: false,
      width: collectionData.width || 1,
      viewMode: collectionData.viewMode || 'grid',
      isPublic: collectionData.isPublic || false, // Add public flag
      createdAt: new Date().toISOString(),
    };
    const newSpaces = spaces.map(space => 
      space.id === spaceId 
        ? { ...space, collections: [...space.collections, newCollection] } 
        : space
    );
    setSpaces(newSpaces);
    saveData(newSpaces, currentSpace);
    return newCollection;
  };

  const updateCollection = (spaceId, collectionId, updates) => {
    const newSpaces = spaces.map(space => 
      space.id === spaceId 
        ? { 
            ...space, 
            collections: space.collections.map(collection => 
              collection.id === collectionId 
                ? { ...collection, ...updates } 
                : collection
            ) 
          } 
        : space
    );
    setSpaces(newSpaces);
    saveData(newSpaces, currentSpace);
  };

  const updateCollectionOrder = (spaceId, reorderedCollections) => {
    const newSpaces = spaces.map(space => 
      space.id === spaceId 
        ? { ...space, collections: reorderedCollections } 
        : space
    );
    setSpaces(newSpaces);
    saveData(newSpaces, currentSpace);
  };

  const deleteCollection = (spaceId, collectionId) => {
    const newSpaces = spaces.map(space => 
      space.id === spaceId 
        ? { 
            ...space, 
            collections: space.collections.filter(collection => 
              collection.id !== collectionId
            ) 
          } 
        : space
    );
    setSpaces(newSpaces);
    saveData(newSpaces, currentSpace);
  };

  const createBookmark = (spaceId, collectionId, bookmarkData) => {
    const newBookmark = {
      id: uuidv4(),
      ...bookmarkData,
      createdAt: new Date().toISOString(),
    };
    const newSpaces = spaces.map(space => 
      space.id === spaceId 
        ? { 
            ...space, 
            collections: space.collections.map(collection => 
              collection.id === collectionId 
                ? { ...collection, bookmarks: [...collection.bookmarks, newBookmark] } 
                : collection
            ) 
          } 
        : space
    );
    setSpaces(newSpaces);
    saveData(newSpaces, currentSpace);
    return newBookmark;
  };

  const updateBookmark = (spaceId, collectionId, bookmarkId, updates) => {
    const newSpaces = spaces.map(space => 
      space.id === spaceId 
        ? { 
            ...space, 
            collections: space.collections.map(collection => 
              collection.id === collectionId 
                ? { 
                    ...collection, 
                    bookmarks: collection.bookmarks.map(bookmark => 
                      bookmark.id === bookmarkId 
                        ? { ...bookmark, ...updates } 
                        : bookmark
                    ) 
                  } 
                : collection
            ) 
          } 
        : space
    );
    setSpaces(newSpaces);
    saveData(newSpaces, currentSpace);
  };

  const deleteBookmark = (spaceId, collectionId, bookmarkId) => {
    const newSpaces = spaces.map(space => 
      space.id === spaceId 
        ? { 
            ...space, 
            collections: space.collections.map(collection => 
              collection.id === collectionId 
                ? { 
                    ...collection, 
                    bookmarks: collection.bookmarks.filter(bookmark => 
                      bookmark.id !== bookmarkId
                    ) 
                  } 
                : collection
            ) 
          } 
        : space
    );
    setSpaces(newSpaces);
    saveData(newSpaces, currentSpace);
  };

  const getCurrentSpace = () => {
    return spaces.find(space => space.id === currentSpace);
  };

  const exportData = () => {
    return { spaces };
  };

  const importData = async (data) => {
    if (data && data.spaces && Array.isArray(data.spaces)) {
      setSpaces(data.spaces);
      const newCurrentSpace = data.spaces.length > 0 ? data.spaces[0].id : null;
      setCurrentSpace(newCurrentSpace);
      saveData(data.spaces, newCurrentSpace);
    } else {
      throw new Error('Invalid data format');
    }
  };

  const clearAllData = async () => {
    setSpaces([]);
    setCurrentSpace(null);
    saveData([], null);
    initializeDefaultData();
  };

  const value = {
    spaces,
    currentSpace,
    setCurrentSpace: (spaceId) => {
      setCurrentSpace(spaceId);
      saveData(spaces, spaceId);
    },
    loading,
    createSpace,
    updateSpace,
    deleteSpace,
    createCollection,
    updateCollection,
    updateCollectionOrder,
    deleteCollection,
    createBookmark,
    updateBookmark,
    deleteBookmark,
    getCurrentSpace,
    exportData,
    importData,
    clearAllData,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};