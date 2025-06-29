'use client';

import type { User } from '@/lib/types';
import { createContext, useContext, useState, ReactNode } from 'react';
import { initialUsers } from '@/lib/data';

type UserContextType = {
  users: User[];
  addUser: (user: Omit<User, 'avatarUrl'>) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>(initialUsers);

  const addUser = (user: Omit<User, 'avatarUrl'>) => {
    const newUser: User = {
      ...user,
      avatarUrl: 'https://placehold.co/100x100', // Assign a default avatar
    };
    setUsers((prevUsers) => [...prevUsers, newUser]);
  };

  return (
    <UserContext.Provider value={{ users, addUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};
