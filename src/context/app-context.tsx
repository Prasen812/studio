
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { initialUsers, conversations as initialConversations } from '@/lib/data';
import type { User, Conversation, ChatMessage } from '@/lib/types';

type AppContextType = {
  users: User[];
  conversations: Conversation[];
  addUser: (user: Pick<User, 'name' | 'email'>) => void;
  sendMessage: (conversationId: string, senderId: string, content: string) => void;
  createConversation: (participantIds: string[]) => Conversation;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);

  const addUser = (newUser: Pick<User, 'name' | 'email'>) => {
    const user: User = {
      id: `user-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      avatarUrl: 'https://placehold.co/100x100',
    };
    setUsers((prevUsers) => [...prevUsers, user]);
  };

  const createConversation = (participantIds: string[]) => {
      const newConversation: Conversation = {
        id: `conv-${Date.now()}`,
        participantIds,
        messages: [],
      };
      setConversations(prev => [...prev, newConversation]);
      return newConversation;
  };

  const sendMessage = (conversationId: string, senderId: string, content: string) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: senderId,
      content: content,
      timestamp: new Date().toISOString(),
    };
    
    setConversations(prev =>
      prev.map(c =>
        c.id === conversationId
          ? { ...c, messages: [...c.messages, newMessage] }
          : c
      )
    );
  };


  return (
    <AppContext.Provider value={{ users, conversations, addUser, sendMessage, createConversation }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
