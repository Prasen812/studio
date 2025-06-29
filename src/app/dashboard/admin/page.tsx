'use client';
import { Header } from '@/components/dashboard/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUsers } from '@/context/user-context';
import { useToast } from '@/hooks/use-toast';

function CreateUserForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { addUser } = useUsers();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!name || !email) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }

    // In a real app, you'd call a server action to create the user in Firebase Auth.
    // For this prototype, we'll just add them to the local state.
    addUser({ name, email });

    toast({
      title: 'User Created',
      description: `${name} has been added to the user list.`,
    });

    // Reset form
    setName('');
    setEmail('');
  };

  return (
    <Card>
        <CardHeader>
            <CardTitle>Create New User</CardTitle>
            <CardDescription>Add a new user to the platform. They will be assigned a default password and role.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john.doe@example.com" />
                </div>
            </CardContent>
            <CardFooter>
                 <Button type="submit" className="ml-auto">Create User</Button>
            </CardFooter>
        </form>
    </Card>
  )
}


export default function AdminPage() {
    const { isAdmin, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAdmin) {
            router.push('/dashboard');
        }
    }, [isAdmin, loading, router]);


    if(loading || !isAdmin) {
        return (
            <div className="flex flex-col h-full items-center justify-center">
               <p>Verifying admin privileges...</p>
            </div>
        );
    }

  return (
    <div className="flex flex-col h-full">
      <Header pageTitle="Admin Panel" />
      <main className="flex-1 flex flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Welcome, Admin!</CardTitle>
                    <CardDescription>This is the admin panel. You have special privileges to manage the application.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>From here, you can manage users and other system settings.</p>
                </CardContent>
            </Card>
            <CreateUserForm />
        </div>
      </main>
    </div>
  );
}
