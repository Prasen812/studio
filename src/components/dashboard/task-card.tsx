
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Calendar, ChevronDown, Minus, ChevronUp } from 'lucide-react';
import type { Task } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const priorityIcons = {
  Low: <ChevronDown className="h-4 w-4 text-gray-500" />,
  Medium: <Minus className="h-4 w-4 text-yellow-500" />,
  High: <ChevronUp className="h-4 w-4 text-red-500" />,
};

const labelColors = {
  Bugs: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  Features: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  UI: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  Documentation: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
};


export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  return (
    <Card className="transform transition-all hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
        <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem onSelect={() => onEdit(task)}>Edit</DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onDelete(task)} className="text-destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex space-x-2 pb-3">
          <Badge variant="outline" className={cn('border', labelColors[task.label])}>
            {task.label}
          </Badge>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
                {priorityIcons[task.priority]}
                <span>{task.priority}</span>
            </div>
            <span className="text-gray-400 dark:text-gray-600">|</span>
             <div className="flex items-center">
                <Calendar className="mr-1.5 h-3.5 w-3.5" />
                <span>{format(parseISO(task.dueDate), 'MMM d')}</span>
            </div>
          </div>
          <Avatar className="h-6 w-6">
            <AvatarImage src={task.assignee.avatarUrl} alt={task.assignee.name} data-ai-hint="person avatar"/>
            <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      </CardContent>
    </Card>
  );
}
