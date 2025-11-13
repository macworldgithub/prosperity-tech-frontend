import ChatWindow from "@/components/ChatWindow";
import Footer from "@/components/layout/Footer";
import React from "react";

export default function ChatPage() {
  return (
    <React.Suspense fallback={<div>Loading chat...</div>}>
      <ChatWindow />
    </React.Suspense>
  );
}
