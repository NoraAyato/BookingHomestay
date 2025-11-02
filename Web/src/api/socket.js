import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { BASE_URL } from "./config";

let stompClient = null;
let subscriptions = {};
let onConnectCallback = null; // Store callback để gọi khi connected

// Helper function để tạo STOMP client
const createStompClient = (token) => {
  const client = new Client({
    // Sử dụng SockJS để có fallback options
    webSocketFactory: () => new SockJS(`${BASE_URL}/ws`),

    // Connection headers với JWT token
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },

    // Reconnect settings
    reconnectDelay: 5000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,

    // Debug logging
    debug: (str) => {
      //   console.log("🔵 STOMP:", str);
    },

    // Callbacks
    onConnect: (frame) => {
      console.log("✅ STOMP connected:", frame);
      // Gọi callback nếu có (để setup subscriptions)
      if (onConnectCallback) {
        onConnectCallback();
      }
    },

    onStompError: (frame) => {
      //   console.error("🔴 STOMP error:", frame);
    },

    onWebSocketClose: (event) => {
      //   console.log("❌ WebSocket closed:", event);
    },

    onWebSocketError: (event) => {
      //   console.error("🔴 WebSocket error:", event);
    },

    onDisconnect: () => {
      console.log("🔌 STOMP disconnected");
      subscriptions = {}; // Clear subscriptions
    },
  });

  return client;
};

// Subscribe to a destination
export const subscribe = (destination, callback) => {
  if (!stompClient || !stompClient.connected) {
    // console.warn(
    //   "⚠️ STOMP client not connected, cannot subscribe to:",
    //   destination
    // );
    return null;
  }

  // Unsubscribe nếu đã có subscription
  if (subscriptions[destination]) {
    subscriptions[destination].unsubscribe();
  }

  // Subscribe và lưu subscription
  const subscription = stompClient.subscribe(destination, (message) => {
    try {
      const data = JSON.parse(message.body);
      callback(data);
    } catch (error) {
      //   console.error("Error parsing message:", error);
      callback(message.body);
    }
  });

  subscriptions[destination] = subscription;
  //   console.log("📡 Subscribed to:", destination);

  return subscription;
};

// Unsubscribe from a destination
export const unsubscribe = (destination) => {
  if (subscriptions[destination]) {
    subscriptions[destination].unsubscribe();
    delete subscriptions[destination];
    // console.log("� Unsubscribed from:", destination);
  }
};

// Send message to destination
export const sendMessage = (destination, body) => {
  if (!stompClient || !stompClient.connected) {
    // console.warn("⚠️ STOMP client not connected, cannot send message");
    return;
  }

  stompClient.publish({
    destination,
    body: JSON.stringify(body),
  });
};

// Helper function để authenticate và connect STOMP với JWT token
export const authenticateSocket = (token, callback = null) => {
  if (!token) {
    // console.warn("⚠️ No token provided for STOMP authentication");
    return;
  }

  // Lưu callback để gọi khi connected
  onConnectCallback = callback;

  // Disconnect existing connection nếu có
  if (stompClient && stompClient.connected) {
    // console.log("🔄 Disconnecting existing STOMP connection...");
    stompClient.deactivate();
  }

  // Tạo client mới với token
  stompClient = createStompClient(token);

  // Activate connection
  stompClient.activate();
};

// Helper function để disconnect STOMP
export const disconnectSocket = () => {
  if (stompClient) {
    // Unsubscribe tất cả
    Object.values(subscriptions).forEach((sub) => sub.unsubscribe());
    subscriptions = {};

    // Deactivate client
    stompClient.deactivate();
    stompClient = null;
    console.log("🔌 STOMP client disconnected and cleaned up");
  }
};

// Get STOMP client instance
export const getStompClient = () => stompClient;

// Check if connected
export const isConnected = () => stompClient && stompClient.connected;

// Register callback khi STOMP connected
export const onStompConnected = (callback) => {
  onConnectCallback = callback;
  // Nếu đã connected rồi, gọi ngay
  if (isConnected()) {
    callback();
  }
};

export default {
  authenticateSocket,
  disconnectSocket,
  subscribe,
  unsubscribe,
  sendMessage,
  getStompClient,
  isConnected,
  onStompConnected,
};
