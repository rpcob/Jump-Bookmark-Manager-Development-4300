import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState('');
  const [transparentCollections, setTransparentCollections] = useState(false);
  const [iconSize, setIconSize] = useState('medium');

  useEffect(() => {
    const savedTheme = localStorage.getItem('jump_theme');
    const savedBackground = localStorage.getItem('jump_background');
    const savedTransparent = localStorage.getItem('jump_transparent');
    const savedIconSize = localStorage.getItem('jump_icon_size');

    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    }
    if (savedBackground) {
      setBackgroundImage(savedBackground);
    }
    if (savedTransparent) {
      setTransparentCollections(savedTransparent === 'true');
    }
    if (savedIconSize) {
      setIconSize(savedIconSize);
    }
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('jump_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('jump_background', backgroundImage);
  }, [backgroundImage]);

  useEffect(() => {
    localStorage.setItem('jump_transparent', transparentCollections.toString());
  }, [transparentCollections]);

  useEffect(() => {
    localStorage.setItem('jump_icon_size', iconSize);
  }, [iconSize]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const value = {
    isDark,
    toggleTheme,
    backgroundImage,
    setBackgroundImage,
    transparentCollections,
    setTransparentCollections,
    iconSize,
    setIconSize,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};