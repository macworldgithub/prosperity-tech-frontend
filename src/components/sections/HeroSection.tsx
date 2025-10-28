"use client";
import React from "react";
import Image from "next/image";
import screen from "../../../public/images/iPhone 14.png";
import screen1 from "../../../public/images/iPhone 13.png";
import screen2 from "../../../public/images/iPhone 15.png";

const HeroSection = () => {
  return (
    <section className="relative flex flex-col items-center justify-center text-center text-white overflow-hidden">
      <div className="absolute inset-0 -z-20 -mt-48 hidden md:block">
        <Image
          src="/images/Union.png"
          alt="Hero Background"
          fill
          className="object-contain object-center opacity-30"
        />
      </div>

      <div className="relative z-10 flex justify-center items-center gap-6 mt-24 mb-10 hidden md:flex">
        <Image
          src={screen}
          alt="Secure Login Screen"
          className="w-[160px] sm:w-[200px] "
        />
        <Image
          src={screen1}
          alt="Chat with AI Screen"
          className="w-[160px] sm:w-[200px] "
        />
        <Image
          src={screen2}
          alt="AI Chat Interface Screen"
          className="w-[160px] sm:w-[200px] "
        />
      </div>

      <div className="-mt-24 md:-mt-36  z-10 flex flex-col items-center justify-center px-6 sm:mt-12">
        <h1 className="text-2xl md:text-5xl font-bold leading-tight mb-4 text-center">
          Your virtual assistant <br />
          <span className="text-3xl md:text-6xl font-extrabold bg-gradient-to-b from-white to-[#2d9558] bg-clip-text text-transparent">
            AI Chatbot for all your needs
          </span>
        </h1>

        <p className="max-w-xl mx-auto text-gray-200 mb-8 text-xs sm:text-sm md:text-lg text-center">
          Get instant assistance, answers, and more with our AI-powered chatbot.
          A smarter way to interact and simplify your tasks.
        </p>

        <button className="px-6 sm:px-10 md:px-20 py-3 bg-gradient-to-r from-[#1d5e8e] to-[#2d9558] text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          Switch to E-Sim
        </button>
      </div>

      <div className="relative z-10 mt-32 w-full px-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-10 max-w-5xl mx-auto ">
          <p className="text-lg text-gray-300 -mt-12">Trusted by</p>
          <Image
            src="/images/trusted.png"
            alt="Trusted by logos"
            width={600}
            height={50}
            className="max-w-full h-auto object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
