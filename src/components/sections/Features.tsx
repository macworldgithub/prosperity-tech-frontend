"use client";
import React from "react";
import Image from "next/image";

const Features = () => {
  return (
    <section className="w-full py-20 ">
      <div className="mx-auto px-6">
        <div className="bg-[#F2F9FF] rounded-3xl shadow-lg p-6 sm:p-10 relative overflow-hidden">
          <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-10 relative overflow-hidden">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#0a2a13] flex items-center justify-center gap-2">
                The{" "}
                <span className="bg-gradient-to-b from-[#2e6996] to-[#31827a] bg-clip-text text-transparent">
                  Features
                </span>
                {/* ✅ Replaced + with star.png */}
                <Image
                  src="/images/Star.png"
                  alt="Star icon"
                  width={24}
                  height={24}
                  className="inline-block align-super -mt-2"
                />
              </h2>
              <p className="text-black mt-3 font-bold">How it works</p>
              <div className="h-1 bg-[#34a944] rounded-full mt-4 w-6xl item-center mx-auto" />
            </div>
            <div className="grid grid-cols-1 lg:flex gap-42 items-center justify-center">
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-[#0a2a13] mb-6">
                  Our AI will walk you through the setup:
                </h3>

                <div className="relative pl-10">
                  <div className="absolute left-2 top-1 bottom-1 w-0.5 bg-[#22689c]" />

                  <div className="mb-6 relative">
                    <p className="text-gray-800">Choose the plan you want.</p>
                  </div>

                  <div className="mb-6 relative">
                    <p className="text-gray-800">
                      Keep your old number or pick a new one.
                    </p>
                  </div>

                  <div className="mb-6 relative">
                    <p className="text-gray-800">
                      Check your email for the QR code to click.
                    </p>
                  </div>

                  <div className="mb-6 relative">
                    <p className="text-gray-800">
                      Your phone will do the rest.
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-500 mt-2 max-w-md">
                  Just have your ID ready, and existing{" "}
                  <span className="underline">customer number</span>, if you are
                  transferring your number and let’s go!
                </p>

                <button className="mt-8 px-6 py-3 rounded-xl bg-white border border-gray-200 shadow-[0_6px_24px_rgba(43,182,115,0.25)] text-gray-900 font-semibold hover:bg-gray-50">
                  Get your E-sim
                </button>
              </div>

              <div className="flex justify-center">
                <div className="relative">
                  <img
                    src="/images/IPhone15.png"
                    alt="App chat preview on phone"
                    className="w-[60px] sm:w-[300px] lg:w-[260px] drop-shadow-[0_60px_100px_rgba(43,182,115,0.35)] rounded-[42px]"
                  />
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
