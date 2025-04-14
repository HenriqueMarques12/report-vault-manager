
import React, { createContext, useContext, useState, useEffect } from 'react';

// Tipos
export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  provider?: 'email' | 'microsoft';
}

export interface LogEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resourceId?: string;
  resourceName?: string;
  timestamp: Date;
}

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithMicrosoft: () => Promise<void>;
  logout: () => void;
  logs: LogEntry[];
  addLogEntry: (action: string, resourceId?: string, resourceName?: string) => void;
}

// Usuários de exemplo para demonstração
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Administrador',
    email: 'admin@exemplo.com.br',
    role: 'admin',
    provider: 'email'
  },
  {
    id: '2',
    name: 'Usuário Comum',
    email: 'usuario@exemplo.com.br',
    role: 'user',
    provider: 'email'
  },
  {
    id: '3',
    name: 'Usuário Microsoft',
    email: 'microsoft@outlook.com',
    role: 'user',
    provider: 'microsoft'
  }
];

// Logs de exemplo para demonstração
const initialLogs: LogEntry[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Administrador',
    action: 'Login no sistema',
    timestamp: new Date(Date.now() - 86400000)
  },
  {
    id: '2',
    userId: '1',
    userName: 'Administrador',
    action: 'Adição de relatório',
    resourceId: '5',
    resourceName: 'Relatório Financeiro Q1',
    timestamp: new Date(Date.now() - 72000000)
  },
  {
    id: '3',
    userId: '2',
    userName: 'Usuário Comum',
    action: 'Visualização de relatório',
    resourceId: '2',
    resourceName: 'Relatório de Vendas',
    timestamp: new Date(Date.now() - 43200000)
  }
];

// Criar contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  
  const isAuthenticated = !!currentUser;
  const isAdmin = currentUser?.role === 'admin';

  useEffect(() => {
    // Verificar usuário salvo no localStorage
    const savedUser = localStorage.getItem('reportVaultUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    
    // Verificar logs salvos no localStorage
    const savedLogs = localStorage.getItem('reportVaultLogs');
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    // Em uma aplicação real, isso seria uma chamada de API
    // Para fins de demonstração, usaremos dados simulados
    return new Promise((resolve, reject) => {
      // Simular atraso da API
      setTimeout(() => {
        const user = mockUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
        
        if (user) {
          // Em um app real, verificaríamos a senha aqui
          setCurrentUser(user);
          localStorage.setItem('reportVaultUser', JSON.stringify(user));
          
          const newLog: LogEntry = {
            id: `log_${Date.now()}`,
            userId: user.id,
            userName: user.name,
            action: 'Login no sistema',
            timestamp: new Date()
          };
          
          const updatedLogs = [...logs, newLog];
          setLogs(updatedLogs);
          localStorage.setItem('reportVaultLogs', JSON.stringify(updatedLogs));
          
          resolve();
        } else {
          reject(new Error('Email ou senha inválidos'));
        }
      }, 800);
    });
  };
  
  const loginWithMicrosoft = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Em uma aplicação real, isso redirecionaria para a página de autenticação da Microsoft
      // Para fins de demonstração, simulamos o login bem-sucedido com o usuário Microsoft
      setTimeout(() => {
        const microsoftUser = mockUsers.find(user => user.provider === 'microsoft');
        
        if (microsoftUser) {
          setCurrentUser(microsoftUser);
          localStorage.setItem('reportVaultUser', JSON.stringify(microsoftUser));
          
          const newLog: LogEntry = {
            id: `log_${Date.now()}`,
            userId: microsoftUser.id,
            userName: microsoftUser.name,
            action: 'Login via Microsoft',
            timestamp: new Date()
          };
          
          const updatedLogs = [...logs, newLog];
          setLogs(updatedLogs);
          localStorage.setItem('reportVaultLogs', JSON.stringify(updatedLogs));
          
          resolve();
        } else {
          reject(new Error('Falha ao autenticar com Microsoft'));
        }
      }, 800);
    });
  };

  const addLogEntry = (action: string, resourceId?: string, resourceName?: string) => {
    if (!currentUser) return;
    
    const newLog: LogEntry = {
      id: `log_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      action,
      resourceId,
      resourceName,
      timestamp: new Date()
    };
    
    const updatedLogs = [...logs, newLog];
    setLogs(updatedLogs);
    localStorage.setItem('reportVaultLogs', JSON.stringify(updatedLogs));
  };

  const logout = () => {
    if (currentUser) {
      addLogEntry('Logout do sistema');
      setCurrentUser(null);
      localStorage.removeItem('reportVaultUser');
    }
  };

  const value = {
    currentUser,
    isAuthenticated,
    isAdmin,
    login,
    loginWithMicrosoft,
    logout,
    logs,
    addLogEntry
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
