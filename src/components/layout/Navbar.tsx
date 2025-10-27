"use client";
import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-transparent absolute top-0 left-0 w-full z-10">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <img src="/logo.svg" alt="Prosperity Logo" className="h-10 w-auto" />
        <span className="text-white text-lg font-semibold">Prosperity</span>
      </div>

      {/* Menu */}
      <div className="flex items-center space-x-6">
        <Link
          href="/login"
          className="text-white hover:text-green-300 transition-colors"
        >
          Login
        </Link>
        <button className="bg-green-400 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-500 transition-colors">
          Download
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
