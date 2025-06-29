'use client';
import { Header } from '@/components/dashboard/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function AdminPage() {
    const { isAdmin, loading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);


    useEffect(() => {
        if (!loading && !isAdmin) {
            router.push('/dashboard');
        }
    }, [isAdmin, loading, router]);

    const handleCreateUser = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        // In a real app, you would call an API to create the user.
        // For this prototype, we'll just simulate it.
        console.log('Creating user:', { name, email, password });
        setTimeout(() => {
            toast({
                title: 'User Created',
                description: `User ${name} has been created successfully.`,
            });
            setName('');
            setEmail('');
            setPassword('');
            setIsSubmitting(false);
        }, 1000);
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
      <Header pageTitle="Admin Panel" />
      <main className="flex-1 flex flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Welcome, Admin!</CardTitle>
                    <CardDescription>This is the admin panel. You have special privileges to manage the application.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>From here, you can manage application settings, monitor activity, and create new users.</p>
                </CardContent>
            </Card>
            <Card>
                <form onSubmit={handleCreateUser}>
                    <CardHeader>
                        <CardTitle>Create New User</CardTitle>
                        <CardDescription>Add a new user to the system.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="user@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isSubmitting} className="ml-auto">
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create User
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
      </main>
    </div>
  );
}
