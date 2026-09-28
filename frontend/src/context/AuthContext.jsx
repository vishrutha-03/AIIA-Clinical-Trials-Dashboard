import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USERS } from '../data/mockData';

const API_BASE = 'http://localhost:8001';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('aiia_ctms_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('aiia_ctms_token') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('aiia_ctms_token');
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('aiia_ctms_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('aiia_ctms_user');
    }
    if (token) {
      localStorage.setItem('aiia_ctms_token', token);
      localStorage.setItem('aiia_ctms_auth', 'true');
    } else {
      localStorage.removeItem('aiia_ctms_token');
      localStorage.setItem('aiia_ctms_auth', 'false');
    }
  }, [currentUser, token]);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      if (!response.ok) {
        return { success: false, error: result.detail || 'Invalid credentials. Please use a valid demo user.' };
      }

      const user = result.user || {};
      const normalizedUser = {
        ...user,
        role: user.role || user.role_label || 'pi',
        roleLabel: user.roleLabel || user.role_label || 'Principal Investigator',
        avatar: user.avatar || (user.name || 'A').split(' ')[0].slice(0, 2).toUpperCase(),
      };
      setCurrentUser(normalizedUser);
      setToken(result.access_token || '');
      setIsAuthenticated(true);
      return { success: true, user: normalizedUser };
    } catch (error) {
      const fallbackUser = INITIAL_USERS.find((u) => u.email.toLowerCase() === String(email).trim().toLowerCase());
      if (fallbackUser && password === 'AIIA@123') {
        setCurrentUser(fallbackUser);
        setToken('offline-demo-token');
        setIsAuthenticated(true);
        return { success: true, user: fallbackUser };
      }
      return { success: false, error: 'Unable to connect to the CTMS backend. Please verify the API is running.' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setToken('');
    setIsAuthenticated(false);
    localStorage.removeItem('aiia_ctms_user');
    localStorage.removeItem('aiia_ctms_token');
    localStorage.setItem('aiia_ctms_auth', 'false');
  };

  const switchRole = (roleKey) => {
    const user = INITIAL_USERS.find((u) => u.role === roleKey);
    if (user) {
      setCurrentUser(user);
      setToken('offline-demo-token');
      setIsAuthenticated(true);
    }
  };

  const canAccessModule = (moduleId) => {
    if (!currentUser) return false;
    const role = currentUser.role;
    if (role === 'admin') return true;

    switch (moduleId) {
      case 'dashboard':
        return true;
      case 'trials':
        return true;
      case 'participants':
        return ['pi', 'coordinator', 'admin'].includes(role);
      case 'sites':
        return ['pi', 'monitor', 'admin', 'coordinator', 'regulator'].includes(role);
      case 'milestones':
        return ['pi', 'coordinator', 'ethics', 'admin', 'regulator'].includes(role);
      case 'pv':
        return ['pv', 'pi', 'ethics', 'admin', 'regulator'].includes(role);
      case 'regulatory':
        return ['ethics', 'pi', 'admin', 'regulator'].includes(role);
      case 'dataQuality':
        return ['coordinator', 'monitor', 'pi', 'admin'].includes(role);
      case 'riskAlerts':
        return true;
      case 'reports':
        return true;
      case 'auditTrail':
        return ['admin', 'regulator', 'ethics', 'pi'].includes(role);
      case 'interoperability':
        return true;
      case 'security':
        return true;
      case 'users':
        return ['admin'].includes(role);
      case 'settings':
        return true;
      default:
        return true;
    }
  };

  const isReadOnly = currentUser?.role === 'regulator';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        login,
        logout,
        switchRole,
        canAccessModule,
        isReadOnly,
        usersList: INITIAL_USERS,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
