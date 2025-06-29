'use client';
import { Header } from '@/components/dashboard/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

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
                    <p>From here, you can manage application settings and monitor activity.</p>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
