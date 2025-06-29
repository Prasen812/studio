
'use client';
import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, LayoutGrid, Calendar, LogOut, Settings, LifeBuoy, ShieldCheck, MessageSquare, Users } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/context/auth-context';
import { AppProvider } from '@/context/app-context';

import { useIsMobile } from '@/hooks/use-mobile';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/tasks', label: 'Tasks', icon: LayoutGrid },
  { href: '/dashboard/attendance', label: 'Attendance', icon: Calendar },
  { href: '/dashboard/chat', label: 'Chat', icon: MessageSquare },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(isMobile ? false : true);
  const { user, isAdmin } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error: any) {
      toast({
        title: 'Logout Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (pathname.startsWith('/dashboard/call')) {
      return <AppProvider>{children}</AppProvider>;
  }

  if (!user) return null;

  return (
    <AppProvider>
      <SidebarProvider open={open} onOpenChange={setOpen}>
        <Sidebar>
          <SidebarHeader>
            <div className="flex h-10 items-center gap-2.5 px-2">
              <Logo className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">TaskFlow</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {isAdmin && (
                 <>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname.startsWith('/dashboard/admin')} tooltip="Admin Panel">
                        <Link href="/dashboard/admin">
                            <ShieldCheck />
                            <span>Admin Panel</span>
                        </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname.startsWith('/dashboard/users')} tooltip="Users">
                        <Link href="/dashboard/users">
                            <Users />
                            <span>Users</span>
                        </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Settings">
                  <Settings />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Support">
                      <LifeBuoy />
                      <span>Support</span>
                  </SidebarMenuButton>
              </SidebarMenuItem>
              <div className="mt-4 flex items-center gap-3 px-2 py-2 border-t">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.photoURL ?? "https://placehold.co/100x100"} alt={user?.displayName ?? 'User'} data-ai-hint="person avatar" />
                  <AvatarFallback>{user?.email?.charAt(0).toUpperCase() ?? 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-semibold truncate">{user?.displayName ?? user?.email}</span>
                  <span className="text-xs text-muted-foreground">{isAdmin ? 'Admin' : 'User'}</span>
                </div>
                <button onClick={handleLogout} className="ml-auto p-1.5 rounded-md hover:bg-muted">
                  <LogOut className="h-5 w-5 text-muted-foreground hover:text-foreground"/>
                </button>
              </div>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </AppProvider>
  );
}
