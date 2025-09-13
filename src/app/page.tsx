import Link from 'next/link';
import { Building, GraduationCap, Link as LinkIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-primary p-2 rounded-lg">
                <LinkIcon className="text-primary-foreground h-8 w-8" />
            </div>
            <h1 className="text-5xl font-headline font-bold text-primary">
                AlumniLink
            </h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          A centralized alumni management platform with AI-powered features for profile enrichment and mentor matching.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
            <div className="bg-accent p-3 rounded-full">
              <GraduationCap className="h-6 w-6 text-accent-foreground" />
            </div>
            <CardTitle className="font-headline text-2xl">Alumni Portal</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Access your profile, connect with peers, and discover exclusive opportunities.
            </p>
            <Button asChild className="w-full">
              <Link href="/login/alumni">Enter Alumni Portal</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
            <div className="bg-accent p-3 rounded-full">
              <Building className="h-6 w-6 text-accent-foreground" />
            </div>
            <CardTitle className="font-headline text-2xl">Admin Portal</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Manage alumni data, organize events, and view platform analytics.
            </p>
            <Button asChild className="w-full">
              <Link href="/login/admin">Enter Admin Portal</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
       <footer className="mt-12 text-center text-muted-foreground text-sm">
        <p>Built for the modern university. Powered by AI.</p>
      </footer>
    </main>
  );
}
