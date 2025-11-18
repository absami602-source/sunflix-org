import React, { useEffect, useState } from 'react';
import { Mail, MailOpen, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../components/ui/alert-dialog';
import type { Message } from '../../types';
import { toast } from 'sonner';
import apiClient from '../../lib/api-client';

export function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = () => {
    apiClient
      .get('/api/messages')
      .then(res => res.data)
      .then(allMessages => {
        const sorted = allMessages.sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setMessages(sorted);
      })
      .catch(error => {
        console.error('Error loading messages:', error);
        toast.error('Failed to load messages');
      });
  };

  const toggleRead = async (id: string) => {
    const message = messages.find(m => m._id === id || m.id === id);
    if (!message) return;

    try {
      // Server exposes PUT /api/messages/:id/read to mark as read
      const response = await apiClient.put(`/api/messages/${id}/read`);
      if (!response || response.status >= 400) throw new Error('Failed to update message');
      const updated = response.data;
      setMessages(messages.map(m => 
        m._id === id || m.id === id ? updated : m
      ));
      toast.success('Message status updated');
    } catch (error) {
      console.error('Error updating message:', error);
      toast.error('Failed to update message');
    }
  };

  const deleteMessage = async (id: string) => {
    try {
  const response = await apiClient.delete(`/api/messages/${id}`);
  if (!response || response.status >= 400) throw new Error('Failed to delete message');

  setMessages(messages.filter(m => m._id !== id && m.id !== id));
      toast.success('Message deleted');
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  const filteredMessages = messages.filter(m => {
    if (filter === 'unread') return !m.read;
    if (filter === 'read') return m.read;
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl text-white">Messages</h1>
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-gradient-to-r from-[#FF7E00] to-[#6C00FF]' : ''}
          >
            All ({messages.length})
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'outline'}
            onClick={() => setFilter('unread')}
            className={filter === 'unread' ? 'bg-gradient-to-r from-[#FF7E00] to-[#6C00FF]' : ''}
          >
            Unread ({messages.filter(m => !m.read).length})
          </Button>
          <Button
            variant={filter === 'read' ? 'default' : 'outline'}
            onClick={() => setFilter('read')}
            className={filter === 'read' ? 'bg-gradient-to-r from-[#FF7E00] to-[#6C00FF]' : ''}
          >
            Read ({messages.filter(m => m.read).length})
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredMessages.map((message) => (
          <Card
            key={message._id || message.id}
            className={`bg-[#1A1A1D] border-white/10 ${!message.read ? 'border-l-4 border-l-[#FFB800]' : ''}`} 
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-white">{message.name}</CardTitle>
                    {!message.read && (
                      <Badge className="bg-[#FFB800] text-black">New</Badge>
                    )}
                  </div>
                  <p className="text-sm text-[#A0A0A0]">{message.email}</p>
                  <p className="text-xs text-[#A0A0A0] mt-1">
                    {message.createdAt ? new Date(message.createdAt).toLocaleString() : ''}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleRead(message._id || message.id)}
                    className="hover:bg-[#0E0E10]"
                  >
                    {message.read ? (
                      <Mail className="w-4 h-4 text-[#FFB800]" />
                    ) : (
                      <MailOpen className="w-4 h-4 text-[#FFB800]" />
                    )}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-[#FF1744]/20 hover:text-[#FF1744]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-[#1A1A1D] border-white/10">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Delete Message</AlertDialogTitle>
                        <AlertDialogDescription className="text-[#A0A0A0]">
                          Are you sure you want to delete this message? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-[#0E0E10] border-white/10">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMessage(message._id || message.id)}
                          className="bg-[#FF1744] hover:bg-[#FF1744]/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-white whitespace-pre-wrap">{message.message}</p>
            </CardContent>
          </Card>
        ))}

        {filteredMessages.length === 0 && (
          <Card className="bg-[#1A1A1D] border-white/10">
            <CardContent className="text-center text-[#A0A0A0] py-12">
              No messages found
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
