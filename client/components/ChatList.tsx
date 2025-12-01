"use client";

import { useEffect, useState } from "react";

// Recruiter dummy for demo
const recruiter = { _id: "69261a2b0229a39fa77cabb7", name: "touil bacem" };


export default function ChatList({ user, setCurrentConversation }: any) {
  const [conversation, setConversation] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    // Fetch or create the conversation with recruiter
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

  if (!conversation) return <div>Loading conversation...</div>;

  return (
    <div style={{ width: "30%", borderRight: "1px solid #ddd", padding: "10px" }}>
      <h3>Conversations</h3>
      <div
        style={{
          padding: "10px",
          cursor: "pointer",
          borderBottom: "1px solid #eee",
        }}
        onClick={() => setCurrentConversation(conversation)}
      >
        <strong>{recruiter.name}</strong>
      </div>
    </div>
  );
}
