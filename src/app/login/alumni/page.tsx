import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link as LinkIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function AlumniLoginPage() {
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
            <CardTitle className="text-2xl font-headline">Alumni Portal</CardTitle>
            <CardDescription>Welcome back! Sign in to continue.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <Button asChild className="w-full" size="lg">
                <Link href="/alumni-dashboard">
                  <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.4 64.5c-24.3-23.6-57.5-38.6-96.5-38.6-79.5 0-144.2 64.7-144.2 144.2s64.7 144.2 144.2 144.2c86.3 0 120.3-61.9 125-92.8H248v-83.1h236.1c2.3 12.7 3.9 26.9 3.9 41.4z"></path></svg>
                  Sign in with Google
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
