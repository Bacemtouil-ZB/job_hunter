"use client";

import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import ChatList from "@/components/ChatList";
import ChatWindow from "@/components/ChatWindow";

// Dummy logged-in candidate user
const dummyCandidate = { _id: "6918b49f6b0c3df8f27e711d", name: "Arwed Melliti" };

// Recruiter dummy for demo
const recruiter = { _id: "69261a2b0229a39fa77cabb7", name: "touil bacem" };

// Socket connection
const socket = io("http://localhost:8000", { withCredentials: true });

export default function ChatPage() {
  const [user, setUser] = useState(dummyCandidate);
  const [conversation, setConversation] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    // Join candidate private room
    socket.emit("join", user._id);

    // Fetch or create a conversation with recruiter
    const fetchConversation = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/v1/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ senderId: user._id, receiverId: recruiter._id }),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }

        const conv = await res.json();
        setConversation(conv);
      } catch (err) {
        console.error("Error fetching/creating conversation:", err);
      }
    };

    fetchConversation();
  }, [user]);

  if (!user) return <div>Loading user...</div>;
  if (!conversation) return <div>Loading conversation...</div>;

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <ChatList user={user} setCurrentConversation={setConversation} />
      <ChatWindow user={user} conversation={conversation} socket={socket} />
    </div>
  );
}
