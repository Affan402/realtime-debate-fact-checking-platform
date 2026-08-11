// Socket.IO Client Service
// Manages real-time socket connection to the backend for live debate updates

import { io, type Socket } from "socket.io-client";

// Socket URL is the backend root (no /api path) since socket.io runs on the HTTP server
const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

let socket: Socket | null = null;

/**
 * Initialize (or return existing) socket connection.
 * Lazily connects on first call so we don't open a socket until needed.
 */
export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("[socket] Connected:", socket?.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("[socket] Disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("[socket] Connection error:", err.message);
    });
  }
  return socket;
}

/**
 * Join a debate room to receive real-time arguments for that debate.
 */
export function joinRoom(debateId: string): void {
  const s = getSocket();
  if (s.connected) {
    s.emit("join_room", debateId);
  } else {
    // If not yet connected, join once the connection is established
    s.once("connect", () => s.emit("join_room", debateId));
  }
}

/**
 * Broadcast a new argument to all participants in the debate room.
 */
export function emitNewArgument(data: {
  debateId: string;
  speakerName: string;
  claim: string;
  evidence?: string;
}): void {
  const s = getSocket();
  s.emit("new_argument", data);
}

/**
 * Subscribe to incoming arguments broadcast to the room.
 * Returns an unsubscribe function.
 */
export function onReceiveArgument(
  cb: (argument: any) => void
): () => void {
  const s = getSocket();
  s.on("receive_argument", cb);
  return () => {
    s.off("receive_argument", cb);
  };
}

/**
 * Disconnect and clean up the socket (call on component unmount if desired).
 */
export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export default { getSocket, joinRoom, emitNewArgument, onReceiveArgument, disconnectSocket };
