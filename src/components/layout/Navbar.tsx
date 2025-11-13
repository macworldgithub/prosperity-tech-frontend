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
    { name: "Support", href: "/support" },
    { name: "Partners", href: "/partners" },
  ];

  return (
    <nav className="relative top-0 left-0 w-full z-50 bg-gradient-to-r from-[#1d5e8e] to-[#145374] shadow-lg transition-all duration-300 p-5">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 sm:px-10 py-4 relative">
        {/* Desktop Links */}
        <div className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-white text-sm font-semibold tracking-wide transition-colors duration-300 relative ${
                pathname === link.href
                  ? "text-green-300"
                  : "hover:text-green-300"
              }`}
            >
              {link.name}
              <span
                className={`absolute left-0 -bottom-1 h-0.5 w-full bg-green-300 transition-all duration-300 ${
                  pathname === link.href ? "scale-x-100" : "scale-x-0 hover:scale-x-100"
                }`}
              ></span>
            </Link>
          ))}
        </div>

        {/* Logo */}
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

        {/* Mobile Menu Button */}
        <div className="lg:hidden z-50">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white p-2 rounded-md hover:bg-white/20 transition"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden fixed top-0 left-0 w-full h-screen bg-[#1d5e8e]/95 backdrop-blur-sm flex flex-col items-center justify-center space-y-8 transform transition-transform duration-300 ${
            menuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`text-white text-2xl font-semibold transition-colors duration-300 ${
                pathname === link.href ? "text-green-300" : "hover:text-green-300"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
