'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link as LinkIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you'd handle authentication here.
        // For the demo, we'll just redirect.
        router.push('/admin-dashboard');
    }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background">
      <Image
        src="https://picsum.photos/seed/301/1920/1080"
        alt="University campus"
        fill
        className="object-cover opacity-20"
        data-ai-hint="university campus"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background" />
      <div className="relative z-10 flex flex-col items-center">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="bg-primary p-2 rounded-lg">
            <LinkIcon className="text-primary-foreground h-6 w-6" />
          </div>
          <h1 className="text-3xl font-headline font-bold text-primary">
            AlumniLink
          </h1>
        </Link>
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">Admin Portal</CardTitle>
            <CardDescription>Sign in to manage the platform.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input type="email" id="email" placeholder="admin@example.com" defaultValue="admin@alumnilink.com" required />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="password">Password</Label>
                <Input type="password" id="password" placeholder="••••••••" defaultValue="password" required />
              </div>
              <Button type="submit" className="w-full" size="lg">
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
