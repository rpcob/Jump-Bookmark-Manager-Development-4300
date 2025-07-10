import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = Cookies.get('jump_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        Cookies.remove('jump_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data
    const userData = {
      id: Date.now().toString(),
      email,
      name: email.split('@')[0],
      createdAt: new Date().toISOString(),
    };

    setUser(userData);
    Cookies.set('jump_user', JSON.stringify(userData), { expires: 30 });
    return userData;
  };

  const signup = async (email, password, name) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const userData = {
      id: Date.now().toString(),
      email,
      name: name || email.split('@')[0],
      createdAt: new Date().toISOString(),
    };

    setUser(userData);
    Cookies.set('jump_user', JSON.stringify(userData), { expires: 30 });
    return userData;
  };

  const logout = () => {
    setUser(null);
    Cookies.remove('jump_user');
    Cookies.remove('jump_data');
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};