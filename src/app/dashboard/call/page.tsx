'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUser } from '@/context/user-context';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';

export default function CallPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { users } = useUser();
  const { user: authUser } = useAuth();
  const { toast } = useToast();

  const localVideoRef = useRef<HTMLVideoElement>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [loadingPermissions, setLoadingPermissions] = useState(true);
  const [callType, setCallType] = useState<'video' | 'voice' | null>(null);

  const userId = searchParams.get('userId');
  const contact = users.find(u => u.id === userId);
  const localUser = users.find(u => u.email === authUser?.email);

  useEffect(() => {
    const callTypeParam = searchParams.get('type');
    if (callTypeParam === 'video' || callTypeParam === 'voice') {
      setCallType(callTypeParam);
      setIsVideoOff(callTypeParam === 'voice');
    } else {
      router.push('/dashboard/chat');
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (!callType) return;

    const getPermissions = async () => {
      setLoadingPermissions(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: callType === 'video',
          audio: true,
        });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setHasPermissions(true);
      } catch (error) {
        console.error('Error accessing media devices.', error);
        toast({
          variant: 'destructive',
          title: 'Permissions Denied',
          description: 'Camera and microphone access are required for calls.',
        });
        setHasPermissions(false);
      } finally {
        setLoadingPermissions(false);
      }
    };

    getPermissions();

    return () => {
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [callType, toast]);

  const toggleStreamTrack = (kind: 'audio' | 'video', enable: boolean) => {
     if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      const tracks = kind === 'audio' ? stream.getAudioTracks() : stream.getVideoTracks();
      tracks.forEach(track => {
        track.enabled = enable;
      });
    }
  }

  const toggleMute = () => {
    toggleStreamTrack('audio', isMuted);
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    if (callType !== 'video') return;
    toggleStreamTrack('video', isVideoOff);
    setIsVideoOff(!isVideoOff);
  };

  const endCall = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
    }
    router.push(`/dashboard/chat?userId=${userId}`);
  };

  if (!contact || !callType) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-900">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-slate-900 text-white flex flex-col">
      {/* Main video area */}
      <div className="flex-1 relative flex items-center justify-center">
        {/* Remote user placeholder */}
        <div className="flex flex-col items-center justify-center text-center">
            <Avatar className="h-32 w-32 border-4 border-slate-700">
                <AvatarImage src={contact.avatarUrl} alt={contact.name} data-ai-hint="person avatar"/>
                <AvatarFallback className="text-5xl bg-slate-800 text-white">{contact.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <h1 className="text-3xl font-bold mt-4">Calling {contact.name}...</h1>
             <p className="text-slate-400">This is a visual prototype of the call screen.</p>
        </div>

        {/* Local user video feed */}
        <Card className="absolute bottom-6 right-6 w-48 h-36 md:w-64 md:h-48 bg-slate-800 border-slate-700 overflow-hidden shadow-2xl">
            {loadingPermissions && (
                <div className="w-full h-full flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin"/>
                </div>
            )}
            {!loadingPermissions && !hasPermissions && (
                <div className="w-full h-full flex items-center justify-center p-2 text-center text-xs">
                    <p>Camera/Mic access denied.</p>
                </div>
            )}
            {hasPermissions && (
                <div className="relative w-full h-full">
                    <video ref={localVideoRef} className={`w-full h-full object-cover scale-x-[-1] ${isVideoOff ? 'hidden' : ''}`} autoPlay muted playsInline />
                    {isVideoOff && (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-black">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={localUser?.avatarUrl} alt={localUser?.name} data-ai-hint="person avatar" />
                                <AvatarFallback>{localUser?.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <p className="text-sm mt-2">Video Off</p>
                        </div>
                    )}
                </div>
            )}
        </Card>
      </div>

      {/* Call controls */}
      <div className="py-4 bg-black bg-opacity-30">
        <div className="flex justify-center items-center gap-4">
            <Button variant="secondary" size="icon" className="rounded-full h-14 w-14 bg-slate-700 hover:bg-slate-600 text-white disabled:bg-slate-800" onClick={toggleMute} disabled={!hasPermissions}>
                {isMuted ? <MicOff className="h-6 w-6"/> : <Mic className="h-6 w-6"/>}
            </Button>
            {callType === 'video' && (
                <Button variant="secondary" size="icon" className="rounded-full h-14 w-14 bg-slate-700 hover:bg-slate-600 text-white disabled:bg-slate-800" onClick={toggleVideo} disabled={!hasPermissions}>
                    {isVideoOff ? <VideoOff className="h-6 w-6"/> : <Video className="h-6 w-6"/>}
                </Button>
            )}
            <Button variant="destructive" size="icon" className="rounded-full h-14 w-14" onClick={endCall}>
                <PhoneOff className="h-6 w-6" />
            </Button>
        </div>
      </div>
    </div>
  );
}
