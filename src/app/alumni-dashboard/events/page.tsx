'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Calendar as CalendarIcon, MapPin, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { eventData } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function AlumniEventsPage() {
  const [rsvpdEvents, setRsvpdEvents] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const handleRsvp = (eventId: string, eventTitle: string) => {
    setRsvpdEvents((prev) => new Set(prev).add(eventId));
    toast({
      title: "You're on the list!",
      description: `You have successfully RSVP'd for "${eventTitle}".`,
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-headline font-bold">Events & Opportunities</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {eventData.map((event) => {
          const hasRsvpd = rsvpdEvents.has(event.id);
          return (
            <Card key={event.id} className="flex flex-col overflow-hidden">
              <CardHeader className="p-0">
                <Image
                  alt={event.title}
                  className="aspect-video w-full object-cover"
                  height="200"
                  src={event.imageUrl}
                  width="400"
                  data-ai-hint="business event"
                />
              </CardHeader>
              <CardContent className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-headline font-semibold mb-2">{event.title}</h3>
                <div className="text-sm text-muted-foreground space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    {format(new Date(event.date), "MMMM d, yyyy 'at' h:mm a")}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground flex-grow mb-4">{event.description}</p>
                <Button
                  onClick={() => handleRsvp(event.id, event.title)}
                  disabled={hasRsvpd}
                  className="w-full mt-auto"
                >
                  {hasRsvpd ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      RSVP'd
                    </>
                  ) : (
                    'RSVP Now'
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
