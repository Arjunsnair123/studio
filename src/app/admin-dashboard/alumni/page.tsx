
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { alumniData as initialAlumniData } from '@/lib/data';
import type { Alumni } from '@/lib/types';
import { AlumniTableActions } from '@/components/app/alumni-table-actions';
import { AlumniForm } from '@/components/app/alumni-form';
import { useToast } from '@/hooks/use-toast';

const ALUMNI_STORAGE_KEY = 'alumni-data';

export default function AlumniManagementPage() {
  const [alumniList, setAlumniList] = useState<Alumni[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAlumni, setEditingAlumni] = useState<Alumni | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedAlumni = localStorage.getItem(ALUMNI_STORAGE_KEY);
      if (storedAlumni) {
        setAlumniList(JSON.parse(storedAlumni));
      } else {
        setAlumniList(initialAlumniData);
        localStorage.setItem(ALUMNI_STORAGE_KEY, JSON.stringify(initialAlumniData));
      }
    } catch (error) {
      console.error("Could not load alumni data from localStorage", error);
      setAlumniList(initialAlumniData);
    }
  }, []);

  const updateAlumniList = (newList: Alumni[]) => {
    setAlumniList(newList);
    try {
      localStorage.setItem(ALUMNI_STORAGE_KEY, JSON.stringify(newList));
    } catch (error) {
       console.error("Could not save alumni data to localStorage", error);
    }
  };
  
  const handleDeleteAlumni = (alumniToDelete: Alumni) => {
    updateAlumniList(alumniList.filter(a => a.id !== alumniToDelete.id));
    toast({ title: 'Alumni Deleted', description: `${alumniToDelete.name} has been deleted.`, variant: 'destructive'});
  }

  const handleAddAlumni = () => {
    setEditingAlumni(null);
    setIsDialogOpen(true);
  };

  const handleEditAlumni = (alumni: Alumni) => {
    setEditingAlumni(alumni);
    setIsDialogOpen(true);
  };

  const handleSaveAlumni = (savedAlumni: Alumni) => {
    if (editingAlumni) {
      updateAlumniList(alumniList.map((a) => (a.id === savedAlumni.id ? savedAlumni : a)));
      toast({ title: 'Alumni Updated', description: `${savedAlumni.name}'s profile has been updated.` });
    } else {
      updateAlumniList([savedAlumni, ...alumniList]);
      toast({ title: 'Alumni Added', description: `${savedAlumni.name} has been added to the database.` });
    }
    setIsDialogOpen(false);
    setEditingAlumni(null);
  };

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-headline font-bold">Alumni Management</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={handleAddAlumni}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Alumni
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Alumni Database</CardTitle>
          <CardDescription>View, edit, and manage all alumni profiles.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="hidden md:table-cell">Grad Year</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alumniList.map((alumni) => (
                <TableRow key={alumni.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      alt="Alumni avatar"
                      className="aspect-square rounded-full object-cover"
                      height="64"
                      src={alumni.avatarUrl}
                      width="64"
                      data-ai-hint="person portrait"
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div>{alumni.name}</div>
                    <div className="text-sm text-muted-foreground md:hidden">{alumni.graduationYear}</div>
                  </TableCell>
                  <TableCell>
                    <div className="line-clamp-2">{alumni.currentRole}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{alumni.graduationYear}</TableCell>
                  <TableCell>
                    <AlumniTableActions alumni={alumni} onEdit={handleEditAlumni} onDelete={handleDeleteAlumni} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle className="font-headline">{editingAlumni ? 'Edit Alumni Profile' : 'Add New Alumni'}</DialogTitle>
            <DialogDescription>
              {editingAlumni ? `Update the profile for ${editingAlumni.name}.` : 'Fill in the details for the new alumni.'}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto p-1 pr-4">
            <AlumniForm
                alumni={editingAlumni}
                onSave={handleSaveAlumni}
                onCancel={() => setIsDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
