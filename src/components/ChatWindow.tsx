"use client";
import React, { useState } from "react";

const ChatWindow = () => {
  const [chat, setChat] = useState<
    { id: number; type: "user" | "bot"; text: string; time: string }[]
  >([
    {
      id: 1,
      type: "bot",
      text: "Hi there, I would be glad to help. How can I help?",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMsg = {
      id: chat.length + 1,
      type: "user" as const,
      text: message.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChat((prev) => [...prev, userMsg]);
    setMessage("");
    setLoading(true);

    try {
      const payload = sessionId
        ? { query: userMsg.text, session_id: sessionId }
        : { query: userMsg.text };

      const response = await fetch("/api", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (!sessionId && data.session_id) {
        setSessionId(data.session_id);
      }

      const botMsg = {
        id: chat.length + 2,
        type: "bot" as const,
        text:
          data?.message ||
          data?.response ||
          "Sorry, I couldn’t understand that.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setChat((prev) => [...prev, botMsg]);
    } catch (error: any) {
      console.error("Full Chat error:", error); // Enhanced logging
      let errorMsg = "Oops! Something went wrong. Please try again.";
      if (
        error.name === "TypeError" &&
        error.message.includes("Failed to fetch")
      ) {
        errorMsg = "Network error (CORS?). Check console and try refreshing.";
      } else if (error.message.includes("401")) {
        errorMsg = "Session expired. Please log in again.";
      }
      const errorResponse = {
        id: chat.length + 2,
        type: "bot" as const,
        text: errorMsg,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setChat((prev) => [...prev, errorResponse]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Background with image */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/bg.png')",
        }}
      />

      {/* Chat Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="w-5xl h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-3 bg-[#215988] rounded-t-2xl">
            <div className="flex items-center gap-2">
              <div className="relative w-12 h-12">
                <img
                  src="/images/logo.png"
                  alt="Prosperity Tech Logo"
                  className="w-full h-full"
                />
              </div>
            </div>
            <button className="text-white text-xl font-bold hover:text-gray-200 transition-colors">
              ×
            </button>
          </div>

          <div className="h-1 w-full bg-gradient-to-r from-[#215988] via-[#2bb673] to-[#215988]" />

          {/* Chat Body */}
          <div className="flex-1 flex flex-col bg-gradient-to-b from-[#33a748] via-[#257773] to-[#1e608c] p-6 overflow-y-auto rounded-b-2xl ring-1 ring-white/20 shadow-[inset_0_8px_24px_rgba(0,0,0,0.25)]">
            <div className="text-center mb-6 mt-8">
              <div className="mx-auto mb-2 w-20 h-20">
                <img
                  src="/images/logo.png"
                  alt="Prosperity Tech Logo"
                  className="w-full h-full"
                />
              </div>
              <h2 className="text-white font-bold text-lg mb-1">
                How can I help you today?
              </h2>
            </div>

            {/* Chat Messages */}
            {chat.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 mb-6 ${
                  msg.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.type === "bot" && (
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden">
                    <img
                      src="/images/bot.png"
                      alt="Bot Avatar"
                      className="w-full h-full rounded-full"
                    />
                  </div>
                )}

                <div
                  className={`${
                    msg.type === "user"
                      ? "bg-white text-[#0E3B5C]"
                      : "bg-white text-[#0E3B5C]"
                  } rounded-full px-6 py-2 shadow-md max-w-[70%]`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="flex items-start gap-3 mb-6">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center overflow-hidden">
                  <img
                    src="/images/bot.png"
                    alt="Loading Avatar"
                    className="w-full h-full rounded-full"
                  />
                </div>
                <div className="bg-white rounded-full px-6 py-2 shadow-md max-w-[70%]">
                  <p className="text-[#0E3B5C] text-sm leading-relaxed">
                    Typing...
                  </p>
                </div>
              </div>
            )}

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <button
                onClick={() => {
                  setMessage("Get Technical Support");
                  sendMessage();
                }}
                className="bg-white text-[#0E3B5C] rounded-full py-2.5 px-5 text-sm font-medium shadow-md hover:bg-white/90"
              >
                Get Technical Support
              </button>
              <button
                onClick={() => {
                  setMessage("Something else");
                  sendMessage();
                }}
                className="bg-white text-[#0E3B5C] rounded-full py-2.5 px-5 text-sm font-medium shadow-md hover:bg-white/90"
              >
                Something else
              </button>
            </div>

            {/* Input Bar */}
            <div className="mt-auto">
              <div className="flex items-center gap-3 border border-white/30 rounded-full px-4 py-3 bg-white/10 backdrop-blur-sm text-white">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Message..."
                  className="flex-1 bg-transparent text-white placeholder-white/70 text-sm focus:outline-none"
                />

                <button
                  onClick={sendMessage}
                  disabled={loading}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#2bb673] hover:opacity-90 disabled:opacity-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    className="w-4 h-4"
                  >
                    <path d="M22 2L11 13" />
                    <path d="M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
