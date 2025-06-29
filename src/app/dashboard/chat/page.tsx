
'use client';
import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/dashboard/header';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Phone, Video } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useUser } from '@/context/user-context';
import { conversations as initialConversations } from '@/lib/data';
import type { User, Conversation, ChatMessage } from '@/lib/types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function ChatPage() {
  const { user: authUser } = useAuth();
  const { users } = useUser();
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  const currentUser = useMemo(() => {
    return users.find(u => u.email === authUser?.email);
  }, [authUser, users]);

  const userConversations = useMemo(() => {
    if (!currentUser) return [];
    return conversations.filter(c => c.participantIds.includes(currentUser.id));
  }, [currentUser, conversations]);

  const selectedConversation = useMemo(() => {
    return conversations.find(c => c.id === selectedConversationId);
  }, [selectedConversationId, conversations]);

  const contacts = useMemo(() => {
    if (!currentUser) return [];
    return users.filter(u => u.id !== currentUser.id);
  }, [currentUser, users]);

  const handleSelectConversation = useCallback((contact: User) => {
    if(!currentUser) return;
    let conversation = userConversations.find(c => c.participantIds.includes(contact.id));
    if (conversation) {
      setSelectedConversationId(conversation.id);
    } else {
      // Create a new conversation
      const newConversation: Conversation = {
        id: `conv-${Date.now()}`,
        participantIds: [currentUser.id, contact.id],
        messages: [],
      };
      setConversations(prev => [...prev, newConversation]);
      setSelectedConversationId(newConversation.id);
    }
  }, [currentUser, userConversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation?.messages]);

  useEffect(() => {
    const userId = searchParams.get('userId');
    if (userId && contacts.length > 0 && currentUser) {
      if (userId === currentUser.id) return; // Don't start a chat with yourself
      const contactToChat = contacts.find(c => c.id === userId);
      if (contactToChat) {
        handleSelectConversation(contactToChat);
      }
    }
  }, [searchParams, contacts, currentUser, handleSelectConversation]);

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim() || !currentUser || !selectedConversationId) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      content: message,
      timestamp: new Date().toISOString(),
    };

    setConversations(prev =>
      prev.map(c =>
        c.id === selectedConversationId
          ? { ...c, messages: [...c.messages, newMessage] }
          : c
      )
    );
    setMessage('');
  };

  const getOtherParticipant = (conversation: Conversation) => {
    if (!currentUser) return null;
    const otherId = conversation.participantIds.find(id => id !== currentUser.id);
    return users.find(u => u.id === otherId);
  }

  if (!currentUser) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <p>Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header pageTitle="Chat" />
      <main className="flex-1 grid grid-cols-[300px_1fr] gap-4 p-4 md:p-6">
        <Card className="flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold">Contacts</h2>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2">
              {contacts.map(contact => {
                 const conversation = userConversations.find(c => c.participantIds.includes(contact.id));
                 const lastMessage = conversation?.messages[conversation.messages.length - 1];
                return(
                <button
                  key={contact.id}
                  onClick={() => handleSelectConversation(contact)}
                  className={cn(
                    "w-full flex items-center gap-3 p-2 rounded-md text-left hover:bg-muted",
                    selectedConversation?.participantIds.includes(contact.id) && "bg-muted"
                  )}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={contact.avatarUrl} alt={contact.name} data-ai-hint="person avatar"/>
                    <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 truncate">
                    <p className="font-semibold truncate">{contact.name}</p>
                    {lastMessage && <p className="text-sm text-muted-foreground truncate">{lastMessage.content}</p>}
                  </div>
                </button>
              )})}
            </div>
          </ScrollArea>
        </Card>

        <Card className="flex flex-col h-[calc(100vh-124px)]">
          {selectedConversation ? (
            <>
              <div className="p-4 border-b flex items-center gap-3">
                 <Avatar className="h-10 w-10">
                    <AvatarImage src={getOtherParticipant(selectedConversation)?.avatarUrl} data-ai-hint="person avatar" />
                    <AvatarFallback>{getOtherParticipant(selectedConversation)?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-bold">{getOtherParticipant(selectedConversation)?.name}</h2>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <Link href={`/dashboard/call?userId=${getOtherParticipant(selectedConversation)?.id}&type=voice`}>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <Phone className="h-5 w-5" />
                            <span className="sr-only">Voice Call</span>
                        </Button>
                    </Link>
                    <Link href={`/dashboard/call?userId=${getOtherParticipant(selectedConversation)?.id}&type=video`}>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <Video className="h-5 w-5" />
                            <span className="sr-only">Video Call</span>
                        </Button>
                    </Link>
                  </div>
              </div>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {selectedConversation.messages.map(msg => {
                    const sender = users.find(u => u.id === msg.senderId);
                    const isCurrentUser = msg.senderId === currentUser.id;
                    return (
                      <div key={msg.id} className={cn("flex items-end gap-2", isCurrentUser ? "justify-end" : "justify-start")}>
                         {!isCurrentUser && (
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={sender?.avatarUrl} alt={sender?.name} data-ai-hint="person avatar"/>
                                <AvatarFallback>{sender?.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                         )}
                        <div className={cn(
                            "max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg",
                            isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"
                        )}>
                          <p className="text-sm">{msg.content}</p>
                          <p className={cn("text-xs mt-1 text-right", isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground")}>
                            {format(new Date(msg.timestamp), 'p')}
                          </p>
                        </div>
                        {isCurrentUser && (
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={sender?.avatarUrl} alt={sender?.name} data-ai-hint="person avatar"/>
                                <AvatarFallback>{sender?.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                         )}
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              <div className="p-4 border-t bg-background">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <Input
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    autoComplete="off"
                  />
                  <Button type="submit" size="icon">
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-lg font-semibold">Select a conversation</p>
                <p className="text-muted-foreground">Start chatting by selecting a contact on the left.</p>
              </div>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
