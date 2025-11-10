"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import logo from "../../../public/images/logo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Plans", href: "/plans" },
    { name: "Support", href: "/support" },
    { name: "Partners", href: "/partners" },
  ];

  return (
    <nav className="fixed top-0 left-0 z-[100] flex items-center justify-between bg-[#1d5e8e] px-6 sm:px-10 py-5 w-full shadow-md">
      {/* Left Side - Nav Links (Desktop) */}
      <div className="hidden lg:flex items-center space-x-6">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-white text-sm font-medium tracking-wide transition-colors ${
              pathname === link.href
                ? "text-green-300"
                : "hover:text-green-300"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Centered Logo */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <Link href="/">
          <Image
            src={logo}
            alt="Prosperity Logo"
            width={90}
            height={90}
            priority
            className="object-contain"
          />
        </Link>
      </div>

      {/* Right Side - Auth Buttons (Desktop) */}
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
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`text-white text-lg font-medium transition-colors ${
                pathname === link.href
                  ? "text-green-300"
                  : "hover:text-green-300"
              }`}
            >
              {link.name}
            </Link>
          ))}

          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className="text-white text-lg hover:text-green-300 font-medium"
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
