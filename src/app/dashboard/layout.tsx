'use client';
import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Calendar, Sparkles, LogOut, Settings, LifeBuoy } from 'lucide-react';

import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
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

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/tasks', label: 'Tasks', icon: LayoutGrid },
  { href: '/dashboard/attendance', label: 'Attendance', icon: Calendar },
  { href: '/dashboard/ai-summarizer', label: 'AI Summarizer', icon: Sparkles },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(isMobile ? false : true);

  return (
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
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton isActive={pathname === item.href} tooltip={item.label}>
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
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
                <AvatarImage src="https://placehold.co/100x100" alt="Alex Johnson" data-ai-hint="person avatar" />
                <AvatarFallback>AJ</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold">Alex Johnson</span>
                <span className="text-xs text-muted-foreground">alex@example.com</span>
              </div>
              <Link href="/login" className="ml-auto">
                <LogOut className="h-5 w-5 text-muted-foreground hover:text-foreground"/>
              </Link>
            </div>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
