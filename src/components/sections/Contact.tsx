"use client";
import React from "react";
import Image from "next/image";

const Contact = () => {
  return (
    <section className="w-full py-16 sm:py-20 bg-[#1D5E8E]">
      <div className="w-full px-6">
        <div className="rounded-[32px] bg-white overflow-hidden shadow-xl ">
          <div className="px-6 sm:px-10 py-10">
            <div className="text-center mb-8">
              {/* <h2 className="text-2xl sm:text-3xl font-semibold text-gradient-to-r from-[#0f3046] to-[#1a5324]">
                Contact Us
              </h2> */}
              <h2 className="text-2xl sm:text-3xl font-semibold bg-gradient-to-r from-[#499758] to-[#07263a] bg-clip-text text-transparent">
                Contact Us
              </h2>

              <p className="mt-2 text-sm text-gray-500 max-w-xl mx-auto">
                AI Chat App provides a simple and secure way to connect to your
                app using API.
              </p>
            </div>

            <form className="space-y-4 max-w-2xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full rounded-md bg-[#6147AC0D] border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-[#2bb673] text-black"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full rounded-md bg-[#6147AC0D] border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-[#2bb673] text-black"
                />
              </div>

              <textarea
                placeholder="Message"
                rows={4}
                className="w-full rounded-md bg-[#6147AC0D] border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-[#2bb673] text-black"
              />

              <div className="flex justify-center">
                <button
                  type="button"
                  className="px-8 py-2 rounded-md bg-gradient-to-r from-[#41be58] to-[#438cbd]   font-semibold shadow-md hover:opacity-95"
                >
                  Enter
                </button>
              </div>
            </form>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-start max-w-3xl mx-auto">
              <div>
                <p className="text-2xl font-semibold text-black">+0184185935</p>
                <p className="mt-2 font-semibold tracking-wide text-black">
                  prosperitytech@gmail.com
                </p>
              </div>

              <div>
                <div className="h-40 rounded-xl bg-gray-200" />
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                  {/* <span className="inline-block h-2 w-2 rounded-full bg-[#2bb673]" /> */}
                  <img src="/images/arrow.png" className="" />

                  <span>21 Jump ST, Australia</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#eaf4ff] text-center text-xs text-gray-500 py-4">
            ©Copyright 2020 Prosperity Technology Solutions Pty Ltd ABN 48 636
            939 912
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
