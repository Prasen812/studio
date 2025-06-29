
'use client';
import { Header } from '@/components/dashboard/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/auth-context';
import { useApp } from '@/context/app-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function UsersPage() {
    const { user: authUser, isAdmin, loading } = useAuth();
    const { users } = useApp();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAdmin) {
            router.push('/dashboard');
        }
    }, [isAdmin, loading, router]);

    const handleChat = (userId: string) => {
        router.push(`/dashboard/chat?userId=${userId}`);
    };

    if(loading || !isAdmin) {
        return (
            <div className="flex flex-col h-full items-center justify-center">
               <p>Verifying admin privileges...</p>
            </div>
        );
    }

  return (
    <div className="flex flex-col h-full">
      <Header pageTitle="User Management" />
      <main className="flex-1 flex flex-col gap-4 p-4 md:gap-8 md:p-6">
        <Card>
            <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>A list of all users in the system.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person avatar" />
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="text-right">
                           {user.email !== authUser?.email ? (
                             <Button variant="outline" size="sm" onClick={() => handleChat(user.id)}>Chat</Button>
                           ) : (
                             <Button variant="outline" size="sm" disabled>Chat</Button>
                           )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
