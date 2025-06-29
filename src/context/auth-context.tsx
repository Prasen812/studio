'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        // This is a simplified role check for prototyping purposes.
        // In a production application, you should use Firebase custom claims.
        setIsAdmin(user.email === 'admin@example.com');
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    const isAuthPage = pathname === '/login' || pathname === '/signup';

    if (!user && !isAuthPage) {
      router.push('/login');
    }

    if (user && isAuthPage) {
      router.push('/dashboard');
    }
  }, [user, loading, pathname, router]);

  if (loading) {
     return (
      <div className="flex flex-col h-screen">
        <header className="flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6 sticky top-0 z-30">
           <Skeleton className="h-8 w-32" />
            <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
               <Skeleton className="h-8 w-48 ml-auto" />
               <Skeleton className="h-8 w-8 rounded-full" />
            </div>
        </header>
        <div className="flex-1 flex gap-4 p-4 md:gap-8 md:p-6">
            <div className="w-64 hidden md:block">
                <Skeleton className="h-full w-full" />
            </div>
            <div className="flex-1">
                <Skeleton className="h-full w-full" />
            </div>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={{ user, isAdmin, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
