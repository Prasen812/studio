'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useApp } from '@/context/app-context';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import {
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  collection,
  updateDoc,
  deleteDoc,
  writeBatch,
  getDocs,
} from 'firebase/firestore';

// Configuration for the STUN servers for NAT traversal
const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};

export default function CallPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { users } = useApp();
  const { user: authUser } = useAuth();
  const { toast } = useToast();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Using refs for objects that shouldn't trigger re-renders
  const pc = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const remoteStream = useRef<MediaStream | null>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [loadingPermissions, setLoadingPermissions] = useState(true);
  const [callType, setCallType] = useState<'video' | 'voice' | null>(null);
  const [callId, setCallId] = useState<string | null>(null);
  const [showRemoteVideo, setShowRemoteVideo] = useState(false);

  const userId = searchParams.get('userId');
  const contact = users.find(u => u.id === userId);
  const localUser = users.find(u => u.email === authUser?.email);

  // Setup Call Type and a deterministic Call ID from user IDs
  useEffect(() => {
    const callTypeParam = searchParams.get('type');
    if (callTypeParam === 'video' || callTypeParam === 'voice') {
      setCallType(callTypeParam);
      setIsVideoOff(callTypeParam === 'voice');
    } else {
      router.push('/dashboard/chat');
    }

    if (localUser && contact) {
      const id = [localUser.id, contact.id].sort().join('_');
      setCallId(id);
    }
  }, [searchParams, router, localUser, contact]);

  // Request media permissions (camera/mic)
  useEffect(() => {
    if (!callType) return;
    const getPermissions = async () => {
      setLoadingPermissions(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: callType === 'video',
          audio: true,
        });
        localStream.current = stream;
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
        router.push(`/dashboard/chat?userId=${userId}`);
      } finally {
        setLoadingPermissions(false);
      }
    };
    getPermissions();
  }, [callType, toast, router, userId]);

  // Ends the call, cleans up streams, and deletes the call data from Firestore
  const endCall = useCallback(async () => {
    pc.current?.close();

    localStream.current?.getTracks().forEach(track => track.stop());
    remoteStream.current?.getTracks().forEach(track => track.stop());

    pc.current = null;
    localStream.current = null;
    remoteStream.current = null;

    if (callId) {
      const callDocRef = doc(db, 'calls', callId);
      const callDocSnap = await getDoc(callDocRef);
      if (callDocSnap.exists()) {
        const callerCandidatesCollection = collection(callDocRef, 'callerCandidates');
        const calleeCandidatesCollection = collection(callDocRef, 'calleeCandidates');
        const callerCandidatesSnap = await getDocs(callerCandidatesCollection);
        const calleeCandidatesSnap = await getDocs(calleeCandidatesCollection);
        
        const batch = writeBatch(db);
        callerCandidatesSnap.forEach(doc => batch.delete(doc.ref));
        calleeCandidatesSnap.forEach(doc => batch.delete(doc.ref));
        batch.delete(callDocRef);
        await batch.commit().catch(console.error);
      }
    }
    
    if (router && userId) {
        router.push(`/dashboard/chat?userId=${userId}`);
    }
  }, [callId, router, userId]);

  // Main WebRTC Logic: Handles offer, answer, and ICE candidates
  useEffect(() => {
    if (!hasPermissions || !callId || !localUser) return;

    pc.current = new RTCPeerConnection(servers);

    localStream.current?.getTracks().forEach((track) => {
      pc.current?.addTrack(track, localStream.current!);
    });

    pc.current.ontrack = (event) => {
        remoteStream.current = new MediaStream();
        event.streams[0].getTracks().forEach((track) => {
            remoteStream.current?.addTrack(track);
        });
        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream.current;
        }
        setShowRemoteVideo(true);
    };

    const callDocRef = doc(db, 'calls', callId);
    const callerCandidatesCollection = collection(callDocRef, 'callerCandidates');
    const calleeCandidatesCollection = collection(callDocRef, 'calleeCandidates');

    pc.current.onicecandidate = (event) => {
        if (event.candidate) {
            const isCaller = pc.current?.localDescription?.type === 'offer';
            const candidatesCollection = isCaller ? callerCandidatesCollection : calleeCandidatesCollection;
            setDoc(doc(candidatesCollection), { ...event.candidate.toJSON() });
        }
    };
    
    const startCall = async () => {
        const callDocSnap = await getDoc(callDocRef);
        
        if (!callDocSnap.exists()) {
            // Caller: Create offer and the call document in Firestore
            const offerDescription = await pc.current!.createOffer();
            await pc.current!.setLocalDescription(offerDescription);

            const offer = {
                sdp: offerDescription.sdp,
                type: offerDescription.type,
            };
            await setDoc(callDocRef, { offer, callerId: localUser.id });
        } else {
            // Callee: Answer the existing offer
             const callData = callDocSnap.data();
            if (callData.callerId === localUser.id) return; // Already setup by this user.

            const offer = callData.offer;
            await pc.current!.setRemoteDescription(new RTCSessionDescription(offer));
            
            const answerDescription = await pc.current!.createAnswer();
            await pc.current!.setLocalDescription(answerDescription);

            await updateDoc(callDocRef, { answer: { type: answerDescription.type, sdp: answerDescription.sdp } });
        }
    };
    
    startCall();
    
    // Listen for the answer to the offer
    const unsubscribeCall = onSnapshot(callDocRef, (snapshot) => {
        const data = snapshot.data();
        if (pc.current && !pc.current.currentRemoteDescription && data?.answer) {
            pc.current.setRemoteDescription(new RTCSessionDescription(data.answer));
        }
    });

    // Listen for ICE candidates from the other peer
    const unsubscribeCallerCandidates = onSnapshot(callerCandidatesCollection, (snapshot) => {
        if(pc.current?.localDescription?.type === 'offer') return;
        snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') pc.current?.addIceCandidate(new RTCIceCandidate(change.doc.data()));
        });
    });
    const unsubscribeCalleeCandidates = onSnapshot(calleeCandidatesCollection, (snapshot) => {
        if(pc.current?.localDescription?.type === 'answer') return;
        snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') pc.current?.addIceCandidate(new RTCIceCandidate(change.doc.data()));
        });
    });

    // Cleanup listeners and end the call on component unmount
    return () => {
      unsubscribeCall();
      unsubscribeCallerCandidates();
      unsubscribeCalleeCandidates();
      endCall();
    };
  }, [hasPermissions, callId, localUser, endCall]);


  const toggleStreamTrack = (kind: 'audio' | 'video', enable: boolean) => {
    localStream.current?.getTracks().forEach(track => {
      if (track.kind === kind) track.enabled = enable;
    });
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

  if (!contact || !callType) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-900">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-slate-900 text-white flex flex-col">
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        
        <video ref={remoteVideoRef} className={`w-full h-full object-cover ${showRemoteVideo ? '' : 'hidden'}`} autoPlay playsInline />
        
        {!showRemoteVideo && (
            <div className="flex flex-col items-center justify-center text-center">
                <Avatar className="h-32 w-32 border-4 border-slate-700">
                    <AvatarImage src={contact.avatarUrl} alt={contact.name} data-ai-hint="person avatar"/>
                    <AvatarFallback className="text-5xl bg-slate-800 text-white">{contact.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h1 className="text-3xl font-bold mt-4">Calling {contact.name}...</h1>
                <p className="text-slate-400">Establishing secure connection...</p>
            </div>
        )}

        <Card className="absolute bottom-6 right-6 w-48 h-36 md:w-64 md:h-48 bg-slate-800 border-slate-700 overflow-hidden shadow-2xl">
            {loadingPermissions && <div className="w-full h-full flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin"/></div>}
            {!loadingPermissions && !hasPermissions && <div className="w-full h-full flex items-center justify-center p-2 text-center text-xs"><p>Camera/Mic access denied.</p></div>}
            
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
