"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-2xl bg-[#1c5078] py-4 px-6 mb-4">
      <button
        className="flex justify-between items-center w-full text-left text-lg font-semibold text-white focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {question}
        <svg
          className={`w-6 h-6 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>
      {isOpen && (
        <p className="mt-4 text-gray-300 pr-8 animate-fade-in">{answer}</p>
      )}
    </div>
  );
};

const FAQSection = () => {
  const router = useRouter();

  const faqs = [
    {
      question: "How does prosperity app work?",
      answer:
        "Our VPN encrypts your internet connection and routes your data through our secure servers, masking your IP address and preventing anyone from tracking your online activities.",
    },
    {
      question: "Is prosperity app easy to use?",
      answer:
        "Yes, prosperity app is designed with user-friendliness in mind. Our intuitive interface makes it easy for anyone to connect and secure their internet connection with just a few taps.",
    },
    {
      question: "Can I use prosperity app on multiple devices?",
      answer:
        "Absolutely! With a single prosperity app subscription, you can protect multiple devices simultaneously, including smartphones, tablets, laptops, and more.",
    },
    {
      question: "What kind of encryption does prosperity app use?",
      answer:
        "We utilize industry-leading encryption protocols like AES-256 to ensure your data remains secure and private from cyber threats.",
    },
    {
      question: "In how many countries is prosperity app available?",
      answer:
        "Prosperity app offers servers in over 50 countries worldwide, giving you access to a vast network and allowing you to bypass geo-restrictions.",
    },
  ];
  const handleChatClick = () => {
    router.push("/chat-window"); // Modified route path to follow convention
  };

  return (
    <section className="py-20 px-6 text-white">
      <div className="mx-auto flex flex-col lg:flex-row gap-16">
        <div className="lg:w-1/3">
          <h2 className="text-4xl font-bold mb-4">
            Frequently <br />
            Asked Questions
          </h2>
          <p className="text-gray-300 mb-8">
            Have general questions? Please contact our team!
          </p>
          <button
            onClick={handleChatClick}
            className="px-8 py-3 bg-[#34a944] text-white font-semibold rounded-full shadow-[#0956e3] shadow-lg hover:bg-green-600 transition-colors"
          >
            Chat with AI
          </button>
        </div>

        <div className="lg:w-2/3 space-y-4 ">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
