import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { supabase } from '../lib/supabase';

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

  // Check for existing session on load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Get user profile data
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profile) {
            const userData = {
              id: session.user.id,
              email: session.user.email,
              name: profile.name,
              username: profile.username,
              createdAt: profile.created_at,
            };
            
            setUser(userData);
            Cookies.set('jump_user', JSON.stringify(userData), { expires: 30 });
          }
        } else {
          setUser(null);
          Cookies.remove('jump_user');
        }
      } catch (error) {
        console.error('Session check error:', error);
        setUser(null);
        Cookies.remove('jump_user');
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Get user profile data
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profile) {
            const userData = {
              id: session.user.id,
              email: session.user.email,
              name: profile.name,
              username: profile.username,
              createdAt: profile.created_at,
            };
            
            setUser(userData);
            Cookies.set('jump_user', JSON.stringify(userData), { expires: 30 });
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          Cookies.remove('jump_user');
        }
      }
    );
    
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Get the user profile data
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      const userData = {
        id: data.user.id,
        email: data.user.email,
        name: profile.name,
        username: profile.username,
        createdAt: profile.created_at,
      };
      
      setUser(userData);
      Cookies.set('jump_user', JSON.stringify(userData), { expires: 30 });
      
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const signup = async (email, password, name, username) => {
    try {
      // First create the auth user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (signUpError) throw signUpError;
      
      // Wait for the auth user to be fully created
      // This is important for RLS policies to work correctly
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Then create the user profile using the service role to bypass RLS
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: data.user.id,
            email,
            name,
            username,
            created_at: new Date().toISOString(),
          }
        ])
        .select()
        .single();
        
      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw new Error('Failed to create user profile. Please try again.');
      }
      
      const userData = {
        id: data.user.id,
        email: data.user.email,
        name: profile.name,
        username: profile.username,
        createdAt: profile.created_at,
      };
      
      setUser(userData);
      Cookies.set('jump_user', JSON.stringify(userData), { expires: 30 });
      
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    Cookies.remove('jump_user');
    Cookies.remove('jump_data');
  };

  const updateProfile = async (updates) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();
        
      if (error) throw error;
      
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      Cookies.set('jump_user', JSON.stringify(updatedUser), { expires: 30 });
      
      return updatedUser;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};