
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { initialUsers } from '@/lib/data';
import type { User } from '@/lib/types';

type UserContextType = {
  users: User[];
  addUser: (user: Pick<User, 'name' | 'email'>) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>(initialUsers);

  const addUser = (newUser: Pick<User, 'name' | 'email'>) => {
    const user: User = {
      id: `user-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      avatarUrl: 'https://placehold.co/100x100',
    };
    setUsers((prevUsers) => [...prevUsers, user]);
  };

  return (
    <UserContext.Provider value={{ users, addUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
