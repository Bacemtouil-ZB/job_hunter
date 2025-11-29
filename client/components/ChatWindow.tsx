"use client";

import { useEffect, useState, useRef } from "react";
import { Send, MessageSquare, Clock } from "lucide-react";

export default function ChatWindow({ user, conversation, socket }: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load messages when conversation changes
  useEffect(() => {
    if (!conversation?._id) return;

    setIsLoading(true);
    fetch(`http://localhost:8000/api/v1/conversation/${conversation._id}`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data.messages || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, [conversation]);

  // Listen for incoming socket messages
  useEffect(() => {
    const handleMessage = (msg: any) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("receiveMessage", handleMessage);
    return () => socket.off("receiveMessage", handleMessage);
  }, [socket]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    const newMsg = {
      conversationId: conversation._id,
      sender: user._id,
      text,
    };

    try {
      const res = await fetch("http://localhost:8000/api/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMsg),
      });

      const saved = await res.json();

      // Emit via socket
      const receiver = conversation.members.find((m: any) => m._id !== user._id);
      socket.emit("sendMessage", { senderId: user._id, receiverId: receiver?._id, text });

      setMessages((prev) => [...prev, saved]);
      setText("");
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (timestamp: string) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getOtherMember = () => {
    return conversation?.members?.find((m: any) => m._id !== user._id);
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <MessageSquare size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No conversation selected</h3>
          <p className="text-gray-500">Pick a conversation from the sidebar to start chatting</p>
        </div>
      </div>
    );
  }

  const otherMember = getOtherMember();

  return (
    <div className="flex-1 flex flex-col bg-white h-full">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white font-semibold text-lg">
            {otherMember?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h2 className="text-white font-semibold text-lg">
              {otherMember?.name || "Chat"}
            </h2>
            <p className="text-blue-100 text-sm">Active now</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-4 bg-gradient-to-b from-gray-50 to-white"
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-gray-400">Loading messages...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageSquare size={48} className="text-gray-300 mb-3" />
            <p className="text-gray-500 text-lg mb-1">No messages yet</p>
            <p className="text-gray-400 text-sm">Start the conversation by sending a message</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, i) => {
              const isOwn = msg.sender === user._id;
              return (
                <div
                  key={i}
                  className={`flex ${isOwn ? "justify-end" : "justify-start"} animate-[fadeIn_0.3s_ease-in]`}
                >
                  <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"} max-w-[70%]`}>
                    <div
                      className={`px-4 py-2.5 rounded-2xl shadow-sm ${
                        isOwn
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none"
                          : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm leading-relaxed break-words">{msg.text}</p>
                    </div>
                    {msg.createdAt && (
                      <div className="flex items-center gap-1 mt-1 px-2">
                        <Clock size={12} className={isOwn ? "text-blue-400" : "text-gray-400"} />
                        <span className={`text-xs ${isOwn ? "text-blue-600" : "text-gray-500"}`}>
                          {formatTime(msg.createdAt)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="px-6 py-4 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex gap-3 items-end max-w-4xl mx-auto">
          <textarea
            className="flex-1 resize-none border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm max-h-32"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message..."
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <button
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3.5 rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            onClick={sendMessage}
            disabled={!text.trim()}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}