"use client";
import React from "react";

const ChatWindow = () => {
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

            <div className="flex items-start gap-3 mb-6">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden">
                <img
                  src="/images/person.png"
                  alt="User Avatar"
                  className="w-full h-full rounded-full"
                />
              </div>
              <div className="bg-white rounded-full px-4 py-2 shadow-md max-w-[70%]">
                <p className="text-[#0E3B5C] text-sm leading-relaxed">
                  Hi there, I would be glad to help. How can I help?
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <button className="bg-white text-[#0E3B5C] rounded-full py-2.5 px-5 text-sm font-medium shadow-md hover:bg-white/90">
                Get Technical Support
              </button>
              <button className="bg-white text-[#0E3B5C] rounded-full py-2.5 px-5 text-sm font-medium shadow-md hover:bg-white/90">
                Something else
              </button>
            </div>

            {/* Input Bar inside panel */}
            <div className="mt-auto">
              <div className="flex items-center gap-3 border border-white/30 rounded-full px-4 py-3 bg-white/10 backdrop-blur-sm text-white">
                <input
                  type="text"
                  placeholder="Message..."
                  className="flex-1 bg-transparent text-white placeholder-white/70 text-sm focus:outline-none"
                />

                <button className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#2bb673] hover:opacity-90">
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
