import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { auth, initializationError, isInitialized } from '../config/firebaseConfigSafe';

const AuthContext = createContext({});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firebaseError, setFirebaseError] = useState(null);

  function login(email, password) {
    if (!isInitialized || !auth) {
      return Promise.reject(new Error('Firebase not initialized'));
    }
    return signInWithEmailAndPassword(auth, email, password);
  }

  function signup(email, password) {
    if (!isInitialized || !auth) {
      return Promise.reject(new Error('Firebase not initialized'));
    }
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    if (!isInitialized || !auth) {
      return Promise.reject(new Error('Firebase not initialized'));
    }
    return signOut(auth);
  }

  useEffect(() => {
    // Check if Firebase initialized successfully
    if (!isInitialized) {
      console.error('❌ Firebase failed to initialize:', initializationError);
      setFirebaseError(initializationError);
      setLoading(false);
      return;
    }

    if (!auth) {
      const error = new Error('Firebase Auth not available');
      console.error('❌ Firebase Auth not available');
      setFirebaseError(error);
      setLoading(false);
      return;
    }

    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('🔥 Auth state changed:', user ? 'User logged in' : 'User logged out');
      setCurrentUser(user);
      setLoading(false);
    }, (error) => {
      console.error('❌ Auth state change error:', error);
      setFirebaseError(error);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    loading,
    firebaseError,
    isFirebaseInitialized: isInitialized
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
