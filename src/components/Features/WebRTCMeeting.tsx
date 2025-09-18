import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Monitor, 
  MessageSquare, 
  Settings,
  Users,
  Volume2,
  VolumeX,
  Camera,
  RotateCcw,
  Maximize2,
  Minimize2,
  Copy,
  Share,
  Link,
  UserPlus
} from 'lucide-react';

interface WebRTCMeetingProps {
  isOpen: boolean;
  onClose: () => void;
  meetingId: string;
  userName: string;
  isHost?: boolean;
}

interface Participant {
  id: string;
  name: string;
  stream: MediaStream | null;
  isHost: boolean;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
}

const WebRTCMeeting: React.FC<WebRTCMeetingProps> = ({
  isOpen,
  onClose,
  meetingId,
  userName,
  isHost = false
}) => {
  // Video refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  
  // WebRTC refs
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  
  // State
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<{id: string, sender: string, message: string, timestamp: string}[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'failed'>('connecting');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [meetingLink, setMeetingLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);

  // WebRTC Configuration
  const rtcConfig = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ]
  };

  // Generate meeting link
  const generateMeetingLink = useCallback(() => {
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/join-meeting/${meetingId}?host=${encodeURIComponent(userName)}`;
    setMeetingLink(link);
    return link;
  }, [meetingId, userName]);

  // Copy meeting link to clipboard
  const copyMeetingLink = useCallback(async () => {
    const link = meetingLink || generateMeetingLink();
    try {
      await navigator.clipboard.writeText(link);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 3000);
    } catch (error) {
      console.error('Failed to copy link:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = link;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 3000);
      } catch (fallbackError) {
        console.error('Fallback copy failed:', fallbackError);
      }
      document.body.removeChild(textArea);
    }
  }, [meetingLink, generateMeetingLink]);

  // Share meeting link
  const shareMeetingLink = useCallback(async () => {
    const link = meetingLink || generateMeetingLink();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join My Meeting',
          text: `${userName} is inviting you to a video meeting`,
          url: link,
        });
      } catch (error) {
        console.error('Failed to share:', error);
        copyMeetingLink(); // Fallback to copy
      }
    } else {
      copyMeetingLink(); // Fallback to copy
    }
  }, [meetingLink, generateMeetingLink, userName, copyMeetingLink]);

  // Initialize WebRTC
  const initializeWebRTC = useCallback(async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: { echoCancellation: true, noiseSuppression: true }
      });
      
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Create peer connection
      const peerConnection = new RTCPeerConnection(rtcConfig);
      peerConnectionRef.current = peerConnection;

      // Add local stream to peer connection
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
      });

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // Handle connection state changes
      peerConnection.onconnectionstatechange = () => {
        setConnectionStatus(peerConnection.connectionState as any);
        setIsConnected(peerConnection.connectionState === 'connected');
      };

      // ICE candidate handling
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          // In a real implementation, send this to the signaling server
          console.log('ICE candidate:', event.candidate);
        }
      };

      setConnectionStatus('connected');
      
      // Add local participant
      setParticipants([{
        id: 'local',
        name: userName,
        stream,
        isHost,
        isVideoEnabled: true,
        isAudioEnabled: true
      }]);

      // Generate meeting link
      generateMeetingLink();

    } catch (error) {
      console.error('Error initializing WebRTC:', error);
      setConnectionStatus('failed');
    }
  }, [userName, isHost, rtcConfig, generateMeetingLink]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  }, []);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  }, []);

  // Screen sharing
  const toggleScreenShare = useCallback(async () => {
    try {
      if (isScreenSharing) {
        // Stop screen sharing, return to camera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
          audio: { echoCancellation: true, noiseSuppression: true }
        });
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        
        localStreamRef.current = stream;
        setIsScreenSharing(false);
      } else {
        // Start screen sharing
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        
        localStreamRef.current = screenStream;
        setIsScreenSharing(true);

        // Handle screen share end
        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          // Return to camera
          navigator.mediaDevices.getUserMedia({
            video: { width: 1280, height: 720 },
            audio: { echoCancellation: true, noiseSuppression: true }
          }).then(stream => {
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = stream;
            }
            localStreamRef.current = stream;
          });
        };
      }
    } catch (error) {
      console.error('Error with screen sharing:', error);
    }
  }, [isScreenSharing]);

  // Send chat message
  const sendMessage = useCallback(() => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now().toString(),
        sender: userName,
        message: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString()
      };
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  }, [newMessage, userName]);

  // End call
  const endCall = useCallback(() => {
    // Stop all tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    
    // Close meeting
    onClose();
  }, [onClose]);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  // Initialize WebRTC when component mounts
  useEffect(() => {
    if (isOpen) {
      initializeWebRTC();
    }
    
    return () => {
      // Cleanup
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, [isOpen, initializeWebRTC]);

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 bg-gray-900 ${isFullscreen ? '' : 'p-4'}`}>
      <div className={`${isFullscreen ? 'h-full' : 'h-full rounded-2xl overflow-hidden'} bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 shadow-2xl flex flex-col`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-black/30 backdrop-blur-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500' :
                connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' :
                'bg-red-500'
              }`}></div>
              <span className="text-white font-medium">
                Meeting ID: {meetingId}
              </span>
            </div>
            <div className="text-white/70 text-sm">
              {connectionStatus === 'connected' ? 'Connected' : 
               connectionStatus === 'connecting' ? 'Connecting...' : 
               connectionStatus === 'failed' ? 'Connection Failed' : 'Disconnected'}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Invite Friends Button */}
            <button
              onClick={() => setShowInviteModal(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white transition-all transform hover:scale-105 shadow-lg"
            >
              <UserPlus className="w-4 h-4" />
              <span className="text-sm font-medium">Invite Friends</span>
            </button>
            
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <div className="flex items-center space-x-2 text-white/70">
              <Users className="w-4 h-4" />
              <span className="text-sm">{participants.length}</span>
            </div>
          </div>
        </div>

        {/* Video Area */}
        <div className="flex-1 flex">
          {/* Main Video Area */}
          <div className="flex-1 relative">
            {/* Remote Video (Main) */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover bg-gray-800"
            />
            
            {/* Local Video (Picture-in-Picture) */}
            <div className="absolute top-4 right-4 w-64 h-36 rounded-xl overflow-hidden shadow-2xl border-2 border-white/20">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover bg-gray-700"
              />
              {!isVideoEnabled && (
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                  <div className="text-center text-white">
                    <VideoOff className="w-8 h-8 mx-auto mb-2 opacity-60" />
                    <p className="text-sm opacity-60">Camera Off</p>
                  </div>
                </div>
              )}
              <div className="absolute bottom-2 left-2 text-white text-xs bg-black/50 px-2 py-1 rounded">
                You {isHost && '(Host)'}
              </div>
            </div>

            {/* Screen Share Indicator */}
            {isScreenSharing && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2">
                <Monitor className="w-4 h-4" />
                <span>Screen Sharing</span>
              </div>
            )}

            {/* Connection Status Overlay */}
            {connectionStatus !== 'connected' && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                  <h3 className="text-xl font-bold mb-2">
                    {connectionStatus === 'connecting' ? 'Connecting to meeting...' :
                     connectionStatus === 'failed' ? 'Connection failed' : 'Reconnecting...'}
                  </h3>
                  <p className="text-white/70">
                    {connectionStatus === 'failed' ? 'Please check your internet connection' : 'Please wait'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Chat Sidebar */}
          {showChat && (
            <div className="w-80 bg-black/30 backdrop-blur-sm border-l border-white/10 flex flex-col">
              <div className="p-4 border-b border-white/10">
                <h3 className="text-white font-medium flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chat
                </h3>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="bg-white/10 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-medium text-sm">{msg.sender}</span>
                      <span className="text-white/50 text-xs">{msg.timestamp}</span>
                    </div>
                    <p className="text-white/90 text-sm">{msg.message}</p>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t border-white/10">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                  />
                  <button
                    onClick={sendMessage}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="p-6 bg-black/30 backdrop-blur-sm">
          <div className="flex items-center justify-center space-x-4">
            {/* Audio Toggle */}
            <button
              onClick={toggleAudio}
              className={`p-4 rounded-full transition-all transform hover:scale-110 ${
                isAudioEnabled 
                  ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                  : 'bg-red-600 hover:bg-red-500 text-white'
              }`}
            >
              {isAudioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </button>

            {/* Video Toggle */}
            <button
              onClick={toggleVideo}
              className={`p-4 rounded-full transition-all transform hover:scale-110 ${
                isVideoEnabled 
                  ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                  : 'bg-red-600 hover:bg-red-500 text-white'
              }`}
            >
              {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </button>

            {/* Screen Share */}
            <button
              onClick={toggleScreenShare}
              className={`p-4 rounded-full transition-all transform hover:scale-110 ${
                isScreenSharing 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                  : 'bg-gray-600 hover:bg-gray-500 text-white'
              }`}
            >
              <Monitor className="w-6 h-6" />
            </button>

            {/* Chat Toggle */}
            <button
              onClick={() => setShowChat(!showChat)}
              className={`p-4 rounded-full transition-all transform hover:scale-110 ${
                showChat 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                  : 'bg-gray-600 hover:bg-gray-500 text-white'
              }`}
            >
              <MessageSquare className="w-6 h-6" />
            </button>

            {/* Quick Share Link Button */}
            <button
              onClick={copyMeetingLink}
              className="p-4 rounded-full bg-green-600 hover:bg-green-500 text-white transition-all transform hover:scale-110"
            >
              {linkCopied ? <Copy className="w-6 h-6" /> : <Link className="w-6 h-6" />}
            </button>

            {/* Settings */}
            <button
              className="p-4 rounded-full bg-gray-600 hover:bg-gray-500 text-white transition-all transform hover:scale-110"
            >
              <Settings className="w-6 h-6" />
            </button>

            {/* End Call */}
            <button
              onClick={endCall}
              className="p-4 rounded-full bg-red-600 hover:bg-red-500 text-white transition-all transform hover:scale-110 shadow-lg"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
          </div>
          
          {/* Meeting Info */}
          <div className="text-center mt-4">
            <p className="text-white/70 text-sm">
              {userName} {isHost && '(Host)'} • Share link to invite friends
            </p>
            {linkCopied && (
              <p className="text-green-400 text-sm mt-1 animate-pulse">
                🎉 Meeting link copied! Share it with your friends
              </p>
            )}
          </div>
        </div>

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserPlus className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Invite Your Friends! 🎉
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Share this link to let your friends join the meeting
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={meetingLink || generateMeetingLink()}
                    readOnly
                    className="flex-1 bg-transparent text-gray-800 dark:text-gray-200 text-sm font-mono focus:outline-none"
                  />
                  <button
                    onClick={copyMeetingLink}
                    className={`p-2 rounded-lg transition-all ${
                      linkCopied 
                        ? 'bg-green-500 text-white' 
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex space-x-3 mb-4">
                <button
                  onClick={copyMeetingLink}
                  className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  <span>{linkCopied ? 'Copied!' : 'Copy Link'}</span>
                </button>
                
                <button
                  onClick={shareMeetingLink}
                  className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Share className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
              
              <button
                onClick={() => setShowInviteModal(false)}
                className="w-full py-3 px-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebRTCMeeting;