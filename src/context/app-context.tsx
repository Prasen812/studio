
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { initialUsers, conversations as initialConversations, tasks as initialTasks } from '@/lib/data';
import type { User, Conversation, ChatMessage, Task } from '@/lib/types';

type AppContextType = {
  users: User[];
  conversations: Conversation[];
  tasks: Task[];
  addUser: (user: Pick<User, 'name' | 'email'>) => void;
  sendMessage: (conversationId: string, senderId: string, content: string) => void;
  createConversation: (participantIds: string[]) => Conversation;
  addTask: (task: Omit<Task, 'id' | 'assignee'> & { assigneeId: string }) => void;
  updateTask: (taskId: string, task: Omit<Task, 'id' | 'assignee'> & { assigneeId: string }) => void;
  deleteTask: (taskId: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

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

  const addTask = (data: Omit<Task, 'id' | 'assignee'> & { assigneeId: string }) => {
    const assignee = users.find(u => u.id === data.assigneeId);
    if (!assignee) {
      console.error('Assignee not found');
      return;
    }

    const newTask: Task = {
      id: `TASK-${Date.now()}`,
      ...data,
      assignee,
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
  };

  const updateTask = (taskId: string, data: Omit<Task, 'id' | 'assignee'> & { assigneeId: string }) => {
    const assignee = users.find(u => u.id === data.assigneeId);
    if (!assignee) {
      console.error('Assignee not found');
      return;
    }
    
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, ...data, assignee }
          : task
      )
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };


  return (
    <AppContext.Provider value={{ users, conversations, tasks, addUser, sendMessage, createConversation, addTask, updateTask, deleteTask }}>
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
