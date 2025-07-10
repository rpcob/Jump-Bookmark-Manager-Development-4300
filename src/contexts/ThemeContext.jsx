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

  useEffect(() => {
    const savedTheme = localStorage.getItem('jump_theme');
    const savedBackground = localStorage.getItem('jump_background');
    const savedTransparent = localStorage.getItem('jump_transparent');
    
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    }
    if (savedBackground) {
      setBackgroundImage(savedBackground);
    }
    if (savedTransparent) {
      setTransparentCollections(savedTransparent === 'true');
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
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};