import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isAuthority: boolean;
  isLoading: boolean;
  loginAuthority: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  demoLoginAuthority: () => Promise<void>;
}

const STORAGE_KEY = 'floodguard_authority_session';

const DEMO_AUTHORITY_USER: User = {
  uid: 'authority_officer_demo_001',
  name: 'Dr. Rajesh Rao',
  email: 'authority@floodguard.gov',
  role: 'authority',
  department: 'State Disaster Management Authority (SDMA)',
  badgeId: 'SDMA-EMERG-8492',
  jurisdiction: 'Bellary District Central Command',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Synchronize authentication state with Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const snap = await getDoc(userDocRef);

          if (snap.exists()) {
            const data = snap.data();
            if (data.role === 'authority') {
              const loadedUser: User = {
                uid: fbUser.uid,
                name: data.name || fbUser.displayName || 'Authority Officer',
                email: data.email || fbUser.email || '',
                role: 'authority',
                department: data.department || 'State Disaster Management Authority (SDMA)',
                badgeId: data.badgeId || 'SDMA-EMERG-8492',
                jurisdiction: data.jurisdiction || 'Bellary District Central Command',
              };
              setUser(loadedUser);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(loadedUser));
            } else {
              // Not an authority account
              setUser(null);
              localStorage.removeItem(STORAGE_KEY);
            }
          } else {
            // Check if known authority email
            const isAuthEmail =
              fbUser.email?.toLowerCase() === 'authority@floodguard.gov' ||
              fbUser.email?.toLowerCase() === 'authority@example.com' ||
              fbUser.email?.toLowerCase() === 'anusha.vadegeri@gmail.com';

            if (isAuthEmail) {
              const newAuthUser: User = {
                uid: fbUser.uid,
                name: 'Authority Officer',
                email: fbUser.email || '',
                role: 'authority',
                department: 'State Disaster Management Authority (SDMA)',
                badgeId: 'SDMA-EMERG-8492',
                jurisdiction: 'Bellary District Central Command',
              };
              await setDoc(userDocRef, {
                name: newAuthUser.name,
                email: newAuthUser.email,
                role: 'authority',
              });
              setUser(newAuthUser);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(newAuthUser));
            } else {
              setUser(null);
              localStorage.removeItem(STORAGE_KEY);
            }
          }
        } catch (err) {
          console.warn('Could not read user profile from Firestore:', err);
        }
      } else {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (!parsed.uid?.includes('demo')) {
              setUser(null);
              localStorage.removeItem(STORAGE_KEY);
            }
          } catch {
            setUser(null);
            localStorage.removeItem(STORAGE_KEY);
          }
        } else {
          setUser(null);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Helper to write/update authority user document in Firestore users/{uid}
   */
  const saveAuthorityToFirestore = async (u: User) => {
    try {
      const userRef = doc(db, 'users', u.uid);
      await setDoc(
        userRef,
        {
          name: u.name,
          email: u.email,
          role: 'authority',
        },
        { merge: true }
      );
    } catch (error) {
      console.warn('Firestore authority record write notice:', error);
    }
  };

  /**
   * AUTHORITY LOGIN:
   * Authenticates against Firebase Authentication and verifies role === "authority"
   */
  const loginAuthority = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    try {
      let authUser: User | null = null;

      try {
        const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
        const uid = cred.user.uid;

        const snap = await getDoc(doc(db, 'users', uid));
        if (snap.exists()) {
          const d = snap.data();
          if (d.role !== 'authority') {
            await signOut(auth);
            setIsLoading(false);
            return {
              success: false,
              error: 'Access Denied: Only users with the "authority" role can access the Authority Command Center.',
            };
          }
          authUser = {
            uid,
            name: d.name || 'Authority Officer',
            email: cleanEmail,
            role: 'authority',
            department: d.department || 'State Disaster Management Authority',
            badgeId: d.badgeId || 'SDMA-EMERG-8492',
            jurisdiction: d.jurisdiction || 'Bellary District Central Command',
          };
        } else {
          if (
            cleanEmail === 'authority@floodguard.gov' ||
            cleanEmail === 'authority@example.com' ||
            cleanEmail === 'anusha.vadegeri@gmail.com'
          ) {
            authUser = {
              uid,
              name: 'Dr. Rajesh Rao',
              email: cleanEmail,
              role: 'authority',
              department: 'State Disaster Management Authority (SDMA)',
              badgeId: 'SDMA-EMERG-8492',
              jurisdiction: 'Bellary District Central Command',
            };
            await saveAuthorityToFirestore(authUser);
          } else {
            await signOut(auth);
            setIsLoading(false);
            return {
              success: false,
              error: 'Access Denied: Authority record not found in database.',
            };
          }
        }
      } catch (authError: any) {
        // Fallback for pre-seeded test credentials if Email/Password provider isn't enabled
        if (cleanEmail === 'authority@floodguard.gov' || cleanEmail === 'authority@example.com') {
          if (password === 'authority123') {
            authUser = DEMO_AUTHORITY_USER;
            await saveAuthorityToFirestore(authUser);
          } else {
            setIsLoading(false);
            return { success: false, error: 'Invalid password for authority account.' };
          }
        } else {
          setIsLoading(false);
          return {
            success: false,
            error:
              authError.code === 'auth/invalid-credential' || authError.code === 'auth/user-not-found'
                ? 'Invalid authority credentials. Check email and password.'
                : authError.message || 'Authentication failed.',
          };
        }
      }

      if (!authUser || authUser.role !== 'authority') {
        setIsLoading(false);
        return {
          success: false,
          error: 'Access Denied: Authority role could not be verified.',
        };
      }

      setUser(authUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Login failed.' };
    }
  };

  /**
   * LOGOUT:
   * Signs out from Firebase Authentication and clears authority session
   */
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Firebase signOut notice:', e);
    }
    setUser(null);
    setFirebaseUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  /**
   * 1-Click Demo Login for Authority Officer
   */
  const demoLoginAuthority = async () => {
    setIsLoading(true);
    await saveAuthorityToFirestore(DEMO_AUTHORITY_USER);
    setUser(DEMO_AUTHORITY_USER);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_AUTHORITY_USER));
    setIsLoading(false);
  };

  const isAuthenticated = !!user;
  const isAuthority = user?.role === 'authority';

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isAuthenticated,
        isAuthority,
        loginAuthority,
        logout,
        demoLoginAuthority,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
