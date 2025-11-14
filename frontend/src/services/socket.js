import { io } from "socket.io-client";
import { SOCKET_URL } from "../utils/constants";

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(token) {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        auth: { token },
        transports: ["websocket"]
      });

      this.socket.on("connect", () => {
        console.log("✅ Socket connected");
      });

      this.socket.on("disconnect", () => {
        console.log("❌ Socket disconnected");
      });

      this.socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  joinLead(leadId) {
    this.emit("join-lead", leadId);
  }

  leaveLead(leadId) {
    this.emit("leave-lead", leadId);
  }
}

export default new SocketService();
