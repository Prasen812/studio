export type User = {
  name: string;
  avatarUrl: string;
  email: string;
};

export type TaskStatus = 'Backlog' | 'Todo' | 'In Progress' | 'Done' | 'Canceled';
export type TaskLabel = 'Documentation' | 'Bugs' | 'Features' | 'UI';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  label: TaskLabel;
  priority: TaskPriority;
  dueDate: string;
  assignee: User;
};

export type AttendanceStatus = 'Present' | 'Absent' | 'Half-day' | 'Holiday';

export type AttendanceRecord = {
  date: Date;
  status: AttendanceStatus;
};
