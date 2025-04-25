import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import {
  GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut
} from 'firebase/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  googleSignIn: () => Promise<void>;
  logout: () => Promise<void>;
  auth: any;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState(null);

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google Sign-in Error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {

      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const value: AuthContextType = {
    isAuthenticated: !!user,
    user,
    googleSignIn,
    logout,
    auth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
