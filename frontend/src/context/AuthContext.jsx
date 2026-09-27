import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USERS } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Default to PI for seamless initial landing / demo workflow
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('aiia_ctms_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_USERS[0]; // PI Dr. Anand Kumar Varma
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('aiia_ctms_auth') !== 'false';
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('aiia_ctms_user', JSON.stringify(currentUser));
      localStorage.setItem('aiia_ctms_auth', 'true');
    } else {
      localStorage.removeItem('aiia_ctms_user');
      localStorage.setItem('aiia_ctms_auth', 'false');
    }
  }, [currentUser]);

  const login = (email, password) => {
    const found = INITIAL_USERS.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (found && password === 'AIIA@123') {
      setCurrentUser(found);
      setIsAuthenticated(true);
      return { success: true, user: found };
    }
    // Also accept any valid demo email with default password
    if (found) {
      setCurrentUser(found);
      setIsAuthenticated(true);
      return { success: true, user: found };
    }
    return { success: false, error: 'Invalid credentials. Please use demo credentials provided.' };
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('aiia_ctms_user');
    localStorage.setItem('aiia_ctms_auth', 'false');
  };

  const switchRole = (roleKey) => {
    const user = INITIAL_USERS.find(u => u.role === roleKey);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
  };

  // Role permissions checking
  const canAccessModule = (moduleId) => {
    if (!currentUser) return false;
    const role = currentUser.role;

    // Admin has full access to all modules
    if (role === 'admin') return true;

    // Specific role matrices
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
        usersList: INITIAL_USERS
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
