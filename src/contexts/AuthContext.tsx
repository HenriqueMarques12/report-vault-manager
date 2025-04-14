
import React, { createContext, useContext, useState, useEffect } from 'react';

// Types
export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
  },
  {
    id: '2',
    name: 'Regular User',
    email: 'user@example.com',
    role: 'user',
  }
];

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const isAuthenticated = !!currentUser;
  const isAdmin = currentUser?.role === 'admin';

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('reportVaultUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    // In a real application, this would be an API call
    // For demo purposes, we'll use mock data
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        const user = mockUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
        
        if (user) {
          // In a real app, we'd check the password here
          setCurrentUser(user);
          localStorage.setItem('reportVaultUser', JSON.stringify(user));
          resolve();
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 800);
    });
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('reportVaultUser');
  };

  const value = {
    currentUser,
    isAuthenticated,
    isAdmin,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
