"use client";
import React from "react";

const HeroSection = () => {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#003c82] to-[#032d5a] text-center text-white overflow-hidden">
      {/* Background wave effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/waves.svg')] bg-cover bg-center opacity-40"></div>

      {/* Hero Content */}
      <div className="relative z-10 mt-24 px-6">
        {/* App mockup images */}
        <div className="flex justify-center items-center gap-6 mb-10">
          <img
            src="/phone1.png"
            alt="Phone screen"
            className="w-[180px] sm:w-[200px]"
          />
          <img
            src="/phone2.png"
            alt="Phone screen"
            className="w-[180px] sm:w-[200px]"
          />
          <img
            src="/phone3.png"
            alt="Phone screen"
            className="w-[180px] sm:w-[200px]"
          />
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
          Your virtual assistant <br />
          <span className="text-green-300">AI Chatbot for all your needs</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-xl mx-auto text-gray-200 mb-8">
          Get instant assistance, answers, and more with our AI-powered
          chatbot. A smarter way to interact and simplify your tasks.
        </p>

        {/* Button */}
        <button className="px-8 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition-all">
          Switch to E-Sim
        </button>
      </div>

      {/* Trusted by */}
      <div className="relative z-10 mt-16">
        <p className="text-sm text-gray-300 mb-4">Trusted by</p>
        <div className="flex flex-wrap justify-center gap-8 opacity-70">
          <img src="/brands/fancywear.svg" alt="Fancywear" className="h-6" />
          <img src="/brands/home2stay.svg" alt="home2stay" className="h-6" />
          <img src="/brands/payscale.svg" alt="payscale" className="h-6" />
          <img src="/brands/people.svg" alt="People" className="h-6" />
          <img src="/brands/getdonelist.svg" alt="getdonelist" className="h-6" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
