"use client";
import React from "react";

const Support = () => {
  return (
    <section className="w-full py-16 bg-[#f9fafb]">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-semibold text-center text-[#1D5E8E]">
          Support & Help Center
        </h2>
        <p className="text-center mt-4 text-gray-600">
          Find quick answers to common questions or chat with our AI assistant
          directly on this site.
        </p>

        <div className="mt-10 space-y-6">
          <details className="bg-white p-4 rounded-lg shadow-sm">
            <summary className="font-semibold text-[#1D5E8E]">
              How do I switch to Prosperity Tech Service?
            </summary>
            <p className="mt-2 text-gray-600">
              You can switch easily through our Plans page — choose a plan and
              follow the guided eSIM or porting steps.
            </p>
          </details>

          <details className="bg-white p-4 rounded-lg shadow-sm">
            <summary className="font-semibold text-[#1D5E8E]">
              How do I contact support?
            </summary>
            <p className="mt-2 text-gray-600">
              You can reach us via the Contact page or by using our AI Chat
              Widget at the bottom-right corner of the site.
            </p>
          </details>
        </div>
      </div>
    </section>
  );
};

export default Support;
