import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  isFirebaseConfigured, 
  auth, 
  googleProvider 
} from '../firebase/config';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { dataService } from '../services/dataService';
import { initialUser } from '../data/mockData';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  // Initialize auth state
  useEffect(() => {
    let unsubscribe = () => {};

    if (isFirebaseConfigured && auth) {
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const profile = await dataService.getUser(firebaseUser.uid);
          setCurrentUser({
            id: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || profile.name || 'Eco Citizen',
            avatar: firebaseUser.photoURL || profile.avatar,
            ...profile,
          });
        } else {
          // Check local stored session
          const localUser = await dataService.getUser();
          setCurrentUser(localUser);
        }
        setLoading(false);
      });
    } else {
      // Local demo mode default
      dataService.getUser().then((user) => {
        setCurrentUser(user);
        setLoading(false);
      });
    }

    return () => unsubscribe();
  }, []);

  // Email/Password Signup
  const signup = async (email, password, name, role = 'citizen') => {
    setAuthError('');
    try {
      if (isFirebaseConfigured && auth) {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const newUserDoc = {
          id: res.user.uid,
          name,
          email,
          role,
          ecoPoints: 500, // Welcome bonus
          carbonSaved: 0,
          currentFootprint: 160,
          rank: 12,
          streak: 1,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
          joinedDate: 'September 2026',
        };
        await dataService.updateUser(newUserDoc);
        setCurrentUser(newUserDoc);
        return newUserDoc;
      } else {
        // Mock signup
        const newUserDoc = {
          ...initialUser,
          id: `user_${Date.now()}`,
          name,
          email,
          role,
          ecoPoints: 500,
          carbonSaved: 0,
          streak: 1,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
        };
        await dataService.updateUser(newUserDoc);
        setCurrentUser(newUserDoc);
        return newUserDoc;
      }
    } catch (err) {
      setAuthError(err.message || 'Failed to create an account');
      throw err;
    }
  };

  // Email/Password Login
  const login = async (email, password) => {
    setAuthError('');
    try {
      if (isFirebaseConfigured && auth) {
        const res = await signInWithEmailAndPassword(auth, email, password);
        const profile = await dataService.getUser(res.user.uid);
        setCurrentUser(profile);
        return profile;
      } else {
        // Local mode check
        const user = await dataService.getUser();
        setCurrentUser(user);
        return user;
      }
    } catch (err) {
      setAuthError(err.message || 'Failed to log in');
      throw err;
    }
  };

  // Google Sign In
  const loginWithGoogle = async () => {
    setAuthError('');
    try {
      if (isFirebaseConfigured && auth && googleProvider) {
        const res = await signInWithPopup(auth, googleProvider);
        const existing = await dataService.getUser(res.user.uid);
        const userDoc = {
          ...existing,
          id: res.user.uid,
          name: res.user.displayName || 'Eco Citizen',
          email: res.user.email,
          avatar: res.user.photoURL || existing.avatar,
        };
        await dataService.updateUser(userDoc);
        setCurrentUser(userDoc);
        return userDoc;
      } else {
        // Demo google login fallback
        const demoUser = {
          ...initialUser,
          name: 'Geetika Soni (Google)',
          email: 'geetika.google@carbonly.eco',
        };
        await dataService.updateUser(demoUser);
        setCurrentUser(demoUser);
        return demoUser;
      }
    } catch (err) {
      setAuthError(err.message || 'Google sign-in error');
      throw err;
    }
  };

  // Instant Demo Login (Hackathon Judge convenience)
  const loginAsDemoCitizen = async () => {
    const user = {
      ...initialUser,
      role: 'citizen',
    };
    await dataService.updateUser(user);
    setCurrentUser(user);
    return user;
  };

  const loginAsDemoMerchant = async () => {
    const merchantUser = {
      ...initialUser,
      name: 'EarthCraft Merchant',
      email: 'merchant@earthcraft.eco',
      role: 'merchant',
      businessName: 'EarthCraft Studio Ahmedabad',
    };
    await dataService.updateUser(merchantUser);
    setCurrentUser(merchantUser);
    return merchantUser;
  };

  // Logout
  const logout = async () => {
    try {
      if (isFirebaseConfigured && auth) {
        await signOut(auth);
      }
      setCurrentUser(null);
    } catch (err) {
      console.error('Logout error', err);
    }
  };

  const value = {
    currentUser,
    setCurrentUser,
    signup,
    login,
    loginWithGoogle,
    loginAsDemoCitizen,
    loginAsDemoMerchant,
    logout,
    loading,
    authError,
    isFirebaseConfigured,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
