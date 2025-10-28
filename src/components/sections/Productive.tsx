"use client";
import React from "react";

const Productive = () => {
  return (
    <section className="relative w-full py-20 sm:py-24 bg-[#0e4b76] text-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center text-center">
        <img
          src="/images/logo.png"
          alt="Prosperity"
          className="h-12 sm:h-14 mb-8 opacity-90"
        />

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight max-w-3xl">
          Try the app for free to be more
          <br />
          <span className="text-[#2bb673]">productive than ever</span>
        </h2>

        <p className="mt-4 text-gray-200">Smart, Free and Amazing</p>

        <div className="mt-10 flex items-center gap-4 sm:gap-6 flex-wrap justify-center">
          <a href="#" aria-label="Get it on Google Play">
            <img
              src="/images/google.png"
              alt="Get it on Google Play"
              className="h-12 sm:h-14 drop-shadow"
            />
          </a>
          <a href="#" aria-label="Download on the App Store">
            <img
              src="/images/app.png"
              alt="Download on the App Store"
              className="h-12 sm:h-14 drop-shadow"
            />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Productive;
