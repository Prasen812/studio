import type { User, Task, AttendanceRecord, AttendanceStatus } from './types';
import { subDays, addDays } from 'date-fns';

export const users: User[] = [
  { name: 'Alex Johnson', email: 'alex@example.com', avatarUrl: 'https://placehold.co/100x100' },
  { name: 'Maria Garcia', email: 'maria@example.com', avatarUrl: 'https://placehold.co/100x100' },
  { name: 'James Smith', email: 'james@example.com', avatarUrl: 'https://placehold.co/100x100' },
  { name: 'Ravi Kumar', email: 'ravi@example.com', avatarUrl: 'https://placehold.co/100x100' },
];

export const tasks: Task[] = [
  {
    id: 'TASK-1',
    title: 'Design the new landing page hero section',
    status: 'In Progress',
    label: 'UI',
    priority: 'High',
    dueDate: new Date().toISOString(),
    assignee: users[0],
  },
  {
    id: 'TASK-2',
    title: 'Fix authentication flow bug on mobile',
    status: 'Todo',
    label: 'Bugs',
    priority: 'High',
    dueDate: addDays(new Date(), 2).toISOString(),
    assignee: users[1],
  },
  {
    id: 'TASK-3',
    title: 'Write API documentation for the new endpoint',
    status: 'Backlog',
    label: 'Documentation',
    priority: 'Medium',
    dueDate: addDays(new Date(), 10).toISOString(),
    assignee: users[2],
  },
  {
    id: 'TASK-4',
    title: 'Implement feature for user profile editing',
    status: 'Todo',
    label: 'Features',
    priority: 'Medium',
    dueDate: addDays(new Date(), 5).toISOString(),
    assignee: users[0],
  },
  {
    id: 'TASK-5',
    title: 'Update button styles across the app',
    status: 'Done',
    label: 'UI',
    priority: 'Low',
    dueDate: subDays(new Date(), 2).toISOString(),
    assignee: users[3],
  },
    {
    id: 'TASK-6',
    title: 'Research performance bottlenecks in data processing',
    status: 'In Progress',
    label: 'Features',
    priority: 'High',
    dueDate: addDays(new Date(), 3).toISOString(),
    assignee: users[1],
  },
  {
    id: 'TASK-7',
    title: 'User feedback session on the new chat feature',
    status: 'Canceled',
    label: 'Features',
    priority: 'Low',
    dueDate: subDays(new Date(), 5).toISOString(),
    assignee: users[2],
  },
  {
    id: 'TASK-8',
    title: 'Refactor old database schemas',
    status: 'Backlog',
    label: 'Documentation',
    priority: 'Medium',
    dueDate: addDays(new Date(), 20).toISOString(),
    assignee: users[3],
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
