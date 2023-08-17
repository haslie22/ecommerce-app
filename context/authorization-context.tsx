'use client';

import { createContext, useState, useEffect } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  userId: string | null;
  saveLogInState: (id: string) => void;
  removeLogInState: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  userId: null,
  saveLogInState: () => {
    throw new Error('saveLogInState function must be overridden');
  },
  removeLogInState: () => {
    throw new Error('removeLogInState function must be overridden');
  },
});

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  let storedUserId = null;

  if (typeof window !== 'undefined') {
    storedUserId = localStorage.getItem('userId');
  }
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!storedUserId);
  const [userId, setUserId] = useState<string | null>(storedUserId);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setIsLoggedIn(true);
      setUserId(storedUserId);
    }
  }, []);

  const saveLogInState = (id: string) => {
    localStorage.setItem('userId', id);
    setIsLoggedIn(true);
    setUserId(id);
  };

  const removeLogInState = () => {
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userId, saveLogInState, removeLogInState }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
