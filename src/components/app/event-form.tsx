'use client';

import { useEffect, useState } from 'react';
import { useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Wand2, Loader2, Clipboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Event } from '@/lib/types';
import { generateInvitationAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  date: z.string().min(1, 'Date is required'),
  location: z.string().min(1, 'Location is required'),
  description: z.string().min(1, 'Description is required'),
});

type EventFormProps = {
  event?: Event | null;
  onSave: (data: Event) => void;
  onCancel: () => void;
};

export function EventForm({ event, onSave, onCancel }: EventFormProps) {
  const { toast } = useToast();
  const [invitationState, invitationFormAction] = useActionState(generateInvitationAction, null);
  const [eventDetailsForAI, setEventDetailsForAI] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: isFormSubmitting },
    watch
  } = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event?.title || '',
      date: event ? new Date(event.date).toISOString().substring(0, 16) : new Date().toISOString().substring(0, 16),
      location: event?.location || '',
      description: event?.description || '',
    },
  });

  const watchedValues = watch();

  useEffect(() => {
    if (invitationState?.message) {
      toast({
        title: invitationState.error ? 'Generation Failed' : 'Invitation Generated',
        description: invitationState.message,
        variant: invitationState.error ? 'destructive' : 'default',
      });
      setIsGenerating(false);
    }
  }, [invitationState, toast]);

  const onSubmit = (data: z.infer<typeof eventSchema>) => {
    onSave({
      ...event!,
      id: event?.id || Date.now().toString(),
      ...data,
      date: new Date(data.date).toISOString(),
      imageUrl: event?.imageUrl || `https://picsum.photos/seed/${200 + Date.now()}/800/400`,
      rsvps: event?.rsvps || 0,
    });
  };

  const handleGenerateInvitation = () => {
    const details = `Event: ${watchedValues.title}, Date: ${new Date(watchedValues.date).toLocaleString()}, Location: ${watchedValues.location}, Details: ${watchedValues.description}`;
    setEventDetailsForAI(details);
    
    const formData = new FormData();
    formData.append('eventDetails', details);
    setIsGenerating(true);
    invitationFormAction(formData);
  };
  
  const handleCopyToClipboard = () => {
    if (invitationState?.data?.emailInvitation) {
        navigator.clipboard.writeText(invitationState.data.emailInvitation);
        toast({ title: "Copied to clipboard!" });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="title">Event Title</Label>
        <Input id="title" {...register('title')} />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">Date and Time</Label>
          <Input id="date" type="datetime-local" {...register('date')} />
          {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input id="location" {...register('location')} placeholder="e.g., Virtual or University Hall" />
          {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register('description')} rows={4} />
        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-headline">AI Email Drafting</CardTitle>
          <CardDescription>Generate a polished event invitation email from the details above.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
            <Button type="button" onClick={handleGenerateInvitation} disabled={isGenerating}>
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              Generate Invitation
            </Button>
            {invitationState?.data?.emailInvitation && (
                <div className="space-y-2 pt-2">
                    <div className="flex justify-between items-center">
                        <Label>Generated Email</Label>
                        <Button type="button" variant="ghost" size="sm" onClick={handleCopyToClipboard}>
                            <Clipboard className="mr-2 h-4 w-4" /> Copy
                        </Button>
                    </div>
                    <Textarea readOnly value={invitationState.data.emailInvitation} rows={8} className="bg-muted"/>
                </div>
            )}
        </CardContent>
      </Card>


      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isFormSubmitting}>
          {isFormSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {event ? 'Save Changes' : 'Create Event'}
        </Button>
      </div>
    </form>
  );
}
