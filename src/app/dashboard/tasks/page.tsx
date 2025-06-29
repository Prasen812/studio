'use client'
import { PlusCircle, ListFilter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/dashboard/header';
import { TaskCard } from '@/components/dashboard/task-card';
import { tasks as allTasks } from '@/lib/data';
import type { Task, TaskStatus } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const statuses: TaskStatus[] = ['Backlog', 'Todo', 'In Progress', 'Done', 'Canceled'];

export default function TasksPage() {
  const tasksByStatus = statuses.reduce(
    (acc, status) => {
      acc[status] = allTasks.filter((task) => task.status === status);
      return acc;
    },
    {} as Record<TaskStatus, Task[]>
  );

  return (
    <div className="flex flex-col h-full">
      <Header pageTitle="Tasks" />
      <main className="flex-1 flex flex-col gap-4 p-4 md:gap-8 md:p-6 overflow-auto">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>Priority</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Label</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" className="h-7 gap-1 bg-teal-500 hover:bg-teal-600 text-white">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Task</span>
            </Button>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 overflow-auto">
          {statuses.map((status) => (
            <div key={status} className="flex flex-col rounded-lg bg-muted/50 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">{status}</h3>
                <span className="text-sm font-semibold text-muted-foreground bg-background rounded-full px-2 py-1">
                  {tasksByStatus[status].length}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 -mr-2">
                {tasksByStatus[status].map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
