// @refresh reset
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
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { dataService } from '../services/dataService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Friendly mapper for Firebase Auth errors
export const formatFirebaseAuthError = (error) => {
  if (!error) return 'An error occurred during authentication.';
  const code = error.code || '';
  switch (code) {
    case 'auth/invalid-email':
      return 'The email address is not valid.';
    case 'auth/user-disabled':
      return 'This user account has been disabled.';
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email address already exists.';
    case 'auth/operation-not-allowed':
      return 'Email/Password sign-in is not enabled in the Firebase Console.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized in Firebase Console. Please add your current URL under Firebase Authentication > Settings > Authorized Domains, or use Demo Sign-in below.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in window was closed before completing.';
    case 'auth/popup-blocked':
      return 'Sign-in popup was blocked by your browser. Please allow popups.';
    case 'auth/cancelled-popup-request':
      return 'Only one popup sign-in request can be active at a time.';
    case 'auth/network-request-failed':
      return 'Network connection error. Please check your internet connection.';
    default:
      return error.message?.replace(/^Firebase:\s*/, '') || 'Authentication failed.';
  }
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  // Listen to Firebase Auth state
  useEffect(() => {
    let unsubscribe = () => {};

    if (auth) {
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const profile = await dataService.getUser(firebaseUser.uid);
            const userDoc = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || profile?.name || 'Eco Citizen',
              email: firebaseUser.email,
              avatar: firebaseUser.photoURL || profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(firebaseUser.uid)}`,
              role: profile?.role || 'citizen',
              ecoPoints: profile?.ecoPoints ?? 500,
              carbonSaved: profile?.carbonSaved ?? 0,
              currentFootprint: profile?.currentFootprint ?? 160,
              rank: profile?.rank ?? 12,
              streak: profile?.streak ?? 1,
              joinedDate: profile?.joinedDate || 'September 2026',
              ...profile,
            };
            setCurrentUser(userDoc);
            await dataService.updateUser(userDoc);
          } catch (err) {
            console.error('Error fetching user profile:', err);
            setCurrentUser({
              id: firebaseUser.uid,
              name: firebaseUser.displayName || 'Eco Citizen',
              email: firebaseUser.email,
              avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(firebaseUser.uid)}`,
              role: 'citizen',
              ecoPoints: 500,
              carbonSaved: 0,
              currentFootprint: 160,
              rank: 12,
              streak: 1,
              joinedDate: 'September 2026',
            });
          }
        } else {
          setCurrentUser(null);
        }
        setLoading(false);
      });
    } else {
      setCurrentUser(null);
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  // Email/Password Signup
  const signup = async (email, password, name, role = 'citizen') => {
    setAuthError('');
    if (!auth) {
      const msg = 'Firebase is not initialized. Please verify your .env configuration.';
      setAuthError(msg);
      throw new Error(msg);
    }
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      
      if (name) {
        try {
          await updateProfile(res.user, { displayName: name });
        } catch (e) {
          console.warn('Could not set displayName on Firebase Auth user:', e);
        }
      }

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
    } catch (err) {
      const friendlyMsg = formatFirebaseAuthError(err);
      setAuthError(friendlyMsg);
      throw new Error(friendlyMsg);
    }
  };

  // Email/Password Login
  const login = async (email, password) => {
    setAuthError('');
    if (!auth) {
      const msg = 'Firebase is not initialized. Please verify your .env configuration.';
      setAuthError(msg);
      throw new Error(msg);
    }
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const profile = await dataService.getUser(res.user.uid);
      const userDoc = {
        id: res.user.uid,
        name: res.user.displayName || profile?.name || 'Eco Citizen',
        email: res.user.email,
        avatar: res.user.photoURL || profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(res.user.uid)}`,
        role: profile?.role || 'citizen',
        ecoPoints: profile?.ecoPoints ?? 500,
        carbonSaved: profile?.carbonSaved ?? 0,
        currentFootprint: profile?.currentFootprint ?? 160,
        rank: profile?.rank ?? 12,
        streak: profile?.streak ?? 1,
        joinedDate: profile?.joinedDate || 'September 2026',
        ...profile,
      };
      setCurrentUser(userDoc);
      return userDoc;
    } catch (err) {
      const friendlyMsg = formatFirebaseAuthError(err);
      setAuthError(friendlyMsg);
      throw new Error(friendlyMsg);
    }
  };

  // Google Sign In
  const loginWithGoogle = async () => {
    setAuthError('');
    if (!auth || !googleProvider) {
      const msg = 'Google authentication is not configured.';
      setAuthError(msg);
      throw new Error(msg);
    }
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const existing = await dataService.getUser(res.user.uid);
      const userDoc = {
        ...existing,
        id: res.user.uid,
        name: res.user.displayName || existing?.name || 'Eco Citizen',
        email: res.user.email,
        avatar: res.user.photoURL || existing?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(res.user.uid)}`,
        role: existing?.role || 'citizen',
        ecoPoints: existing?.ecoPoints ?? 500,
        carbonSaved: existing?.carbonSaved ?? 0,
        currentFootprint: existing?.currentFootprint ?? 160,
        rank: existing?.rank ?? 12,
        streak: existing?.streak ?? 1,
        joinedDate: existing?.joinedDate || 'September 2026',
      };
      await dataService.updateUser(userDoc);
      setCurrentUser(userDoc);
      return userDoc;
    } catch (err) {
      const friendlyMsg = formatFirebaseAuthError(err);
      setAuthError(friendlyMsg);
      throw new Error(friendlyMsg);
    }
  };

  // Quick Demo Guest Login (works unconditionally even when offline or unauthorized domain)
  const loginAsDemo = async (role = 'citizen') => {
    setAuthError('');
    const demoUser = {
      id: 'user_carbonly_demo',
      name: role === 'merchant' ? 'Eco Artisan Shop' : 'Geetika Soni (Demo)',
      email: role === 'merchant' ? 'merchant@carbonly.eco' : 'geetika@carbonly.eco',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      role,
      ecoPoints: 4180,
      carbonSaved: 48.5,
      currentFootprint: 142,
      rank: 3,
      streak: 7,
      joinedDate: 'September 2026',
    };
    await dataService.updateUser(demoUser);
    setCurrentUser(demoUser);
    return demoUser;
  };

  // Logout
  const logout = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
      setCurrentUser(null);
    } catch (err) {
      console.error('Logout error', err);
      throw err;
    }
  };

  const value = {
    currentUser,
    setCurrentUser,
    signup,
    login,
    loginWithGoogle,
    loginAsDemo,
    logout,
    loading,
    authError,
    setAuthError,
    isFirebaseConfigured,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
