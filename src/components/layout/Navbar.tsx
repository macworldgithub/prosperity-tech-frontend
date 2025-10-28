"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import logo from "../../../public/images/logo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="relative flex items-center justify-between bg-[#1d5e8e] px-6 sm:px-8 py-6 w-full z-50">
      {/* Left Spacer (for alignment) */}
      <div className="w-[60px] sm:w-[100px]" />

      {/* Centered Logo */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <Image
          src={logo}
          alt="Prosperity Logo"
          width={90}
          height={90}
          priority
          className="object-contain"
        />
      </div>

      {/* Right Side Menu (Desktop) */}
      <div className="hidden sm:flex items-center space-x-6">
        <Link
          href="/login"
          className="text-white hover:text-green-300 transition-colors font-medium"
        >
          Login
        </Link>
        <button className="px-4 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-[#0f3046] to-[#1a5324] hover:opacity-90 transition-all">
          Download
        </button>
      </div>

      {/* Mobile Menu Icon */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="sm:hidden text-white focus:outline-none z-50"
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#1d5e8e] flex flex-col items-center py-6 space-y-4 sm:hidden shadow-lg z-40">
          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className="text-white text-lg hover:text-green-300 transition-colors font-medium"
          >
            Login
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            className="px-6 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-[#0f3046] to-[#1a5324] hover:opacity-90 transition-all"
          >
            Download
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
