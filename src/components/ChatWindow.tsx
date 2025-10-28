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
              <span className="text-white font-semibold text-sm">
                Prosperity Technology Solutions
              </span>
            </div>
            <button className="text-white text-xl font-bold hover:text-gray-200 transition-colors">
              ×
            </button>
          </div>

          {/* Chat Content */}
          <div className="flex-1 flex flex-col bg-gradient-to-b from-[#33a748] via-[#257773] to-[#1e608c] p-4 overflow-y-auto">
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
                  src="/images/person-icon.png"
                  alt="User Avatar"
                  className="w-full h-full rounded-full"
                />
              </div>
              <div className="bg-transparent rounded-2xl px-4 py-3 max-w-[70%]">
                <p className="text-white text-sm leading-relaxed">
                  Hi there, I would be glad to help. How can I help?
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col gap-2 mb-6">
              <button className="bg-white/20 backdrop-blur-sm rounded-xl py-3 px-4 text-white font-medium hover:bg-white/30 transition-colors text-sm">
                Get Technical Support
              </button>
              <button className="bg-white/20 backdrop-blur-sm rounded-xl py-3 px-4 text-white font-medium hover:bg-white/30 transition-colors text-sm">
                Something else
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 border border-white rounded-full ">
            <input
              type="text"
              placeholder="Message..."
              className="flex-1 backdrop-blur-sm rounded-full px-4 py-2 text-white placeholder-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
