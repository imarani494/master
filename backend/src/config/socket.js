const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");

let io;

// Initialize Socket.IO
const initializeSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  // Authentication middleware for socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication error"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  // Handle socket connections
  io.on("connection", (socket) => {
    console.log(`✅ User connected: ${socket.userId}`);

    // Join user-specific room
    socket.join(`user_${socket.userId}`);

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.userId}`);
    });

    // Handle custom events
    socket.on("join-lead", (leadId) => {
      socket.join(`lead_${leadId}`);
    });

    socket.on("leave-lead", (leadId) => {
      socket.leave(`lead_${leadId}`);
    });
  });

  return io;
};

// Emit notification to specific user
const emitToUser = (userId, event, data) => {
  if (io) {
    io.to(`user_${userId}`).emit(event, data);
  }
};

// Emit notification to specific lead room
const emitToLead = (leadId, event, data) => {
  if (io) {
    io.to(`lead_${leadId}`).emit(event, data);
  }
};

// Broadcast to all connected clients
const broadcast = (event, data) => {
  if (io) {
    io.emit(event, data);
  }
};

module.exports = {
  initializeSocket,
  emitToUser,
  emitToLead,
  broadcast
};
