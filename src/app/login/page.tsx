import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/icons/logo';

export default function LoginPage() {
  return (
    <div className="flex min-h-full items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="mx-auto h-10 w-10 text-primary">
              <Logo />
            </div>
            <CardTitle className="mt-4 text-3xl font-bold tracking-tight">TaskFlow</CardTitle>
            <CardDescription>Sign in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input id="email" name="email" type="email" autoComplete="email" required />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <div className="text-sm">
                    <Link href="#" className="font-medium text-primary hover:text-primary/90">
                      Forgot your password?
                    </Link>
                  </div>
                </div>
                <Input id="password" name="password" type="password" autoComplete="current-password" required />
              </div>

              <div>
                <Link href="/dashboard/tasks">
                  <Button type="submit" className="w-full">
                    Sign in
                  </Button>
                </Link>
              </div>
            </form>
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 text-center text-sm">
                No account?{' '}
                <Link href="#" className="font-medium text-primary hover:text-primary/90">
                  Sign up
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
