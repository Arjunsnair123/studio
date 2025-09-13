
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { PlusCircle, MoreVertical, Pencil, Trash2, Calendar as CalendarIcon, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { eventData as initialEventData } from '@/lib/data';
import type { Event } from '@/lib/types';
import { EventForm } from '@/components/app/event-form';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const EVENTS_STORAGE_KEY = 'events-data';

export default function EventManagementPage() {
  const [eventList, setEventList] = useState<Event[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
      if (storedEvents) {
        setEventList(JSON.parse(storedEvents));
      } else {
        setEventList(initialEventData);
        localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(initialEventData));
      }
    } catch (error) {
       console.error("Could not load event data from localStorage", error);
       setEventList(initialEventData);
    }
  }, []);

  const updateEventList = (newList: Event[]) => {
    setEventList(newList);
    try {
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(newList));
    } catch (error) {
      console.error("Could not save event data to localStorage", error);
    }
  };

  const handleAddEvent = () => {
    setEditingEvent(null);
    setIsDialogOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsDialogOpen(true);
  };

  const handleSaveEvent = (savedEvent: Event) => {
    if (editingEvent) {
      updateEventList(eventList.map((e) => (e.id === savedEvent.id ? savedEvent : e)));
      toast({ title: 'Event Updated', description: `"${savedEvent.title}" has been updated.` });
    } else {
      updateEventList([savedEvent, ...eventList]);
      toast({ title: 'Event Created', description: `"${savedEvent.title}" has been created.` });
    }
    setIsDialogOpen(false);
    setEditingEvent(null);
  };
  
  const handleDeleteEvent = (eventToDelete: Event) => {
    updateEventList(eventList.filter(e => e.id !== eventToDelete.id));
    toast({ title: 'Event Deleted', description: `"${eventToDelete.title}" has been deleted.`, variant: 'destructive'});
  }

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-headline font-bold">Event Management</h2>
        <Button onClick={handleAddEvent}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Event
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {eventList.map((event) => (
          <Card key={event.id} className="flex flex-col">
            <CardHeader className="p-0 relative">
              <Image
                alt={event.title}
                className="aspect-video w-full rounded-t-lg object-cover"
                height="200"
                src={event.imageUrl}
                width="400"
                data-ai-hint="business event"
              />
               <div className="absolute top-2 right-2">
                <AlertDialog>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-background/70 hover:bg-background">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditEvent(event)}><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="text-destructive focus:text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                      </AlertDialogTrigger>
                    </DropdownMenuContent>
                  </DropdownMenu>
                   <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the event "{event.title}". This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteEvent(event)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardHeader>
            <CardContent className="p-4 flex flex-col flex-grow">
              <h3 className="text-lg font-headline font-semibold mb-2">{event.title}</h3>
              <div className="text-sm text-muted-foreground space-y-2 mb-4">
                  <div className="flex items-center gap-2"><CalendarIcon className="h-4 w-4" /> {format(new Date(event.date), "MMMM d, yyyy 'at' h:mm a")}</div>
                  <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {event.location}</div>
                  <div className="flex items-center gap-2"><Users className="h-4 w-4" /> {event.rsvps} RSVPs</div>
              </div>
              <p className="text-sm text-muted-foreground flex-grow">{event.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle className="font-headline">{editingEvent ? 'Edit Event' : 'Create New Event'}</DialogTitle>
            <DialogDescription>
              {editingEvent ? 'Update the details for this event.' : 'Fill in the details for the new event.'}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto p-1 pr-4">
            <EventForm
              event={editingEvent}
              onSave={handleSaveEvent}
              onCancel={() => setIsDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
