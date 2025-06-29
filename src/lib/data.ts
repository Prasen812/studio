import type { User, Task, AttendanceRecord, Conversation } from './types';
import { subDays, addDays, subMinutes } from 'date-fns';

export const initialUsers: User[] = [
  { id: 'user-1', name: 'Alex Johnson', email: 'alex@example.com', avatarUrl: 'https://placehold.co/100x100' },
  { id: 'user-2', name: 'Maria Garcia', email: 'maria@example.com', avatarUrl: 'https://placehold.co/100x100' },
  { id: 'user-3', name: 'James Smith', email: 'james@example.com', avatarUrl: 'https://placehold.co/100x100' },
  { id: 'user-4', name: 'Ravi Kumar', email: 'ravi@example.com', avatarUrl: 'https://placehold.co/100x100' },
  { id: 'user-admin', name: 'Admin', email: 'admin@example.com', avatarUrl: 'https://placehold.co/100x100' },
];

export const tasks: Task[] = [
  {
    id: 'TASK-1',
    title: 'Design the new landing page hero section',
    status: 'In Progress',
    label: 'UI',
    priority: 'High',
    dueDate: new Date().toISOString(),
    assignee: initialUsers[0],
  },
  {
    id: 'TASK-2',
    title: 'Fix authentication flow bug on mobile',
    status: 'Todo',
    label: 'Bugs',
    priority: 'High',
    dueDate: addDays(new Date(), 2).toISOString(),
    assignee: initialUsers[1],
  },
  {
    id: 'TASK-3',
    title: 'Write API documentation for the new endpoint',
    status: 'Backlog',
    label: 'Documentation',
    priority: 'Medium',
    dueDate: addDays(new Date(), 10).toISOString(),
    assignee: initialUsers[2],
  },
  {
    id: 'TASK-4',
    title: 'Implement feature for user profile editing',
    status: 'Todo',
    label: 'Features',
    priority: 'Medium',
    dueDate: addDays(new Date(), 5).toISOString(),
    assignee: initialUsers[0],
  },
  {
    id: 'TASK-5',
    title: 'Update button styles across the app',
    status: 'Done',
    label: 'UI',
    priority: 'Low',
    dueDate: subDays(new Date(), 2).toISOString(),
    assignee: initialUsers[3],
  },
    {
    id: 'TASK-6',
    title: 'Research performance bottlenecks in data processing',
    status: 'In Progress',
    label: 'Features',
    priority: 'High',
    dueDate: addDays(new Date(), 3).toISOString(),
    assignee: initialUsers[1],
  },
  {
    id: 'TASK-7',
    title: 'User feedback session on the new chat feature',
    status: 'Canceled',
    label: 'Features',
    priority: 'Low',
    dueDate: subDays(new Date(), 5).toISOString(),
    assignee: initialUsers[2],
  },
  {
    id: 'TASK-8',
    title: 'Refactor old database schemas',
    status: 'Backlog',
    label: 'Documentation',
    priority: 'Medium',
    dueDate: addDays(new Date(), 20).toISOString(),
    assignee: initialUsers[3],
  },
];

export const attendanceRecords: AttendanceRecord[] = [
  { date: new Date(), status: 'Present' },
  { date: subDays(new Date(), 1), status: 'Present' },
  { date: subDays(new Date(), 2), status: 'Absent' },
  { date: subDays(new Date(), 3), status: 'Present' },
  { date: subDays(new Date(), 4), status: 'Half-day' },
  { date: subDays(new Date(), 5), status: 'Holiday' },
  { date: subDays(new Date(), 8), status: 'Present' },
  { date: subDays(new Date(), 9), status: 'Present' },
];

export const conversations: Conversation[] = [
  {
    id: 'conv-admin-user1',
    participantIds: ['user-admin', 'user-1'],
    messages: [
      { id: 'msg-1', senderId: 'user-1', content: 'Hey, how is the new design coming along?', timestamp: subMinutes(new Date(), 5).toISOString() },
      { id: 'msg-2', senderId: 'user-admin', content: 'Almost done! Just tweaking the final details. I should be able to push it for review today.', timestamp: subMinutes(new Date(), 3).toISOString() },
      { id: 'msg-3', senderId: 'user-1', content: 'Awesome, looking forward to seeing it!', timestamp: subMinutes(new Date(), 1).toISOString() },
    ]
  },
  {
    id: 'conv-admin-user2',
    participantIds: ['user-admin', 'user-2'],
    messages: [
      { id: 'msg-4', senderId: 'user-admin', content: 'Hey Maria, just wanted to check in on the mobile auth bug.', timestamp: subMinutes(new Date(), 40).toISOString() },
      { id: 'msg-5', senderId: 'user-2', content: 'Hi! I\'m looking into it now. It seems to be an issue with the token refresh logic. I\'ll keep you updated.', timestamp: subMinutes(new Date(), 30).toISOString() },
    ]
  },
    {
    id: 'conv-user1-user3',
    participantIds: ['user-1', 'user-3'],
    messages: [
      { id: 'msg-6', senderId: 'user-3', content: 'Hey Alex, do you have a moment to review my PR for the API docs?', timestamp: subMinutes(new Date(), 60).toISOString() },
    ]
  }
];
