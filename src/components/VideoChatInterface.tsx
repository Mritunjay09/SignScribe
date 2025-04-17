
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  Users,
  UserPlus,
  Copy,
  Share2 
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function VideoChatInterface() {
  const [videoActive, setVideoActive] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [roomId, setRoomId] = useState("");
  const { toast } = useToast();

  const toggleVideo = () => {
    setVideoActive(!videoActive);
  };

  const toggleMic = () => {
    setMicActive(!micActive);
  };

  const startCall = () => {
    // In a real implementation, this would initialize a WebRTC connection
    setInCall(true);
    
    if (!videoActive) toggleVideo();
    if (!micActive) toggleMic();
    
    // Generate a random room ID if not joining an existing room
    if (!roomId) {
      const newRoomId = Math.random().toString(36).substring(2, 10);
      setRoomId(newRoomId);
    }
    
    toast({
      title: "Call Started",
      description: "You've successfully started a video chat session.",
    });
  };

  const endCall = () => {
    setInCall(false);
    toast({
      title: "Call Ended",
      description: "You've ended the video chat session.",
      variant: "destructive",
    });
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    toast({
      title: "Room ID Copied",
      description: "Room ID has been copied to clipboard. Share it with friends to let them join.",
    });
  };

  return (
    <div className="flex flex-col items-center">
      <Tabs defaultValue="start" className="w-full max-w-4xl mb-8">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="start" className="data-[state=active]:bg-purple data-[state=active]:text-white">
            <Video className="mr-2 h-4 w-4" />
            Start New Chat
          </TabsTrigger>
          <TabsTrigger value="join" className="data-[state=active]:bg-purple data-[state=active]:text-white">
            <UserPlus className="mr-2 h-4 w-4" />
            Join Existing Chat
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="start" className="mt-0">
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-slate-dark mb-4">Start a New Video Chat</h2>
              <p className="text-slate mb-6">
                Create a new video chat room and invite friends to practice sign language together.
                Once you start, you'll get a room ID you can share with others.
              </p>
              
              {inCall && roomId && (
                <div className="bg-purple-50 p-4 rounded-lg mb-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-slate">Your Room ID:</p>
                      <p className="font-medium text-lg text-purple">{roomId}</p>
                    </div>
                    <Button variant="outline" onClick={copyRoomId} className="border-purple text-purple">
                      <Copy className="mr-2 h-4 w-4" />
                      Copy ID
                    </Button>
                  </div>
                </div>
              )}
              
              <Button 
                onClick={inCall ? endCall : startCall} 
                className={inCall ? "bg-red-500 hover:bg-red-600 w-full" : "bg-purple hover:bg-purple-dark w-full"}
              >
                {inCall ? (
                  <>
                    <PhoneOff className="mr-2 h-4 w-4" />
                    End Video Chat
                  </>
                ) : (
                  <>
                    <Phone className="mr-2 h-4 w-4" />
                    Start Video Chat
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="join" className="mt-0">
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-slate-dark mb-4">Join an Existing Chat</h2>
              <p className="text-slate mb-6">
                Enter the Room ID shared with you to join an existing video chat session.
              </p>
              
              <div className="space-y-4">
                <div className="grid w-full items-center gap-2">
                  <Input
                    type="text"
                    placeholder="Enter Room ID"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="mb-4"
                    disabled={inCall}
                  />
                </div>
                
                <Button 
                  onClick={inCall ? endCall : startCall} 
                  className={inCall ? "bg-red-500 hover:bg-red-600 w-full" : "bg-purple hover:bg-purple-dark w-full"}
                  disabled={!roomId && !inCall}
                >
                  {inCall ? (
                    <>
                      <PhoneOff className="mr-2 h-4 w-4" />
                      End Video Chat
                    </>
                  ) : (
                    <>
                      <Phone className="mr-2 h-4 w-4" />
                      Join Video Chat
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="w-full max-w-4xl">
        <Card className="w-full overflow-hidden mb-6">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Main video (you) */}
              <div className="relative">
                <div className="aspect-video bg-slate-100 flex items-center justify-center">
                  {videoActive ? (
                    <>
                      <div className="absolute inset-0 bg-slate-800 opacity-20"></div>
                      <video className="w-full h-full object-cover" autoPlay muted playsInline />
                    </>
                  ) : (
                    <div className="text-slate-400 flex flex-col items-center">
                      <VideoOff size={48} />
                      <p className="mt-2">Your camera is off</p>
                    </div>
                  )}
                  
                  {/* Info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/70 to-transparent p-3">
                    <div className="flex justify-between items-center">
                      <p className="text-white text-sm">You</p>
                      <div className="flex space-x-2">
                        {!micActive && <MicOff className="h-4 w-4 text-white bg-red-500 rounded-full p-0.5" />}
                        {!videoActive && <VideoOff className="h-4 w-4 text-white bg-red-500 rounded-full p-0.5" />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Friend's video */}
              <div className="relative">
                <div className="aspect-video bg-slate-100 flex items-center justify-center">
                  {inCall ? (
                    <>
                      <div className="absolute inset-0 bg-slate-800 opacity-20"></div>
                      {/* This would be populated with the friend's video stream in a real implementation */}
                      <video className="w-full h-full object-cover" />
                    </>
                  ) : (
                    <div className="text-slate-400 flex flex-col items-center">
                      <Users size={48} />
                      <p className="mt-2">Waiting for someone to join...</p>
                    </div>
                  )}
                  
                  {/* Info overlay */}
                  {inCall && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/70 to-transparent p-3">
                      <p className="text-white text-sm">Friend</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Controls */}
        {(inCall || videoActive || micActive) && (
          <div className="flex justify-center space-x-4 mb-8">
            <Button 
              variant="outline" 
              className={`rounded-full p-3 h-auto ${micActive ? 'border-teal' : 'bg-red-100 border-red-500 text-red-500'}`}
              onClick={toggleMic}
            >
              {micActive ? <Mic className="h-5 w-5 text-teal" /> : <MicOff className="h-5 w-5" />}
            </Button>
            
            {inCall && (
              <Button 
                variant="default" 
                className="rounded-full p-3 h-auto bg-red-500 hover:bg-red-600"
                onClick={endCall}
              >
                <PhoneOff className="h-5 w-5" />
              </Button>
            )}
            
            <Button 
              variant="outline" 
              className={`rounded-full p-3 h-auto ${videoActive ? 'border-teal' : 'bg-red-100 border-red-500 text-red-500'}`}
              onClick={toggleVideo}
            >
              {videoActive ? <Video className="h-5 w-5 text-teal" /> : <VideoOff className="h-5 w-5" />}
            </Button>
          </div>
        )}
        
        {/* Instructions */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-bold text-slate-dark mb-2">Tips for Signing on Video</h3>
            <ul className="text-slate text-sm space-y-2">
              <li className="flex items-start">
                <div className="bg-purple-50 p-1 rounded-full mr-2 mt-0.5">
                  <Video className="h-3 w-3 text-purple" />
                </div>
                Position yourself so your hands and face are clearly visible in the frame
              </li>
              <li className="flex items-start">
                <div className="bg-purple-50 p-1 rounded-full mr-2 mt-0.5">
                  <Video className="h-3 w-3 text-purple" />
                </div>
                Ensure you have good lighting, preferably from the front
              </li>
              <li className="flex items-start">
                <div className="bg-purple-50 p-1 rounded-full mr-2 mt-0.5">
                  <Video className="h-3 w-3 text-purple" />
                </div>
                Sign at a moderate pace for clear communication
              </li>
              <li className="flex items-start">
                <div className="bg-purple-50 p-1 rounded-full mr-2 mt-0.5">
                  <Share2 className="h-3 w-3 text-purple" />
                </div>
                Share your room ID with friends so they can join your practice session
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
