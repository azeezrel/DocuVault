import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatarInitials: string;
  twoFactorEnabled: boolean;
  joinedDate: string;
  storageUsedMb: number;
  storageQuotaMb: number;
}

export type AuthScreen =
  | 'welcome'
  | 'signin'
  | 'signup'
  | 'admin-signin'
  | 'forgot-password'
  | 'verify-email'
  | 'mfa';

interface AuthContextType {
  isCheckingSession: boolean;
  sessionStatusMessage: string;
  isAuthenticated: boolean;
  currentUser: UserProfile | null;
  authScreen: AuthScreen;
  setAuthScreen: (screen: AuthScreen) => void;
  signIn: (email: string, pass: string, requireMfa?: boolean, explicitRole?: 'admin' | 'user') => boolean;
  signUp: (name: string, email: string, pass?: string, explicitRole?: 'admin' | 'user') => boolean;
  signOut: () => void;
  verify2FA: (code: string) => boolean;
  verifyEmailCode: (code?: string) => boolean;
  requestPasswordReset: (email: string) => boolean;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setUserRole: (role: 'admin' | 'user') => void;
  toggleUserRole: () => void;
  triggerSessionCheck: () => void;
}

const AUTH_STORAGE_KEY = 'lifevault_auth_prod_v1';
const USERS_REGISTRY_KEY = 'lifevault_registered_users_prod_v1';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCheckingSession, setIsCheckingSession] = useState<boolean>(true);
  const [sessionStatusMessage, setSessionStatusMessage] = useState<string>('Verifying vault credentials...');

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved).isAuthenticated : false;
    } catch {
      return false;
    }
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved).currentUser : null;
    } catch {
      return null;
    }
  });

  const [authScreen, setAuthScreen] = useState<AuthScreen>('welcome');
  const [pendingEmail, setPendingEmail] = useState<string>('');

  // Initial application splash check
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const saved = localStorage.getItem(AUTH_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.isAuthenticated && parsed.currentUser) {
            setIsAuthenticated(true);
            setCurrentUser(parsed.currentUser);
            setIsCheckingSession(false);
            return;
          }
        }
      } catch (err) {
        console.error('Error verifying storage session', err);
      }

      setIsAuthenticated(false);
      setAuthScreen('welcome');
      setIsCheckingSession(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Sync to local storage
  useEffect(() => {
    if (!isCheckingSession) {
      try {
        localStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({ isAuthenticated, currentUser })
        );
      } catch (e) {
        console.error('Failed to sync auth state', e);
      }
    }
  }, [isAuthenticated, currentUser, isCheckingSession]);

  const triggerSessionCheck = () => {
    setIsCheckingSession(true);
    setSessionStatusMessage('Re-checking session...');
    setTimeout(() => {
      setIsCheckingSession(false);
    }, 800);
  };

  const getRegisteredUsers = (): Record<string, UserProfile> => {
    try {
      const saved = localStorage.getItem(USERS_REGISTRY_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  };

  const saveUserToRegistry = (user: UserProfile) => {
    try {
      const users = getRegisteredUsers();
      users[user.email.toLowerCase()] = user;
      localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Failed saving user to registry', e);
    }
  };

  const signIn = (
    email: string,
    _pass: string,
    requireMfa: boolean = false,
    explicitRole?: 'admin' | 'user'
  ) => {
    const emailClean = email.trim().toLowerCase();
    setPendingEmail(emailClean);

    if (requireMfa) {
      setAuthScreen('mfa');
      return true;
    }

    const users = getRegisteredUsers();
    let profile = users[emailClean];

    const targetRole: 'admin' | 'user' =
      explicitRole || (emailClean.includes('admin') ? 'admin' : profile?.role || 'user');

    if (!profile) {
      const nameDerived =
        emailClean.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) ||
        (targetRole === 'admin' ? 'Platform Administrator' : 'Vault Owner');
      const initials =
        nameDerived
          .split(' ')
          .map((n) => n[0])
          .filter(Boolean)
          .join('')
          .toUpperCase()
          .slice(0, 2) || (targetRole === 'admin' ? 'AD' : 'VO');

      profile = {
        id: 'usr-' + Date.now(),
        name: nameDerived,
        email: emailClean,
        role: targetRole,
        avatarInitials: initials,
        twoFactorEnabled: false,
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        storageUsedMb: 0,
        storageQuotaMb: targetRole === 'admin' ? 51200 : 15360,
      };
      saveUserToRegistry(profile);
    } else if (explicitRole && profile.role !== explicitRole) {
      profile = {
        ...profile,
        role: explicitRole,
        storageQuotaMb: explicitRole === 'admin' ? 51200 : profile.storageQuotaMb,
      };
      saveUserToRegistry(profile);
    }

    setCurrentUser(profile);
    setIsAuthenticated(true);
    return true;
  };

  const signUp = (name: string, email: string, _password?: string, explicitRole?: 'admin' | 'user') => {
    const nameClean = name.trim();
    const emailClean = email.trim().toLowerCase();
    setPendingEmail(emailClean);

    const isAdmin = explicitRole === 'admin' || emailClean.includes('admin');

    const initials =
      nameClean
        .split(' ')
        .map((n) => n[0])
        .filter(Boolean)
        .join('')
        .toUpperCase()
        .slice(0, 2) || (isAdmin ? 'AD' : 'VO');

    const newUser: UserProfile = {
      id: 'usr-' + Date.now(),
      name: nameClean,
      email: emailClean,
      role: isAdmin ? 'admin' : 'user',
      avatarInitials: initials,
      twoFactorEnabled: false,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      storageUsedMb: 0,
      storageQuotaMb: isAdmin ? 51200 : 15360,
    };

    saveUserToRegistry(newUser);
    setCurrentUser(newUser);
    // Direct authentication without OTP or verification codes
    setIsAuthenticated(true);
    return true;
  };

  const verify2FA = (code: string) => {
    if (code.trim().length >= 4) {
      if (!currentUser && pendingEmail) {
        signIn(pendingEmail, '', false);
      } else {
        setIsAuthenticated(true);
      }
      return true;
    }
    return false;
  };

  const verifyEmailCode = (_code?: string) => {
    setIsAuthenticated(true);
    return true;
  };

  const requestPasswordReset = (_email: string) => {
    return true;
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    if (updates.name) {
      updated.avatarInitials =
        updates.name
          .split(' ')
          .map((n) => n[0])
          .filter(Boolean)
          .join('')
          .toUpperCase()
          .slice(0, 2) || 'VO';
    }
    setCurrentUser(updated);
    saveUserToRegistry(updated);
  };

  const setUserRole = (role: 'admin' | 'user') => {
    if (!currentUser) return;
    updateProfile({ role });
  };

  const toggleUserRole = () => {
    if (!currentUser) return;
    const newRole = currentUser.role === 'admin' ? 'user' : 'admin';
    updateProfile({ role: newRole });
  };

  const signOut = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setAuthScreen('welcome');
  };

  return (
    <AuthContext.Provider
      value={{
        isCheckingSession,
        sessionStatusMessage,
        isAuthenticated,
        currentUser,
        authScreen,
        setAuthScreen,
        signIn,
        signUp,
        signOut,
        verify2FA,
        verifyEmailCode,
        requestPasswordReset,
        updateProfile,
        setUserRole,
        toggleUserRole,
        triggerSessionCheck,
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
