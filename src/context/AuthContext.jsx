import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getAuthToken, setAuthToken } from '../services/api.js';

const AuthContext = createContext(null);
const SAVED_ACCOUNTS_KEY = 'genz_saved_accounts';

function loadSavedAccounts() {
  try {
    const raw = localStorage.getItem(SAVED_ACCOUNTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    return [
      {
        id: '00000000-0000-0000-0000-000000000003',
        email: 'genzfile@gmail.com',
        displayName: 'GenzFile',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        role: 'admin',
        lastActive: new Date().toISOString(),
      }
    ];
  } catch {
    return [];
  }
}

function persistSavedAccounts(list) {
  try {
    localStorage.setItem(SAVED_ACCOUNTS_KEY, JSON.stringify(list));
  } catch {}
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(getAuthToken());
  const [savedAccounts, setSavedAccounts] = useState(loadSavedAccounts());
  const [loading, setLoading] = useState(true);

  const saveAccountToDevice = (userRecord, userToken) => {
    if (!userRecord || !userRecord.email) return;
    setSavedAccounts(prev => {
      const filtered = prev.filter(a => a.email.toLowerCase() !== userRecord.email.toLowerCase());
      const updated = [
        {
          id: userRecord.id,
          email: userRecord.email,
          displayName: userRecord.displayName || userRecord.display_name,
          avatarUrl: userRecord.avatarUrl || userRecord.avatar_url,
          role: userRecord.role,
          token: userToken || (prev.find(a => a.email.toLowerCase() === userRecord.email.toLowerCase())?.token),
          lastActive: new Date().toISOString(),
        },
        ...filtered,
      ].slice(0, 6);
      persistSavedAccounts(updated);
      return updated;
    });
  };

  const removeSavedAccount = (email) => {
    setSavedAccounts(prev => {
      const updated = prev.filter(a => a.email.toLowerCase() !== email.toLowerCase());
      persistSavedAccounts(updated);
      return updated;
    });
  };

  const switchToAccount = async (account) => {
    if (!account) return;
    if (account.token) {
      setAuthToken(account.token);
      setTokenState(account.token);
      setUser({
        id: account.id,
        email: account.email,
        displayName: account.displayName,
        avatarUrl: account.avatarUrl,
        role: account.role || 'user',
      });
      fetchCurrentUser(account.token);
    } else {
      const res = await loginWithCredentials(account.email, 'genzfile123', true);
      return res;
    }
  };

  const fetchCurrentUser = async (currentToken) => {
    const activeToken = currentToken !== undefined ? currentToken : token;
    if (!activeToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await api.getMe();
      if (res.success && res.user) {
        setUser(res.user);
        // Automatically sync updated profile data with saved account entry
        saveAccountToDevice(res.user, activeToken);
      } else {
        setUser(null);
        setAuthToken(null);
        setTokenState(null);
      }
    } catch (err) {
      console.warn('Session verification failed:', err.message);
      setAuthToken(null);
      setTokenState(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser(token);
  }, [token]);

  const loginWithCredentials = async (email, password, remember = true) => {
    const res = await api.login(email, password);
    if (res.success && res.token) {
      setAuthToken(res.token);
      setTokenState(res.token);
      setUser(res.user);
      if (remember) {
        saveAccountToDevice(res.user, res.token);
      }
      return res;
    }
    throw new Error(res.error || 'Failed to sign in');
  };

  const registerWithCredentials = async (name, email, password, remember = true) => {
    const res = await api.register(name, email, password);
    if (res.success && res.token) {
      setAuthToken(res.token);
      setTokenState(res.token);
      setUser(res.user);
      if (remember) {
        saveAccountToDevice(res.user, res.token);
      }
      return res;
    }
    throw new Error(res.error || 'Failed to create account');
  };

  const loginWithSocial = async (provider, email = null, name = null, remember = true) => {
    const res = await api.socialLogin(provider, email, name);
    if (res.success && res.token) {
      setAuthToken(res.token);
      setTokenState(res.token);
      setUser(res.user);
      if (remember) {
        saveAccountToDevice(res.user, res.token);
      }
      return res;
    }
    throw new Error(res.error || `Failed to sign in with ${provider}`);
  };

  const login = (tokenOrEmail, password = null) => {
    if (password) {
      return loginWithCredentials(tokenOrEmail, password);
    }
    setAuthToken(tokenOrEmail);
    setTokenState(tokenOrEmail);
  };

  const logout = () => {
    setAuthToken(null);
    setTokenState(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        savedAccounts,
        saveAccountToDevice,
        removeSavedAccount,
        switchToAccount,
        login,
        loginWithCredentials,
        registerWithCredentials,
        loginWithSocial,
        logout,
        refreshUser: fetchCurrentUser,
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === 'admin',
        isModerator: user?.role === 'moderator' || user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
