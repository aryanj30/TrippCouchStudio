
import React, { createContext, useContext, useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import { auth, db } from '../firebase';
import { CartItem, UserProfile, AdCardData } from '../types';

interface AuthContextType {
  currentUser: firebase.User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  userFavorites: string[];
  cart: CartItem[];
  userProfile: UserProfile;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  toggleFavorite: (itemId: string) => Promise<void>;
  addToCart: (item: AdCardData) => Promise<void>;
  removeFromCart: (cartId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  checkout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<firebase.User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userFavorites, setUserFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({ name: '', phone: '', email: '' });
  const [loading, setLoading] = useState(true);

  // 1. Listen for Auth State Changes
  useEffect(() => {
    // Explicitly sign out on mount to satisfy "Logout on Refresh" requirement
    auth.signOut().then(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
          setCurrentUser(user);
          
          if (user) {
            // A. Check Admin Status
            try {
                const adminDoc = await db.collection('admins').doc(user.uid).get();
                setIsAdmin(adminDoc.exists);
            } catch (error) {
                console.error("Error verifying admin status", error);
                setIsAdmin(false);
            }

            // B. Fetch User Data
            try {
                const userRef = db.collection('users').doc(user.uid);
                const userSnap = await userRef.get();
                
                if (userSnap.exists) {
                  const data = userSnap.data();
                  setUserFavorites(data?.favorites || []);
                  setCart(data?.cart || []);
                  setUserProfile({
                     name: data?.name || '',
                     phone: data?.phone || '',
                     email: user.email || ''
                  });
                } else {
                  // Initialize new user profile
                  const newProfile = { name: '', phone: '', email: user.email, favorites: [], cart: [] };
                  await userRef.set(newProfile, { merge: true });
                  setUserProfile({ name: '', phone: '', email: user.email || '' });
                  setUserFavorites([]);
                  setCart([]);
                }
            } catch (e) {
                console.error("Error fetching user profile:", e);
            }
          } else {
            // Reset state on logout
            setIsAdmin(false);
            setUserFavorites([]);
            setCart([]);
            setUserProfile({ name: '', phone: '', email: '' });
          }
          setLoading(false);
        });

        return () => unsubscribe();
    });
  }, []);

  // 2. Auth Actions
  const login = async (email: string, pass: string) => {
    await auth.signInWithEmailAndPassword(email, pass);
  };

  const signup = async (email: string, pass: string, name?: string) => {
    const result = await auth.createUserWithEmailAndPassword(email, pass);
    
    // Create profile immediately upon registration
    if (result.user && name) {
        const profileData = {
            name: name,
            email: email,
            phone: '',
            favorites: [],
            cart: []
        };
        await db.collection('users').doc(result.user.uid).set(profileData, { merge: true });
        setUserProfile(prev => ({ ...prev, name, email }));
    }
  };

  const logout = async () => {
    await auth.signOut();
  };

  // 3. User Data Logic
  const toggleFavorite = async (itemId: string) => {
    if (!currentUser) return;
    const userRef = db.collection('users').doc(currentUser.uid);
    const isFavorite = userFavorites.includes(itemId);

    if (isFavorite) {
      setUserFavorites(prev => prev.filter(id => id !== itemId));
      await userRef.update({
        favorites: firebase.firestore.FieldValue.arrayRemove(itemId)
      });
    } else {
      setUserFavorites(prev => [...prev, itemId]);
      await userRef.update({
        favorites: firebase.firestore.FieldValue.arrayUnion(itemId)
      });
    }
  };

  // 4. Cart Logic
  const addToCart = async (item: AdCardData) => {
    if (!currentUser) throw new Error("Must be logged in");
    const newItem: CartItem = {
        ...item,
        cartId: Date.now().toString(),
        dateAdded: Date.now()
    };
    
    const newCart = [...cart, newItem];
    setCart(newCart);
    
    await db.collection('users').doc(currentUser.uid).update({
        cart: newCart
    });
  };

  const removeFromCart = async (cartId: string) => {
      if (!currentUser) return;
      const newCart = cart.filter(item => item.cartId !== cartId);
      setCart(newCart);
      await db.collection('users').doc(currentUser.uid).update({
          cart: newCart
      });
  };

  const clearCart = async () => {
      if (!currentUser) return;
      setCart([]);
      await db.collection('users').doc(currentUser.uid).update({ cart: [] });
  };

  const checkout = async () => {
      if (!currentUser || cart.length === 0) return;
      
      const orderData = {
          userId: currentUser.uid,
          items: cart,
          status: 'Pending',
          totalAmount: 'Calculating...', 
          dateOrdered: firebase.firestore.FieldValue.serverTimestamp(),
          userName: userProfile.name || currentUser.email,
          userEmail: currentUser.email
      };

      await db.collection('orders').add(orderData);
      await clearCart();
  };

  // 5. Profile Logic
  const updateUserProfile = async (data: Partial<UserProfile>) => {
      if (!currentUser) return;
      setUserProfile(prev => ({ ...prev, ...data }));
      await db.collection('users').doc(currentUser.uid).update(data);
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    isAdmin,
    userFavorites,
    cart,
    userProfile,
    login,
    signup,
    logout,
    toggleFavorite,
    addToCart,
    removeFromCart,
    clearCart,
    checkout,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
