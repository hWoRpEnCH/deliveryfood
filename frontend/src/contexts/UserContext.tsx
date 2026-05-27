'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { Usuario } from '@/types';

interface UserContextType {
  user: Usuario | null;
  setUser: (user: Usuario | null) => void;
  userId: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);
const STORAGE_KEY = 'deliveryfood_user';

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<Usuario | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUserState(JSON.parse(stored) as Usuario);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const setUser = useCallback((next: Usuario | null) => {
    setUserState(next);
    if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    else localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, userId: user?._id ?? null }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
