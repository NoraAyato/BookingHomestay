// MongoDB Initialization Script
// Chạy khi container MongoDB khởi động lần đầu

// Switch to chat_db database
db = db.getSiblingDB("chat_db");

// Create user with read/write permissions
db.createUser({
  user: "chat_user",
  pwd: "chat_password",
  roles: [
    {
      role: "readWrite",
      db: "chat_db",
    },
  ],
});

// Create collections with indexes
db.createCollection("conversations");
db.createCollection("messages");

// Create indexes for better query performance
db.conversations.createIndex({ userId: 1 });
db.conversations.createIndex({ hostId: 1 });
db.conversations.createIndex({ homestayId: 1 });
db.conversations.createIndex({ lastMessageAt: -1 });

db.messages.createIndex({ conversationId: 1, sentAt: -1 });
db.messages.createIndex({ senderId: 1 });

print("✅ MongoDB initialization completed successfully!");
print("📦 Database: chat_db");
print("👤 User: chat_user");
print("📊 Collections created: conversations, messages");
print("🔍 Indexes created for optimal query performance");
