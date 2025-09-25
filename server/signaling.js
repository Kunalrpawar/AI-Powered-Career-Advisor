/**
 * WebRTC Signaling Server
 * Handles the exchange of SDP offers/answers and ICE candidates
 * between meeting participants
 */

import { Server } from 'socket.io';

// Map to store active meetings and their participants
const meetings = new Map(); // meetingId -> Set of participant socket IDs
const socketToMeeting = new Map(); // socketId -> meetingId

/**
 * Initialize the signaling server
 * @param {Server} server - HTTP server instance
 */
export function initializeSignalingServer(server) {
  const io = new Server(server, {
    cors: {
      origin: '*', // In production, restrict this to your domain
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Join a meeting room
    socket.on('join-meeting', ({ meetingId, userName, isHost }) => {
      console.log(`${userName} joining meeting ${meetingId} as ${isHost ? 'host' : 'participant'}`);

      // Add to meeting mapping
      if (!meetings.has(meetingId)) {
        meetings.set(meetingId, new Set());
      }
      
      const participants = meetings.get(meetingId);
      participants.add(socket.id);
      socketToMeeting.set(socket.id, meetingId);

      // Join socket.io room
      socket.join(meetingId);

      // Notify user about current participants
      const participantList = Array.from(participants).filter(id => id !== socket.id);
      socket.emit('meeting-participants', { 
        participants: participantList,
        meetingId
      });

      // Notify others that this user joined
      socket.to(meetingId).emit('participant-joined', {
        participantId: socket.id,
        userName,
        isHost
      });

      // Send meeting info to the new participant
      socket.emit('meeting-info', {
        meetingId,
        success: true,
        participantCount: participants.size
      });
    });

    // Handle SDP offer
    socket.on('offer', ({ targetId, description }) => {
      console.log(`Forwarding offer from ${socket.id} to ${targetId}`);
      socket.to(targetId).emit('offer', {
        fromId: socket.id,
        description
      });
    });

    // Handle SDP answer
    socket.on('answer', ({ targetId, description }) => {
      console.log(`Forwarding answer from ${socket.id} to ${targetId}`);
      socket.to(targetId).emit('answer', {
        fromId: socket.id,
        description
      });
    });

    // Handle ICE candidate
    socket.on('ice-candidate', ({ targetId, candidate }) => {
      socket.to(targetId).emit('ice-candidate', {
        fromId: socket.id,
        candidate
      });
    });

    // Handle chat messages
    socket.on('chat-message', ({ message }) => {
      const meetingId = socketToMeeting.get(socket.id);
      if (meetingId) {
        socket.to(meetingId).emit('chat-message', {
          senderId: socket.id,
          message
        });
      }
    });

    // Handle user leaving
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
      const meetingId = socketToMeeting.get(socket.id);
      
      if (meetingId && meetings.has(meetingId)) {
        // Remove from participants
        const participants = meetings.get(meetingId);
        participants.delete(socket.id);
        
        // Notify others that this user left
        socket.to(meetingId).emit('participant-left', {
          participantId: socket.id
        });
        
        // If no participants left, clean up the meeting
        if (participants.size === 0) {
          meetings.delete(meetingId);
        }
      }
      
      // Clean up socket mapping
      socketToMeeting.delete(socket.id);
    });
  });

  return io;
}

// No need for another export here as the function is already exported above