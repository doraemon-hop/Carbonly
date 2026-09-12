import { 
  isFirebaseConfigured, 
  db 
} from '../firebase/config';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  addDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';

import {
  initialUser,
  initialFootprintBreakdown,
  initialRecentActions,
  initialLocations,
  initialProducts,
  initialRewards,
  initialBadges,
  initialLeaderboard,
  initialChallenges,
  initialImpactFeed,
  communityStats
} from '../data/mockData';

// Local storage key helper
const STORAGE_PREFIX = 'carbonly_';

const getStorageItem = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.error('LocalStorage error', err);
  }
};

class DataService {
  constructor() {
    this.initData();
  }

  initData() {
    if (!getStorageItem('user', null)) {
      setStorageItem('user', initialUser);
    }
    if (!getStorageItem('footprint', null)) {
      setStorageItem('footprint', initialFootprintBreakdown);
    }
    if (!getStorageItem('actions', null)) {
      setStorageItem('actions', initialRecentActions);
    }
    if (!getStorageItem('locations', null)) {
      setStorageItem('locations', initialLocations);
    }
    if (!getStorageItem('products', null)) {
      setStorageItem('products', initialProducts);
    }
    if (!getStorageItem('rewards', null)) {
      setStorageItem('rewards', initialRewards);
    }
    if (!getStorageItem('badges', null)) {
      setStorageItem('badges', initialBadges);
    }
    if (!getStorageItem('leaderboard', null)) {
      setStorageItem('leaderboard', initialLeaderboard);
    }
    if (!getStorageItem('challenges', null)) {
      setStorageItem('challenges', initialChallenges);
    }
    if (!getStorageItem('feed', null)) {
      setStorageItem('feed', initialImpactFeed);
    }
    if (!getStorageItem('redeemedRewards', null)) {
      setStorageItem('redeemedRewards', []);
    }
  }

  // Get current user
  async getUser(userId = 'user_carbonly_01') {
    if (isFirebaseConfigured && db) {
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          return { id: userDoc.id, ...userDoc.data() };
        }
      } catch (e) {
        console.warn('Firestore getUser failed, using local:', e);
      }
    }
    return getStorageItem('user', initialUser);
  }

  // Update user profile or points
  async updateUser(updatedFields) {
    const currentUser = getStorageItem('user', initialUser);
    const merged = { ...currentUser, ...updatedFields };
    setStorageItem('user', merged);

    // Update leaderboard if points or name changed
    if (updatedFields.ecoPoints !== undefined || updatedFields.name !== undefined) {
      const board = getStorageItem('leaderboard', initialLeaderboard);
      const updatedBoard = board.map(item => {
        if (item.isCurrentUser) {
          return {
            ...item,
            name: `You (${merged.name})`,
            ecoPoints: merged.ecoPoints,
            carbonSaved: merged.carbonSaved
          };
        }
        return item;
      }).sort((a, b) => b.ecoPoints - a.ecoPoints);

      // Recalculate ranks
      updatedBoard.forEach((item, index) => {
        item.rank = index + 1;
      });

      setStorageItem('leaderboard', updatedBoard);
      
      const userRank = updatedBoard.find(i => i.isCurrentUser)?.rank || 3;
      merged.rank = userRank;
      setStorageItem('user', merged);
    }

    if (isFirebaseConfigured && db && merged.id) {
      try {
        await setDoc(doc(db, 'users', merged.id), merged, { merge: true });
      } catch (e) {
        console.warn('Firestore updateUser failed:', e);
      }
    }

    return merged;
  }

  // Footprint Management
  async getFootprint() {
    return getStorageItem('footprint', initialFootprintBreakdown);
  }

  async saveFootprint(footprintData) {
    setStorageItem('footprint', footprintData);

    const currentUser = getStorageItem('user', initialUser);
    const updatedUser = {
      ...currentUser,
      currentFootprint: footprintData.total,
    };
    await this.updateUser(updatedUser);

    if (isFirebaseConfigured && db) {
      try {
        await addDoc(collection(db, 'footprints'), {
          userId: currentUser.id,
          ...footprintData,
          date: new Date().toISOString(),
        });
      } catch (e) {
        console.warn('Firestore saveFootprint fallback:', e);
      }
    }

    return footprintData;
  }

  // Circular Actions
  async getRecentActions() {
    return getStorageItem('actions', initialRecentActions);
  }

  async logAndVerifyAction({ type, title, carbonSaved, ecoPoints, facility, proofUrl }) {
    const newAction = {
      id: `act-${Date.now()}`,
      userId: 'user_carbonly_01',
      type,
      title,
      carbonSaved: Number(carbonSaved),
      ecoPoints: Number(ecoPoints),
      verified: true,
      proofUrl: proofUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=300',
      date: 'Just now',
      facility: facility || 'Local Certified Partner',
    };

    const actions = getStorageItem('actions', initialRecentActions);
    const updatedActions = [newAction, ...actions];
    setStorageItem('actions', updatedActions);

    // Update user points and carbon saved
    const user = getStorageItem('user', initialUser);
    const newPoints = user.ecoPoints + Number(ecoPoints);
    const newCarbonSaved = parseFloat((user.carbonSaved + Number(carbonSaved)).toFixed(1));
    await this.updateUser({
      ecoPoints: newPoints,
      carbonSaved: newCarbonSaved,
      monthlyReductionAchieved: parseFloat((user.monthlyReductionAchieved + Number(carbonSaved)).toFixed(1))
    });

    // Add to live impact feed
    const feed = getStorageItem('feed', initialImpactFeed);
    const newFeedItem = {
      id: `feed-${Date.now()}`,
      user: `You (${user.name})`,
      avatar: user.avatar,
      actionText: title,
      points: Number(ecoPoints),
      carbonSaved: Number(carbonSaved),
      time: 'Just now',
      likes: 1,
      comments: 0,
      type,
    };
    setStorageItem('feed', [newFeedItem, ...feed]);

    // Check streak or badge unlock
    this.checkBadges(newPoints, newCarbonSaved);

    if (isFirebaseConfigured && db) {
      try {
        await addDoc(collection(db, 'actions'), {
          ...newAction,
          timestamp: new Date().toISOString()
        });
      } catch (e) {
        console.warn('Firestore action log fallback:', e);
      }
    }

    return newAction;
  }

  // Badges logic
  checkBadges(points, carbonSaved) {
    const badges = getStorageItem('badges', initialBadges);
    let updated = false;

    const modifiedBadges = badges.map(b => {
      if (b.id === 'badge-2' && carbonSaved >= 10 && !b.unlocked) {
        updated = true;
        return { ...b, unlocked: true, unlockedAt: 'Just now' };
      }
      if (b.id === 'badge-5' && points >= 4000 && !b.unlocked) {
        updated = true;
        return { ...b, unlocked: true, unlockedAt: 'Just now' };
      }
      return b;
    });

    if (updated) {
      setStorageItem('badges', modifiedBadges);
    }
  }

  // Rewards & Wallet
  async getRewards() {
    return getStorageItem('rewards', initialRewards);
  }

  async getRedeemedRewards() {
    return getStorageItem('redeemedRewards', []);
  }

  async redeemReward(reward) {
    const user = getStorageItem('user', initialUser);
    if (user.ecoPoints < reward.points) {
      throw new Error(`Insufficient EcoPoints. You need ${reward.points} points, but have ${user.ecoPoints}.`);
    }

    // Deduct points
    const remainingPoints = user.ecoPoints - reward.points;
    await this.updateUser({ ecoPoints: remainingPoints });

    // Generate voucher code
    const voucherCode = `${reward.codeFormat.replace('XXXX', Math.random().toString(36).substring(2, 6).toUpperCase())}`;
    
    const redeemedItem = {
      id: `red-${Date.now()}`,
      rewardId: reward.id,
      title: reward.title,
      category: reward.category,
      pointsSpent: reward.points,
      code: voucherCode,
      redeemedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      partner: reward.partner
    };

    const currentRedeemed = getStorageItem('redeemedRewards', []);
    setStorageItem('redeemedRewards', [redeemedItem, ...currentRedeemed]);

    return { redeemedItem, remainingPoints };
  }

  // Marketplace & Products
  async getProducts() {
    return getStorageItem('products', initialProducts);
  }

  async addProduct(product) {
    const products = getStorageItem('products', initialProducts);
    const newProduct = {
      id: `prod-${Date.now()}`,
      merchantId: 'merch-custom',
      merchantName: product.merchantName || 'Eco Artisan Merchant',
      category: product.category || 'Sustainable Essentials',
      price: Number(product.price),
      originalPrice: Number(product.originalPrice || Math.round(product.price * 1.3)),
      ecoPoints: Number(product.ecoPoints || Math.round(product.price * 0.1)),
      image: product.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400',
      sustainability: product.sustainability || 'Sustainably sourced, low carbon circular design.',
      carbonOffsetEquivalent: `${(product.price * 0.015).toFixed(1)} kg CO₂e saved`,
      stock: Number(product.stock || 25),
      rating: 5.0,
      featured: false,
    };

    const updated = [newProduct, ...products];
    setStorageItem('products', updated);

    if (isFirebaseConfigured && db) {
      try {
        await addDoc(collection(db, 'products'), newProduct);
      } catch (e) {
        console.warn('Firestore addProduct fallback:', e);
      }
    }

    return newProduct;
  }

  // Locations
  async getLocations() {
    return getStorageItem('locations', initialLocations);
  }

  // Challenges
  async getChallenges() {
    return getStorageItem('challenges', initialChallenges);
  }

  async toggleJoinChallenge(challengeId) {
    const challenges = getStorageItem('challenges', initialChallenges);
    let targetJoined = false;
    const updated = challenges.map(c => {
      if (c.id === challengeId) {
        targetJoined = !c.joined;
        return {
          ...c,
          joined: targetJoined,
          participants: targetJoined ? c.participants + 1 : c.participants - 1
        };
      }
      return c;
    });
    setStorageItem('challenges', updated);
    return { challenges: updated, joined: targetJoined };
  }

  // Leaderboard
  async getLeaderboard() {
    return getStorageItem('leaderboard', initialLeaderboard);
  }

  // Community Feed
  async getFeed() {
    return getStorageItem('feed', initialImpactFeed);
  }

  async postToFeed(text, actionType = 'reuse') {
    const user = getStorageItem('user', initialUser);
    const feed = getStorageItem('feed', initialImpactFeed);
    const newPost = {
      id: `feed-${Date.now()}`,
      user: `You (${user.name})`,
      avatar: user.avatar,
      actionText: text,
      points: 25,
      carbonSaved: 3.5,
      time: 'Just now',
      likes: 1,
      comments: 0,
      type: actionType,
    };
    setStorageItem('feed', [newPost, ...feed]);

    // Give small bonus for community sharing
    await this.updateUser({
      ecoPoints: user.ecoPoints + 25,
      carbonSaved: parseFloat((user.carbonSaved + 3.5).toFixed(1))
    });

    return newPost;
  }

  // Badges
  async getBadges() {
    return getStorageItem('badges', initialBadges);
  }

  // Reset demo state
  resetAllDemoData() {
    localStorage.removeItem(STORAGE_PREFIX + 'user');
    localStorage.removeItem(STORAGE_PREFIX + 'footprint');
    localStorage.removeItem(STORAGE_PREFIX + 'actions');
    localStorage.removeItem(STORAGE_PREFIX + 'locations');
    localStorage.removeItem(STORAGE_PREFIX + 'products');
    localStorage.removeItem(STORAGE_PREFIX + 'rewards');
    localStorage.removeItem(STORAGE_PREFIX + 'badges');
    localStorage.removeItem(STORAGE_PREFIX + 'leaderboard');
    localStorage.removeItem(STORAGE_PREFIX + 'challenges');
    localStorage.removeItem(STORAGE_PREFIX + 'feed');
    localStorage.removeItem(STORAGE_PREFIX + 'redeemedRewards');
    this.initData();
  }
}

export const dataService = new DataService();
