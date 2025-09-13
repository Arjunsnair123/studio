
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Mail, Linkedin, Briefcase, GraduationCap, Sparkles, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { alumniData as initialAlumniData } from '@/lib/data';
import type { Alumni } from '@/lib/types';
import { AlumniForm } from '@/components/app/alumni-form';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const ALUMNI_STORAGE_KEY = 'alumni-data';
const LOGGED_IN_USER_ID_KEY = 'alumni-user-id';

export default function AlumniProfilePage() {
  const [alumni, setAlumni] = useState<Alumni | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
        const storedAlumni = localStorage.getItem(ALUMNI_STORAGE_KEY);
        const loggedInId = localStorage.getItem(LOGGED_IN_USER_ID_KEY);
        
        let alumniList: Alumni[] = initialAlumniData;
        if (storedAlumni) {
            alumniList = JSON.parse(storedAlumni);
        } else {
            localStorage.setItem(ALUMNI_STORAGE_KEY, JSON.stringify(initialAlumniData));
        }

        let currentUser: Alumni | undefined;
        if (loggedInId) {
            currentUser = alumniList.find(a => a.id === loggedInId);
        }

        // Fallback to the first user if no logged-in user is found
        if (!currentUser) {
            currentUser = alumniList.length > 0 ? alumniList[0] : undefined;
            if(currentUser) {
              localStorage.setItem(LOGGED_IN_USER_ID_KEY, currentUser.id);
            }
        }
        
        setAlumni(currentUser || null);

    } catch (error) {
        console.error("Failed to load profile data", error);
        setAlumni(initialAlumniData[0] || null);
    }
  }, []);

  const handleSaveProfile = (savedAlumni: Alumni) => {
    setAlumni(savedAlumni);
    // Also update the master list in localStorage
    try {
        const storedAlumni = localStorage.getItem(ALUMNI_STORAGE_KEY);
        let alumniList: Alumni[] = storedAlumni ? JSON.parse(storedAlumni) : [];
        const userIndex = alumniList.findIndex(a => a.id === savedAlumni.id);
        if (userIndex > -1) {
            alumniList[userIndex] = savedAlumni;
        } else {
            alumniList.push(savedAlumni);
        }
        localStorage.setItem(ALUMNI_STORAGE_KEY, JSON.stringify(alumniList));
    } catch (error) {
        console.error("Failed to save profile to master list", error);
    }

    setIsDialogOpen(false);
    toast({ title: 'Profile Updated', description: "Your profile has been successfully updated."});
  };

  if (!alumni) {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-2">
                 <Skeleton className="h-9 w-48" />
                 <Skeleton className="h-10 w-32" />
            </div>
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-start gap-6">
                        <Skeleton className="h-[150px] w-[150px] rounded-full" />
                        <div className="flex-grow space-y-4">
                            <Skeleton className="h-9 w-1/2" />
                            <Skeleton className="h-6 w-1/3" />
                             <div className="mt-4 flex flex-wrap gap-4">
                                <Skeleton className="h-5 w-24" />
                                <Skeleton className="h-5 w-40" />
                                <Skeleton className="h-5 w-32" />
                             </div>
                        </div>
                    </div>
                     <div className="mt-6 border-t pt-6 space-y-2">
                        <Skeleton className="h-6 w-40 mb-2" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-2">
            <h2 className="text-3xl font-headline font-bold">My Profile</h2>
            <Button onClick={() => setIsDialogOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex-shrink-0">
                <Image
                  src={alumni.avatarUrl}
                  alt={alumni.name}
                  width={150}
                  height={150}
                  className="rounded-full border-4 border-primary/20 object-cover"
                  data-ai-hint="person portrait"
                />
              </div>
              <div className="flex-grow">
                <h1 className="text-3xl font-headline font-bold">{alumni.name}</h1>
                <p className="text-lg text-muted-foreground">{alumni.currentRole}</p>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    <span>Class of {alumni.graduationYear}</span>
                  </div>
                  <a href={`mailto:${alumni.email}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                    <Mail className="h-4 w-4" />
                    <span>{alumni.email}</span>
                  </a>
                  <a href={alumni.linkedinURL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                    <Linkedin className="h-4 w-4" />
                    <span>LinkedIn Profile</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t pt-6">
              <h3 className="text-xl font-headline font-semibold mb-2">About Me</h3>
              <p className="text-muted-foreground">{alumni.shortBio}</p>
            </div>

            <div className="mt-6 border-t pt-6">
              <h3 className="text-xl font-headline font-semibold mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {alumni.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-sm px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle className="font-headline">Edit Your Profile</DialogTitle>
            <DialogDescription>Update your personal and professional information.</DialogDescription>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto p-1 pr-4">
            <AlumniForm
              alumni={alumni}
              onSave={handleSaveProfile}
              onCancel={() => setIsDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
