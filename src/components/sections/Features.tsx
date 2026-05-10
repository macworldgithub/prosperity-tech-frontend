"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Features = () => {
  const router = useRouter();
  const handleSwitchToEsim = () => {
    router.push("/chat-window?fromBanner=true");
  };
  return (
    <section className="w-full py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Outer card */}
        <div className="bg-[#F2F9FF] rounded-3xl shadow-lg p-6 sm:p-10 overflow-hidden">
          {/* Inner card */}
          <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-10">
            {/* Header */}
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-4xl font-bold text-[#0a2a13] flex items-center justify-center gap-2">
                The{" "}
                <span className="bg-gradient-to-b from-[#2e6996] to-[#31827a] bg-clip-text text-transparent">
                  Features
                </span>
                <Image
                  src="/images/Star.png"
                  alt="Star icon"
                  width={24}
                  height={24}
                  className="inline-block align-super -mt-2"
                />
              </h2>
              <p className="mt-3 font-bold text-black">How it works</p>
              <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-[#34a944]" />
            </div>

            {/* Content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-16 items-center">
              {/* Text side */}
              <div className="order-2 lg:order-1">
                <h3 className="text-xl sm:text-2xl font-semibold text-[#0a2a13] mb-6">
                  Our AI will walk you through the setup:
                </h3>

                <div className="relative pl-10">
                  <div className="absolute left-2 top-1 bottom-1 w-0.5 bg-[#22689c]" />
                  {[
                    "Choose the plan you want.",
                    "Keep your old number or pick a new one.",
                    "Check your email for the QR code to click.",
                    "Your phone will do the rest.",
                  ].map((txt, i) => (
                    <div key={i} className="mb-4 relative">
                      <p className="text-gray-800">{txt}</p>
                    </div>
                  ))}
                </div>

                <p className="mt-4 max-w-md text-sm text-gray-500">
                  Just have your ID ready, and existing{" "}
                  <span className="underline">customer number</span>, if you are
                  transferring your number and let’s go!
                </p>
                {/* 
                <button
                  className="mt-8 px-6 py-3 rounded-xl bg-white border border-gray-200 shadow-[0_6px_24px_rgba(43,182,115,0.25)] text-gray-900 font-semibold hover:bg-gray-50"
                  onClick={handleSwitchToEsim}
                >
                  Get your E-sim
                </button> */}
              </div>

              {/* Image side */}
              <div className="order-1 lg:order-2 flex justify-center">
                <div className="relative">
                  {/* Phone image – responsive */}
                  <Image
                    src="/images/Iphone15.png"
                    alt="App chat preview on phone"
                    width={520}
                    height={1040}
                    className="w-full max-w-[260px] sm:max-w-[300px] lg:max-w-[320px] drop-shadow-[0_60px_100px_rgba(43,182,115,0.35)] rounded-[42px] object-contain"
                    priority
                  />
                  {/* Glow background */}
                  <div className="absolute -z-10 inset-0 mx-auto blur-3xl rounded-full bg-[#2bb673]/30 translate-y-24 w-64 h-64" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
