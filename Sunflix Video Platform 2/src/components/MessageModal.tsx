import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { createMessage } from '../lib/mongodb-storage';
import { toast } from 'sonner';

interface MessageModalProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function MessageModal({ trigger, open, onOpenChange }: MessageModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await createMessage({
        ...formData,
        read: false,
        createdAt: new Date().toISOString(),
      });

      if (result) {
        toast.success('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
        onOpenChange?.(false);
      } else {
        toast.error('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="bg-[#1A1A1D] border-white/10 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Send us a Message</DialogTitle>
          <DialogDescription className="text-gray-400">
            Fill out the form below to send us a message. We'll get back to you as soon as possible.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-white">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 bg-[#0E0E10] border-white/10"
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="mt-1 bg-[#0E0E10] border-white/10"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="message" className="text-white">Message</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              className="mt-1 bg-[#0E0E10] border-white/10 min-h-[120px]"
              placeholder="Your message..."
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[#FF7E00] to-[#6C00FF] hover:opacity-90"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}