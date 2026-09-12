import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { dataService } from '../services/dataService';
import { useAuth } from './AuthContext';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const { currentUser, setCurrentUser } = useAuth();
  const [toasts, setToasts] = useState([]);
  const [activeVerification, setActiveVerification] = useState(null); // { action, category }
  const [userStats, setUserStats] = useState({
    ecoPoints: 4180,
    carbonSaved: 48.5,
    streak: 7,
    rank: 3,
    currentFootprint: 142,
  });

  // Sync with currentUser
  useEffect(() => {
    if (currentUser) {
      setUserStats({
        ecoPoints: currentUser.ecoPoints ?? 4180,
        carbonSaved: currentUser.carbonSaved ?? 48.5,
        streak: currentUser.streak ?? 7,
        rank: currentUser.rank ?? 3,
        currentFootprint: currentUser.currentFootprint ?? 142,
      });
    }
  }, [currentUser]);

  // Toast helper
  const addToast = ({ title, message, type = 'success', points = null, duration = 4500 }) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, title, message, type, points }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#059669', '#34d399', '#f59e0b', '#3b82f6'],
      });
    } catch (e) {
      console.log('Confetti triggered');
    }
  };

  // Verification flow launcher
  const openVerificationModal = (action, category = 'repair') => {
    setActiveVerification({ action, category });
  };

  const closeVerificationModal = () => {
    setActiveVerification(null);
  };

  // Submit verified action
  const submitVerification = async (actionData) => {
    try {
      const result = await dataService.logAndVerifyAction(actionData);
      
      // Update local state
      const updatedUser = await dataService.getUser();
      setCurrentUser(updatedUser);
      setUserStats({
        ecoPoints: updatedUser.ecoPoints,
        carbonSaved: updatedUser.carbonSaved,
        streak: updatedUser.streak,
        rank: updatedUser.rank,
        currentFootprint: updatedUser.currentFootprint,
      });

      triggerConfetti();

      addToast({
        title: 'Action Verified! 🎉',
        message: `${actionData.title} logged successfully. +${actionData.carbonSaved} kg CO₂e avoided!`,
        type: 'points',
        points: actionData.ecoPoints,
      });

      closeVerificationModal();
      return result;
    } catch (err) {
      addToast({
        title: 'Verification Failed',
        message: err.message || 'Could not verify action. Please try again.',
        type: 'error',
      });
      throw err;
    }
  };

  // Redeem Reward helper
  const redeemReward = async (reward) => {
    try {
      const { redeemedItem, remainingPoints } = await dataService.redeemReward(reward);
      
      const updatedUser = await dataService.getUser();
      setCurrentUser(updatedUser);
      setUserStats((prev) => ({
        ...prev,
        ecoPoints: remainingPoints,
      }));

      triggerConfetti();

      addToast({
        title: 'Reward Redeemed! 🎁',
        message: `Voucher Code: ${redeemedItem.code} generated. Copied to your Green Wallet!`,
        type: 'success',
      });

      return redeemedItem;
    } catch (err) {
      addToast({
        title: 'Redemption Failed',
        message: err.message,
        type: 'error',
      });
      throw err;
    }
  };

  const value = {
    toasts,
    addToast,
    removeToast,
    triggerConfetti,
    activeVerification,
    openVerificationModal,
    closeVerificationModal,
    submitVerification,
    redeemReward,
    userStats,
    setUserStats,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
